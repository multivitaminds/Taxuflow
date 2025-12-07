"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type AIRecommendation = {
  id: string
  user_id: string
  portfolio_id?: string
  recommendation_type: string
  priority: string
  symbol?: string
  action_title: string
  action_summary: string
  detailed_reasoning?: string
  expected_outcome?: string
  potential_return_percent?: number
  potential_return_amount?: number
  risk_level: string
  confidence_score: number
  suggested_quantity?: number
  time_sensitivity: string
  status: string
  created_at: string
}

export async function getAIRecommendations(filters?: {
  activeOnly?: boolean
  portfolioId?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  let query = supabase
    .from("investment_ai_recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false })

  if (filters?.activeOnly) {
    query = query.eq("status", "active")
  }

  if (filters?.portfolioId) {
    query = query.eq("portfolio_id", filters.portfolioId)
  }

  const { data, error } = await query

  return { data, error: error?.message }
}

export async function executeRecommendation(recommendationId: string, notes?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("investment_ai_recommendations")
    .update({
      status: "executed",
      executed_at: new Date().toISOString(),
      execution_notes: notes,
    })
    .eq("id", recommendationId)
    .eq("user_id", user.id)

  revalidatePath("/investments")
  return { error: error?.message }
}

export async function dismissRecommendation(recommendationId: string, reason?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("investment_ai_recommendations")
    .update({
      status: "dismissed",
      dismissed_at: new Date().toISOString(),
      dismissal_reason: reason,
    })
    .eq("id", recommendationId)
    .eq("user_id", user.id)

  revalidatePath("/investments")
  return { error: error?.message }
}
