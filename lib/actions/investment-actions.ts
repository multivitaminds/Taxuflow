"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Portfolio Actions
export async function getInvestmentHoldings() {
  try {
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
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("market_value", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching holdings:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in getInvestmentHoldings:", error)
    return { data: null, error: error.message }
  }
}

export async function getInvestmentTransactions() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })
      .limit(50)

    if (error) {
      console.error("[v0] Error fetching transactions:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in getInvestmentTransactions:", error)
    return { data: null, error: error.message }
  }
}

// Watchlist Actions
export async function getWatchlist() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching watchlist:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in getWatchlist:", error)
    return { data: null, error: error.message }
  }
}

export async function addToWatchlist(symbol: string, name: string, currentPrice: number) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_watchlist")
      .insert({
        user_id: user.id,
        symbol,
        name,
        added_price: currentPrice,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error adding to watchlist:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/investment/markets")
    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in addToWatchlist:", error)
    return { data: null, error: error.message }
  }
}

// Auto-Invest Actions
export async function getAutoInvestStrategies() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_auto_invest_strategies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching auto-invest strategies:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in getAutoInvestStrategies:", error)
    return { data: null, error: error.message }
  }
}

export async function toggleAutoInvestStrategy(strategyId: string, isActive: boolean) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_auto_invest_strategies")
      .update({ is_active: isActive })
      .eq("id", strategyId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error toggling strategy:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/investment/auto-invest")
    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in toggleAutoInvestStrategy:", error)
    return { data: null, error: error.message }
  }
}

// Tax Optimizer Actions
export async function getTaxOpportunities() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_tax_opportunities")
      .select(
        `
        *,
        investment_holdings (
          symbol,
          name,
          shares,
          current_price
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "identified")
      .order("priority_score", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching tax opportunities:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in getTaxOpportunities:", error)
    return { data: null, error: error.message }
  }
}

export async function dismissTaxOpportunity(opportunityId: string, reason: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("investment_tax_opportunities")
      .update({
        status: "dismissed",
        dismissed_at: new Date().toISOString(),
        dismissal_reason: reason,
      })
      .eq("id", opportunityId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error dismissing opportunity:", error)
      return { data: null, error: error.message }
    }

    revalidatePath("/investment/tax-optimizer")
    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in dismissTaxOpportunity:", error)
    return { data: null, error: error.message }
  }
}

// Portfolio Actions
export async function getPortfolios() {
  try {
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

    if (error) {
      console.error("[v0] Error fetching portfolios:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error("[v0] Error in getPortfolios:", error)
    return { data: null, error: error.message }
  }
}
