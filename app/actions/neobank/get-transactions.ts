"use server"

import { createClient } from "@/lib/supabase/server"

export async function getNeobankTransactions(limit = 10) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  // First get user's accounts
  const { data: accounts } = await supabase.from("neobank_accounts").select("id").eq("user_id", user.id)

  if (!accounts || accounts.length === 0) {
    return { data: [], error: null }
  }

  const accountIds = accounts.map((acc) => acc.id)

  // Get transactions for user's accounts
  const { data, error } = await supabase
    .from("neobank_transactions")
    .select("*")
    .in("account_id", accountIds)
    .order("transaction_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching transactions:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
