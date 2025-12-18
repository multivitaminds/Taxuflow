"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type AIInsight = {
  id: string
  user_id: string
  portfolio_id?: string
  holding_id?: string
  insight_type: string
  insight_category: string
  priority_level: string
  title: string
  summary: string
  detailed_analysis?: string
  actionable_steps?: any[]
  impact_score?: number
  confidence_score?: number
  potential_value?: number
  is_read: boolean
  is_dismissed: boolean
  is_acted_upon: boolean
  created_at: string
}

export async function getAIInsights(filters?: {
  unreadOnly?: boolean
  portfolioId?: string
  holdingId?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  let query = supabase
    .from("investment_ai_insights")
    .select("*")
    .eq("user_id", user.id)
    .order("priority_level", { ascending: false })
    .order("created_at", { ascending: false })

  if (filters?.unreadOnly) {
    query = query.eq("is_read", false)
  }

  if (filters?.portfolioId) {
    query = query.eq("portfolio_id", filters.portfolioId)
  }

  if (filters?.holdingId) {
    query = query.eq("holding_id", filters.holdingId)
  }

  const { data, error } = await query

  return { data, error: error?.message }
}

export async function markInsightAsRead(insightId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("investment_ai_insights")
    .update({ is_read: true })
    .eq("id", insightId)
    .eq("user_id", user.id)

  revalidatePath("/investments")
  return { error: error?.message }
}

export async function dismissInsight(insightId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("investment_ai_insights")
    .update({ is_dismissed: true })
    .eq("id", insightId)
    .eq("user_id", user.id)

  revalidatePath("/investments")
  return { error: error?.message }
}
