import { generateObject } from "ai"
import { z } from "zod"
import type { SupabaseClient } from "@supabase/supabase-js"

// Machine Learning Expense Categorization Engine
export class MLExpenseCategorizer {
  constructor(
    private supabase: SupabaseClient,
    private userId: string,
  ) {}

  async categorizeExpense(transaction: {
    description: string
    amount: number
    merchant?: string
    date: string
  }) {
    console.log("[v0] ML Categorizer: Processing transaction", transaction.description)

    // Get historical patterns for this user
    const historicalData = await this.getHistoricalPatterns()

    const prompt = `You are an advanced ML model trained to categorize expenses with high accuracy.

Transaction:
- Description: ${transaction.description}
- Amount: $${transaction.amount}
- Merchant: ${transaction.merchant || "Unknown"}
- Date: ${transaction.date}

Historical User Patterns:
${JSON.stringify(historicalData.slice(0, 10), null, 2)}

Categorize this expense using the most specific category possible. Consider:
1. Merchant patterns from history
2. Amount patterns for specific categories
3. Temporal patterns (e.g., monthly subscriptions)
4. Description keywords and context

Return a structured categorization with confidence scores.`

    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: z.object({
        primary_category: z.string(),
        subcategory: z.string(),
        confidence_score: z.number().min(0).max(100),
        reasoning: z.string(),
        is_recurring: z.boolean(),
        is_tax_deductible: z.boolean(),
        suggested_tags: z.array(z.string()),
        similar_transactions: z.array(z.string()),
      }),
      prompt,
    })

    // Store categorization for learning
    await this.supabase.from("ml_categorizations").insert({
      user_id: this.userId,
      transaction_description: transaction.description,
      amount: transaction.amount,
      category: object.primary_category,
      subcategory: object.subcategory,
      confidence_score: object.confidence_score,
      is_recurring: object.is_recurring,
      is_tax_deductible: object.is_tax_deductible,
      tags: object.suggested_tags,
    })

    console.log(
      "[v0] ML Categorizer: Categorized as",
      object.primary_category,
      `(${object.confidence_score}% confidence)`,
    )

    return object
  }

  private async getHistoricalPatterns() {
    const { data } = await this.supabase
      .from("ml_categorizations")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false })
      .limit(50)

    return data || []
  }

  async improveFromFeedback(transactionId: string, correctCategory: string) {
    console.log("[v0] ML Categorizer: Learning from user correction")

    await this.supabase.from("ml_feedback").insert({
      user_id: this.userId,
      transaction_id: transactionId,
      correct_category: correctCategory,
      feedback_type: "correction",
    })

    // Retrain model with new feedback (in production, this would trigger a background job)
    return { success: true, message: "Learning from feedback" }
  }
}
