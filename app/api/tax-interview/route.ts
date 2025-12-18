import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      currentStep,
      completedSteps,
      progressPercentage,
      personalInfo,
      incomeInfo,
      deductionsInfo,
      creditsInfo,
      lifeEventsInfo,
      estimatedRefund,
      totalIncome,
      totalDeductions,
      totalCredits,
      taxLiability,
      status,
    } = body

    const filingYear = new Date().getFullYear()

    // Upsert interview data
    const { data, error } = await supabase
      .from("tax_interviews")
      .upsert(
        {
          user_id: user.id,
          filing_year: filingYear,
          current_step: currentStep,
          completed_steps: completedSteps,
          progress_percentage: progressPercentage,
          personal_info: personalInfo,
          income_info: incomeInfo,
          deductions_info: deductionsInfo,
          credits_info: creditsInfo,
          life_events_info: lifeEventsInfo,
          estimated_refund: estimatedRefund,
          total_income: totalIncome,
          total_deductions: totalDeductions,
          total_credits: totalCredits,
          tax_liability: taxLiability,
          status: status || "in_progress",
          completed_at: status === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,filing_year",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving tax interview:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Tax interview API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filingYear = searchParams.get("year") || new Date().getFullYear()

    const { data, error } = await supabase
      .from("tax_interviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("filing_year", filingYear)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.error("[v0] Error fetching tax interview:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || null })
  } catch (error) {
    console.error("[v0] Tax interview API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
