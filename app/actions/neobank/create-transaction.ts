"use server"

import { createClient } from "@/lib/supabase/server"

export async function createNeobankTransaction(data: {
  accountId: string
  amount: number
  description: string
  transactionType: "debit" | "credit"
  merchantName?: string
  merchantCategoryCode?: string
  currency?: string
  memo?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data: transaction, error } = await supabase
    .from("neobank_transactions")
    .insert([
      {
        account_id: data.accountId,
        amount: data.amount,
        description: data.description,
        transaction_type: data.transactionType,
        merchant_name: data.merchantName || data.description,
        merchant_category_code: data.merchantCategoryCode || "general",
        currency: data.currency || "USD",
        status: "completed",
        transaction_date: new Date().toISOString(),
        posted_date: new Date().toISOString(),
        metadata: data.memo ? { memo: data.memo } : {},
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating transaction:", error)
    return { data: null, error: error.message }
  }

  // Update account balance
  const balanceChange = data.transactionType === "credit" ? data.amount : -data.amount
  await supabase.rpc("update_account_balance", {
    account_id: data.accountId,
    amount_change: balanceChange,
  })

  console.log("[v0] Created transaction:", transaction.id, data.amount)
  return { data: transaction, error: null }
}
