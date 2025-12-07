import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

// Predictive Cash Flow Modeling with Historical Data Analysis
export class PredictiveCashFlowModel {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async generateForecast(months = 6) {
    console.log("[v0] Cash Flow Predictor: Generating", months, "month forecast")

    // Get comprehensive historical data
    const historicalData = await this.getHistoricalData()
    const recurringPatterns = await this.identifyRecurringPatterns()
    const seasonalTrends = await this.analyzeSeasonalTrends()

    const prompt = `You are an advanced predictive AI model creating cash flow forecasts using sophisticated time series analysis.

Historical Cash Flow Data (12 months):
${JSON.stringify(historicalData, null, 2)}

Identified Recurring Patterns:
${JSON.stringify(recurringPatterns, null, 2)}

Seasonal Trends:
${JSON.stringify(seasonalTrends, null, 2)}

Generate a ${months}-month cash flow forecast that considers:
1. Historical income patterns and growth trends
2. Fixed recurring expenses (rent, subscriptions, etc.)
3. Variable expense patterns with seasonal adjustments
4. Upcoming known events (tax payments, bonuses, etc.)
5. Statistical confidence intervals for predictions
6. Risk scenarios (best case, expected, worst case)

Create detailed monthly projections with supporting analysis.`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        forecast_period: z.object({
          start_date: z.string(),
          end_date: z.string(),
          months: z.number(),
        }),
        monthly_forecasts: z.array(
          z.object({
            month: z.string(),
            projected_income: z.number(),
            projected_expenses: z.number(),
            net_cash_flow: z.number(),
            ending_balance: z.number(),
            confidence_level: z.number().min(0).max(100),
          }),
        ),
        risk_scenarios: z.object({
          best_case: z.object({
            total_income: z.number(),
            total_expenses: z.number(),
            ending_balance: z.number(),
          }),
          expected: z.object({
            total_income: z.number(),
            total_expenses: z.number(),
            ending_balance: z.number(),
          }),
          worst_case: z.object({
            total_income: z.number(),
            total_expenses: z.number(),
            ending_balance: z.number(),
          }),
        }),
        key_assumptions: z.array(z.string()),
        risk_factors: z.array(
          z.object({
            factor: z.string(),
            probability: z.number(),
            impact: z.enum(["low", "medium", "high"]),
          }),
        ),
        recommendations: z.array(z.string()),
      }),
      prompt,
    })

    // Store forecast model
    await this.supabase.from("cash_flow_forecasts").insert({
      user_id: this.userId,
      forecast_period_months: months,
      monthly_forecasts: object.monthly_forecasts,
      risk_scenarios: object.risk_scenarios,
      key_assumptions: object.key_assumptions,
      risk_factors: object.risk_factors,
      model_version: "v2.0",
      confidence_score: 85,
    })

    console.log("[v0] Cash Flow Predictor: Forecast complete with", object.monthly_forecasts.length, "months")

    return object
  }

  private async getHistoricalData() {
    const twelveMonthsAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()

    const { data } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("user_id", this.userId)
      .gte("created_at", twelveMonthsAgo)
      .order("created_at", { ascending: true })

    // Aggregate by month
    const monthlyData: Record<string, { income: number; expenses: number }> = {}

    data?.forEach((transaction) => {
      const month = transaction.created_at.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 }
      }

      if (transaction.amount > 0) {
        monthlyData[month].income += transaction.amount
      } else {
        monthlyData[month].expenses += Math.abs(transaction.amount)
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      net_cash_flow: data.income - data.expenses,
    }))
  }

  private async identifyRecurringPatterns() {
    const { data } = await this.supabase
      .from("ml_categorizations")
      .select("*")
      .eq("user_id", this.userId)
      .eq("is_recurring", true)

    return data || []
  }

  private async analyzeSeasonalTrends() {
    // Analyze spending patterns by season/quarter
    const { data } = await this.supabase.rpc("analyze_seasonal_trends", {
      p_user_id: this.userId,
    })

    return data || {}
  }
}
