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
    const { lookback_year } = body

    if (!lookback_year) {
      return NextResponse.json({ error: "Missing lookback_year" }, { status: 400 })
    }

    // Lookback period is July 1 (prior year) to June 30 (current year)
    const priorYear = lookback_year - 1
    const lookbackStart = `${priorYear}-07-01`
    const lookbackEnd = `${lookback_year}-06-30`

    // Get tax liability for each quarter in lookback period
    const { data: filings } = await supabase
      .from("tax_filings")
      .select("*")
      .eq("user_id", user.id)
      .eq("form_type", "941")
      .gte("created_at", lookbackStart)
      .lte("created_at", lookbackEnd)

    // Calculate total tax liability
    let q3PriorYear = 0
    let q4PriorYear = 0
    let q1CurrentYear = 0
    let q2CurrentYear = 0

    filings?.forEach((filing) => {
      const taxLiability = filing.tax_liability || 0
      const formData = filing.form_data || {}
      const quarter = formData.quarter || 0
      const year = formData.tax_year || 0

      if (year === priorYear && quarter === 3) q3PriorYear = taxLiability
      if (year === priorYear && quarter === 4) q4PriorYear = taxLiability
      if (year === lookback_year && quarter === 1) q1CurrentYear = taxLiability
      if (year === lookback_year && quarter === 2) q2CurrentYear = taxLiability
    })

    const totalTaxLiability = q3PriorYear + q4PriorYear + q1CurrentYear + q2CurrentYear
    const threshold = 50000.0
    const exceedsThreshold = totalTaxLiability > threshold

    // Determine deposit schedule
    const depositSchedule = exceedsThreshold ? "semi-weekly" : "monthly"

    // Get previous lookback period to check for changes
    const { data: previousLookback } = await supabase
      .from("lookback_periods")
      .select("*")
      .eq("user_id", user.id)
      .eq("lookback_year", lookback_year - 1)
      .single()

    const previousSchedule = previousLookback?.deposit_schedule || "monthly"
    const scheduleChanged = previousSchedule !== depositSchedule

    // Upsert lookback period
    const { data: lookback, error } = await supabase
      .from("lookback_periods")
      .upsert(
        {
          user_id: user.id,
          lookback_start_date: lookbackStart,
          lookback_end_date: lookbackEnd,
          lookback_year,
          total_tax_liability: totalTaxLiability,
          q3_prior_year: q3PriorYear,
          q4_prior_year: q4PriorYear,
          q1_current_year: q1CurrentYear,
          q2_current_year: q2CurrentYear,
          deposit_schedule: depositSchedule,
          threshold_amount: threshold,
          exceeds_threshold: exceedsThreshold,
          previous_deposit_schedule: previousSchedule,
          schedule_changed: scheduleChanged,
          schedule_change_date: scheduleChanged ? new Date().toISOString().split("T")[0] : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,lookback_year",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error calculating lookback period:", error)
      return NextResponse.json({ error: "Failed to calculate lookback period" }, { status: 500 })
    }

    // Record schedule change in history if changed
    if (scheduleChanged) {
      await supabase.from("deposit_schedule_history").insert({
        user_id: user.id,
        lookback_period_id: lookback.id,
        effective_date: new Date().toISOString().split("T")[0],
        old_schedule: previousSchedule,
        new_schedule: depositSchedule,
        reason: `Lookback period tax liability: $${totalTaxLiability.toFixed(2)}`,
        tax_liability_at_change: totalTaxLiability,
      })
    }

    return NextResponse.json({
      success: true,
      lookback,
      status: {
        depositSchedule,
        totalTaxLiability,
        exceedsThreshold,
        scheduleChanged,
        previousSchedule,
        message: scheduleChanged
          ? `Your deposit schedule has changed from ${previousSchedule} to ${depositSchedule}!`
          : `Your deposit schedule remains ${depositSchedule}.`,
        warning:
          totalTaxLiability > 45000 && totalTaxLiability < 50000
            ? "You are approaching the $50,000 threshold. Your deposit schedule may change next year."
            : null,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error in lookback calculate route:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
