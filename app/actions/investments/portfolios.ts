"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type Portfolio = {
  id: string
  user_id: string
  portfolio_name: string
  portfolio_type: string
  description?: string
  risk_tolerance: string
  investment_goal: string
  target_amount?: number
  target_date?: string
  total_value: number
  total_cost_basis: number
  total_gain_loss: number
  is_primary: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getPortfolios() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_portfolios")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false })

  return { data, error: error?.message }
}

export async function getPortfolioById(portfolioId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_portfolios")
    .select("*")
    .eq("id", portfolioId)
    .eq("user_id", user.id)
    .single()

  return { data, error: error?.message }
}

export async function createPortfolio(portfolio: Partial<Portfolio>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_portfolios")
    .insert({
      ...portfolio,
      user_id: user.id,
    })
    .select()
    .single()

  revalidatePath("/investments")
  return { data, error: error?.message }
}

export async function updatePortfolio(portfolioId: string, updates: Partial<Portfolio>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_portfolios")
    .update(updates)
    .eq("id", portfolioId)
    .eq("user_id", user.id)
    .select()
    .single()

  revalidatePath("/investments")
  return { data, error: error?.message }
}

export async function deletePortfolio(portfolioId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("investment_portfolios")
    .update({ is_active: false })
    .eq("id", portfolioId)
    .eq("user_id", user.id)

  revalidatePath("/investments")
  return { error: error?.message }
}
