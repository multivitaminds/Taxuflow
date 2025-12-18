"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type Holding = {
  id: string
  user_id: string
  organization_id?: string
  symbol: string
  name: string
  asset_type: string
  shares: number
  average_cost_basis: number
  current_price: number
  market_value: number
  total_cost: number
  unrealized_gain_loss: number
  unrealized_gain_loss_percent: number
  sector?: string
  industry?: string
  dividend_yield?: number
  purchase_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getHoldings(portfolioId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const query = supabase
    .from("investment_holdings")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("market_value", { ascending: false })

  if (portfolioId) {
    // Note: You'll need to add a join or filter based on your schema
    // This is a simplified version
  }

  const { data, error } = await query

  return { data, error: error?.message }
}

export async function getHoldingById(holdingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_holdings")
    .select("*")
    .eq("id", holdingId)
    .eq("user_id", user.id)
    .single()

  return { data, error: error?.message }
}

export async function createHolding(holding: Partial<Holding>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_holdings")
    .insert({
      ...holding,
      user_id: user.id,
    })
    .select()
    .single()

  revalidatePath("/investments")
  return { data, error: error?.message }
}

export async function updateHolding(holdingId: string, updates: Partial<Holding>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("investment_holdings")
    .update(updates)
    .eq("id", holdingId)
    .eq("user_id", user.id)
    .select()
    .single()

  revalidatePath("/investments")
  return { data, error: error?.message }
}

export async function deleteHolding(holdingId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("investment_holdings")
    .update({ is_active: false })
    .eq("id", holdingId)
    .eq("user_id", user.id)

  revalidatePath("/investments")
  return { error: error?.message }
}
