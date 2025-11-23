import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tax_year, quarter, form_941_id } = body

    // Get payroll data for the quarter
    const { data: payrollConnection } = await supabase
      .from("payroll_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("connection_status", "active")
      .single()

    if (!payrollConnection) {
      return NextResponse.json(
        {
          error: "No active payroll connection found. Please connect your payroll provider first.",
        },
        { status: 400 },
      )
    }

    // Calculate quarter dates
    const quarterDates = getQuarterDates(tax_year, quarter)

    // Generate Schedule B entries from payroll data
    // This would integrate with Plaid to get actual payroll dates and amounts
    const scheduleBEntries = await generateScheduleBFromPayroll(
      supabase,
      user.id,
      payrollConnection.id,
      quarterDates.start,
      quarterDates.end,
      form_941_id,
    )

    return NextResponse.json({
      success: true,
      entries: scheduleBEntries,
      message: `Generated ${scheduleBEntries.length} Schedule B entries`,
    })
  } catch (error: any) {
    console.error("[v0] Error generating Schedule B:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getQuarterDates(year: number, quarter: number) {
  const quarters = {
    1: { start: `${year}-01-01`, end: `${year}-03-31` },
    2: { start: `${year}-04-01`, end: `${year}-06-30` },
    3: { start: `${year}-07-01`, end: `${year}-09-30` },
    4: { start: `${year}-10-01`, end: `${year}-12-31` },
  }
  return quarters[quarter as keyof typeof quarters]
}

async function generateScheduleBFromPayroll(
  supabase: any,
  userId: string,
  payrollConnectionId: string,
  startDate: string,
  endDate: string,
  form941Id: string,
) {
  // This would integrate with Plaid to get actual payroll data
  // For now, we'll create a placeholder structure

  const entries = []

  // Example: Get payroll dates from W-2 forms or payroll sync
  const { data: w2Forms } = await supabase
    .from("w2_forms")
    .select("*")
    .eq("user_id", userId)
    .eq("payroll_connection_id", payrollConnectionId)
    .gte("created_at", startDate)
    .lte("created_at", endDate)

  // Calculate tax liability for each payroll date
  // Semi-weekly depositors must deposit within 3 business days
  for (const w2 of w2Forms || []) {
    const taxLiability =
      (w2.federal_withholding || 0) +
      (w2.social_security_withholding || 0) * 2 + // Employer + employee share
      (w2.medicare_withholding || 0) * 2

    const depositDueDate = calculateDepositDueDate(w2.created_at)

    const { data: entry } = await supabase
      .from("schedule_b_entries")
      .insert({
        user_id: userId,
        form_941_id: form941Id,
        payroll_connection_id: payrollConnectionId,
        payroll_date: w2.created_at,
        tax_liability_date: w2.created_at,
        deposit_due_date: depositDueDate,
        tax_liability: taxLiability,
        federal_income_tax: w2.federal_withholding || 0,
        social_security_tax: (w2.social_security_withholding || 0) * 2,
        medicare_tax: (w2.medicare_withholding || 0) * 2,
        source: "payroll_sync",
      })
      .select()
      .single()

    if (entry) entries.push(entry)
  }

  return entries
}

function calculateDepositDueDate(payrollDate: string): string {
  const date = new Date(payrollDate)
  const dayOfWeek = date.getDay()

  // Semi-weekly deposit schedule:
  // - Payroll on Wed, Thu, Fri: Deposit by following Wednesday
  // - Payroll on Sat, Sun, Mon, Tue: Deposit by following Friday

  if (dayOfWeek >= 3 && dayOfWeek <= 5) {
    // Wed-Fri: Due next Wednesday
    const daysUntilWednesday = (10 - dayOfWeek) % 7
    date.setDate(date.getDate() + daysUntilWednesday)
  } else {
    // Sat-Tue: Due next Friday
    const daysUntilFriday = (12 - dayOfWeek) % 7
    date.setDate(date.getDate() + daysUntilFriday)
  }

  return date.toISOString().split("T")[0]
}
