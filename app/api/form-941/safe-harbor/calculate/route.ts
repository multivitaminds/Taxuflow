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
    const { tax_year, quarter, total_tax_liability } = body

    if (!tax_year || !quarter || !total_tax_liability) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate safe harbor amounts
    const safeHarbor100 = total_tax_liability
    const safeHarbor90 = total_tax_liability * 0.9

    // Get current deposits for this quarter
    const { data: deposits } = await supabase
      .from("eftps_deposits")
      .select("deposit_amount")
      .eq("user_id", user.id)
      .eq("tax_year", tax_year)
      .eq("quarter", quarter)
      .in("deposit_status", ["completed", "pending"])

    const totalDeposits = deposits?.reduce((sum, d) => sum + (d.deposit_amount || 0), 0) || 0
    const depositCount = deposits?.length || 0

    // Check safe harbor status
    const meets100 = totalDeposits >= safeHarbor100
    const meets90 = totalDeposits >= safeHarbor90
    const shortfall = Math.max(0, safeHarbor90 - totalDeposits)

    // Calculate recommended catch-up deposit
    const recommendedCatchUp = shortfall > 0 ? shortfall : 0
    const quarterEndDate = getQuarterEndDate(tax_year, quarter)

    // Upsert safe harbor tracking
    const { data: safeHarbor, error } = await supabase
      .from("safe_harbor_tracking")
      .upsert(
        {
          user_id: user.id,
          tax_year,
          quarter,
          quarter_start_date: getQuarterStartDate(tax_year, quarter),
          quarter_end_date: quarterEndDate,
          total_tax_liability,
          safe_harbor_100_percent: safeHarbor100,
          safe_harbor_90_percent: safeHarbor90,
          total_deposits: totalDeposits,
          deposit_count: depositCount,
          meets_100_percent_safe_harbor: meets100,
          meets_90_percent_safe_harbor: meets90,
          shortfall_amount: shortfall,
          recommended_catch_up_deposit: recommendedCatchUp,
          catch_up_deposit_due_date: quarterEndDate,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,tax_year,quarter",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error calculating safe harbor:", error)
      return NextResponse.json({ error: "Failed to calculate safe harbor" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      safeHarbor,
      status: {
        meets100PercentSafeHarbor: meets100,
        meets90PercentSafeHarbor: meets90,
        shortfall,
        recommendedCatchUpDeposit: recommendedCatchUp,
        message: meets90
          ? "You meet safe harbor requirements!"
          : `You need to deposit $${shortfall.toFixed(2)} more to meet 90% safe harbor.`,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error in safe-harbor calculate route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function getQuarterStartDate(year: number, quarter: number): string {
  const dates = {
    1: `${year}-01-01`,
    2: `${year}-04-01`,
    3: `${year}-07-01`,
    4: `${year}-10-01`,
  }
  return dates[quarter as keyof typeof dates]
}

function getQuarterEndDate(year: number, quarter: number): string {
  const dates = {
    1: `${year}-03-31`,
    2: `${year}-06-30`,
    3: `${year}-09-30`,
    4: `${year}-12-31`,
  }
  return dates[quarter as keyof typeof dates]
}
