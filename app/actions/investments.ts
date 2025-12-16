"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createInvestment(data: {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  sector: string
  type: "stock" | "etf" | "crypto" | "bond"
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("investments").insert({
    user_id: user.id,
    symbol: data.symbol,
    name: data.name,
    shares: data.shares,
    avg_cost: data.avgCost,
    current_price: data.currentPrice,
    sector: data.sector,
    investment_type: data.type,
    total_value: data.shares * data.currentPrice,
    gain_loss: (data.currentPrice - data.avgCost) * data.shares,
    gain_loss_percent: ((data.currentPrice - data.avgCost) / data.avgCost) * 100,
  })

  if (error) {
    console.error("[v0] Error creating investment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/investment")
  return { success: true }
}

export async function getInvestments() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { investments: [] }
  }

  const { data, error } = await supabase
    .from("investments")
    .select("*")
    .eq("user_id", user.id)
    .order("total_value", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching investments:", error)
    return { investments: [] }
  }

  return { investments: data || [] }
}

export async function updateInvestmentPrice(id: string, currentPrice: number) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  // Get the investment first to calculate new values
  const { data: investment, error: fetchError } = await supabase
    .from("investments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !investment) {
    return { success: false, error: "Investment not found" }
  }

  const totalValue = investment.shares * currentPrice
  const gainLoss = (currentPrice - investment.avg_cost) * investment.shares
  const gainLossPercent = ((currentPrice - investment.avg_cost) / investment.avg_cost) * 100

  const { error } = await supabase
    .from("investments")
    .update({
      current_price: currentPrice,
      total_value: totalValue,
      gain_loss: gainLoss,
      gain_loss_percent: gainLossPercent,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/investment")
  return { success: true }
}

export async function deleteInvestment(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("investments").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/investment")
  return { success: true }
}
