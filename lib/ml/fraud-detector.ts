import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

// Advanced Fraud Detection and Anomaly Detection System
export class FraudDetector {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async analyzeTransaction(transaction: {
    id: string
    description: string
    amount: number
    merchant?: string
    location?: string
    timestamp: string
    card_last4?: string
  }) {
    console.log("[v0] Fraud Detector: Analyzing transaction", transaction.id)

    // Get user's normal behavior patterns
    const userProfile = await this.getUserBehaviorProfile()
    const recentTransactions = await this.getRecentTransactions()

    const prompt = `You are an advanced fraud detection AI analyzing a transaction for anomalies.

Transaction Under Review:
${JSON.stringify(transaction, null, 2)}

User's Normal Behavior Profile:
${JSON.stringify(userProfile, null, 2)}

Recent Transactions (Last 30 days):
${JSON.stringify(recentTransactions.slice(0, 20), null, 2)}

Analyze this transaction for:
1. Amount anomalies (unusually high/low)
2. Location anomalies (unusual location for this user)
3. Merchant anomalies (first-time merchant or unusual category)
4. Timing anomalies (unusual time of day/day of week)
5. Velocity anomalies (too many transactions in short time)
6. Pattern breaks (doesn't match user's typical behavior)

Return a detailed fraud risk assessment.`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        risk_score: z.number().min(0).max(100),
        risk_level: z.enum(["low", "medium", "high", "critical"]),
        anomalies_detected: z.array(
          z.object({
            type: z.string(),
            description: z.string(),
            severity: z.enum(["low", "medium", "high"]),
          }),
        ),
        recommendation: z.enum(["approve", "review", "block", "verify"]),
        reasoning: z.string(),
        confidence: z.number().min(0).max(100),
        similar_fraud_patterns: z.array(z.string()),
      }),
      prompt,
    })

    // Store fraud analysis
    await this.supabase.from("fraud_analyses").insert({
      user_id: this.userId,
      transaction_id: transaction.id,
      risk_score: object.risk_score,
      risk_level: object.risk_level,
      anomalies_detected: object.anomalies_detected,
      recommendation: object.recommendation,
      reasoning: object.reasoning,
      confidence: object.confidence,
    })

    // If high risk, trigger alert
    if (object.risk_level === "high" || object.risk_level === "critical") {
      await this.triggerFraudAlert(transaction, object)
    }

    console.log("[v0] Fraud Detector: Risk level", object.risk_level, `(${object.risk_score}/100)`)

    return object
  }

  private async getUserBehaviorProfile() {
    const { data } = await this.supabase.from("user_behavior_profiles").select("*").eq("user_id", this.userId).single()

    return (
      data || {
        avg_transaction_amount: 0,
        typical_merchants: [],
        typical_locations: [],
        typical_times: [],
        spending_patterns: {},
      }
    )
  }

  private async getRecentTransactions() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data } = await this.supabase
      .from("transactions")
      .select("*")
      .eq("user_id", this.userId)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })

    return data || []
  }

  private async triggerFraudAlert(transaction: any, analysis: any) {
    console.log("[v0] Fraud Detector: Triggering fraud alert")

    await this.supabase.from("fraud_alerts").insert({
      user_id: this.userId,
      transaction_id: transaction.id,
      alert_type: "potential_fraud",
      risk_level: analysis.risk_level,
      message: `Suspicious transaction detected: ${transaction.description} for $${transaction.amount}`,
      details: analysis,
      status: "pending",
    })

    // In production, send notifications via email/SMS/push
  }
}
