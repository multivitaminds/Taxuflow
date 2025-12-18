"use server"

import { createClient } from "@/lib/supabase/server"

export async function getNeobankAccounts() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("neobank_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching neobank accounts:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getAccountBalance() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { totalBalance: 0, accounts: [] }
  }

  const { data: accounts } = await supabase
    .from("neobank_accounts")
    .select("balance, account_type")
    .eq("user_id", user.id)

  if (!accounts || accounts.length === 0) {
    return { totalBalance: 0, accounts: [] }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0)

  return { totalBalance, accounts }
}
