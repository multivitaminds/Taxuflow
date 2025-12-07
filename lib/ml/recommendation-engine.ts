import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

// AI-Powered Recommendation Engine
export class RecommendationEngine {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async generatePersonalizedRecommendations() {
    console.log("[v0] Recommendation Engine: Generating personalized recommendations")

    // Gather comprehensive user data
    const userData = await this.getUserProfile()
    const spendingData = await this.getSpendingAnalysis()
    const goals = await this.getUserGoals()
    const insights = await this.getRecentInsights()

    const prompt = `You are an advanced AI recommendation engine creating highly personalized financial advice.

User Profile:
${JSON.stringify(userData, null, 2)}

Spending Analysis:
${JSON.stringify(spendingData, null, 2)}

User Goals:
${JSON.stringify(goals, null, 2)}

Recent Insights:
${JSON.stringify(insights, null, 2)}

Generate 5-10 personalized recommendations that:
1. Are specific and actionable (not generic advice)
2. Consider the user's unique situation and goals
3. Have clear implementation steps
4. Include estimated impact/benefit
5. Are prioritized by potential value

Categories: savings, investments, debt reduction, tax optimization, spending optimization, goal achievement`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        recommendations: z.array(
          z.object({
            id: z.string(),
            category: z.string(),
            title: z.string(),
            description: z.string(),
            estimated_benefit: z.number(),
            benefit_type: z.enum(["savings", "earnings", "risk_reduction", "goal_progress"]),
            priority: z.enum(["low", "medium", "high", "critical"]),
            difficulty: z.enum(["easy", "moderate", "hard"]),
            time_to_implement: z.string(),
            implementation_steps: z.array(z.string()),
            potential_risks: z.array(z.string()),
            confidence_score: z.number().min(0).max(100),
          }),
        ),
        overall_strategy: z.string(),
        key_focus_areas: z.array(z.string()),
      }),
      prompt,
    })

    // Store recommendations
    for (const rec of object.recommendations) {
      await this.supabase.from("ai_recommendations").insert({
        user_id: this.userId,
        category: rec.category,
        title: rec.title,
        description: rec.description,
        estimated_benefit: rec.estimated_benefit,
        priority: rec.priority,
        implementation_steps: rec.implementation_steps,
        confidence_score: rec.confidence_score,
        status: "pending",
      })
    }

    console.log("[v0] Recommendation Engine: Generated", object.recommendations.length, "recommendations")

    return object
  }

  private async getUserProfile() {
    const { data } = await this.supabase.from("users").select("*").eq("id", this.userId).single()

    return data || {}
  }

  private async getSpendingAnalysis() {
    const { data } = await this.supabase.rpc("get_spending_analysis", {
      p_user_id: this.userId,
    })

    return data || {}
  }

  private async getUserGoals() {
    const { data } = await this.supabase.from("financial_goals").select("*").eq("user_id", this.userId)

    return data || []
  }

  private async getRecentInsights() {
    const { data } = await this.supabase
      .from("intelligent_insights")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })
      .limit(10)

    return data || []
  }
}
