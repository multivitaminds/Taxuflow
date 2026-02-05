"use server"

import { createClient } from "@/lib/supabase/server"

export type TransactionLifecycleState =
  | "initiated"
  | "pending"
  | "processing"
  | "posted"
  | "settled"
  | "returned"
  | "reversed"
  | "failed"
  | "held_compliance"
  | "disputed"
  | "refunded"
  | "adjusted"

export async function updateTransactionState(
  transactionId: string,
  newState: TransactionLifecycleState,
  reason?: string,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  // Verify transaction belongs to user
  const { data: transaction, error: fetchError } = await supabase
    .from("neobank_transactions")
    .select("*, account:neobank_accounts!inner(user_id)")
    .eq("id", transactionId)
    .single()

  if (fetchError || !transaction) {
    return { data: null, error: "Transaction not found" }
  }

  if (transaction.account.user_id !== user.id) {
    return { data: null, error: "Unauthorized" }
  }

  // Update transaction state (trigger will handle balance updates)
  const { data, error } = await supabase
    .from("neobank_transactions")
    .update({
      lifecycle_state: newState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating transaction state:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getTransactionHistory(transactionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("neobank_transaction_state_history")
    .select("*")
    .eq("transaction_id", transactionId)
    .order("created_at", { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
