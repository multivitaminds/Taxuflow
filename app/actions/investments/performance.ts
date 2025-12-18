"use server"

import { createClient } from "@/lib/supabase/server"

export type PerformanceSnapshot = {
  id: string
  user_id: string
  portfolio_id?: string
  holding_id?: string
  snapshot_date: string
  market_value: number
  cost_basis: number
  unrealized_gain_loss: number
  unrealized_gain_loss_percent: number
  day_change?: number
  day_change_percent?: number
  week_change?: number
  week_change_percent?: number
  month_change?: number
  month_change_percent?: number
  ytd_change?: number
  ytd_change_percent?: number
  one_year_change?: number
  one_year_change_percent?: number
}

export async function getPerformanceSnapshots(filters?: {
  portfolioId?: string
  holdingId?: string
  startDate?: string
  endDate?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  let query = supabase
    .from("investment_performance_snapshots")
    .select("*")
    .eq("user_id", user.id)
    .order("snapshot_date", { ascending: false })

  if (filters?.portfolioId) {
    query = query.eq("portfolio_id", filters.portfolioId)
  }

  if (filters?.holdingId) {
    query = query.eq("holding_id", filters.holdingId)
  }

  if (filters?.startDate) {
    query = query.gte("snapshot_date", filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte("snapshot_date", filters.endDate)
  }

  const { data, error } = await query

  return { data, error: error?.message }
}

export async function getSectorAllocation(portfolioId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  let query = supabase
    .from("investment_sector_allocation")
    .select("*")
    .eq("user_id", user.id)
    .order("allocation_date", { ascending: false })
    .limit(10)

  if (portfolioId) {
    query = query.eq("portfolio_id", portfolioId)
  }

  const { data, error } = await query

  return { data, error: error?.message }
}

export async function getAssetAllocation(portfolioId?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  let query = supabase
    .from("investment_asset_allocation")
    .select("*")
    .eq("user_id", user.id)
    .order("allocation_date", { ascending: false })
    .limit(10)

  if (portfolioId) {
    query = query.eq("portfolio_id", portfolioId)
  }

  const { data, error } = await query

  return { data, error: error?.message }
}
