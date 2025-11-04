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
    const {
      deposit_amount,
      deposit_date,
      scheduled_date,
      tax_period_start,
      tax_period_end,
      quarter,
      tax_year,
      federal_income_tax,
      social_security_tax,
      medicare_tax,
      payment_method = "eftps",
    } = body

    // Validate required fields
    if (!deposit_amount || !deposit_date || !quarter || !tax_year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert EFTPS deposit
    const { data: deposit, error } = await supabase
      .from("eftps_deposits")
      .insert({
        user_id: user.id,
        deposit_amount,
        deposit_date,
        scheduled_date: scheduled_date || deposit_date,
        tax_period_start,
        tax_period_end,
        quarter,
        tax_year,
        federal_income_tax: federal_income_tax || 0,
        social_security_tax: social_security_tax || 0,
        medicare_tax: medicare_tax || 0,
        payment_method,
        deposit_status: scheduled_date ? "scheduled" : "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error scheduling EFTPS deposit:", error)
      return NextResponse.json({ error: "Failed to schedule deposit" }, { status: 500 })
    }

    // Update safe harbor tracking
    await updateSafeHarborTracking(supabase, user.id, tax_year, quarter, deposit_amount)

    return NextResponse.json({
      success: true,
      deposit,
      message: "EFTPS deposit scheduled successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error in schedule-deposit route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function updateSafeHarborTracking(
  supabase: any,
  userId: string,
  taxYear: number,
  quarter: number,
  depositAmount: number,
) {
  // Get existing safe harbor record
  const { data: safeHarbor } = await supabase
    .from("safe_harbor_tracking")
    .select("*")
    .eq("user_id", userId)
    .eq("tax_year", taxYear)
    .eq("quarter", quarter)
    .single()

  if (safeHarbor) {
    const newTotalDeposits = (safeHarbor.total_deposits || 0) + depositAmount
    const newDepositCount = (safeHarbor.deposit_count || 0) + 1

    // Check safe harbor status
    const meets100 = newTotalDeposits >= safeHarbor.safe_harbor_100_percent
    const meets90 = newTotalDeposits >= safeHarbor.safe_harbor_90_percent
    const shortfall = Math.max(0, safeHarbor.safe_harbor_90_percent - newTotalDeposits)

    await supabase
      .from("safe_harbor_tracking")
      .update({
        total_deposits: newTotalDeposits,
        deposit_count: newDepositCount,
        meets_100_percent_safe_harbor: meets100,
        meets_90_percent_safe_harbor: meets90,
        shortfall_amount: shortfall,
        updated_at: new Date().toISOString(),
      })
      .eq("id", safeHarbor.id)
  }
}
