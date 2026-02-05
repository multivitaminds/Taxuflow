"use server"

import { createClient } from "@/lib/supabase/server"

export interface AccountBalances {
  available: number
  pending: number
  ledger: number
  settled: number
  restricted: number
  currency: string
  lastUpdated: string
}

export async function getAccountBalances(accountId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("neobank_balance_types")
    .select("*")
    .eq("account_id", accountId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("[v0] Error fetching account balances:", error)
    return { data: null, error: error.message }
  }

  const balances: AccountBalances = {
    available: Number(data.available_balance || 0),
    pending: Number(data.pending_balance || 0),
    ledger: Number(data.ledger_balance || 0),
    settled: Number(data.settled_balance || 0),
    restricted: Number(data.restricted_balance || 0),
    currency: data.currency || "USD",
    lastUpdated: data.last_updated,
  }

  return { data: balances, error: null }
}

export async function getAllAccountBalances() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  // Get all accounts for user
  const { data: accounts, error: accountsError } = await supabase
    .from("neobank_accounts")
    .select("id, account_type, account_number")
    .eq("user_id", user.id)
    .eq("status", "active")

  if (accountsError) {
    return { data: null, error: accountsError.message }
  }

  // Get balance types for each account
  const accountBalances = await Promise.all(
    accounts.map(async (account) => {
      const { data: balance } = await supabase
        .from("neobank_balance_types")
        .select("*")
        .eq("account_id", account.id)
        .single()

      return {
        accountId: account.id,
        accountType: account.account_type,
        accountNumber: account.account_number,
        balances: balance
          ? {
              available: Number(balance.available_balance || 0),
              pending: Number(balance.pending_balance || 0),
              ledger: Number(balance.ledger_balance || 0),
              settled: Number(balance.settled_balance || 0),
              restricted: Number(balance.restricted_balance || 0),
              currency: balance.currency || "USD",
              lastUpdated: balance.last_updated,
            }
          : null,
      }
    }),
  )

  return { data: accountBalances, error: null }
}
