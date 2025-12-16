"use server"

import { createClient } from "@/lib/supabase/server"
import { createNeobankTransaction } from "./create-transaction"

export async function createNeobankTransfer(data: {
  fromAccountId?: string
  toAccountId?: string
  externalAccountId?: string
  amount: number
  transferType: "internal" | "ach" | "wire" | "p2p"
  scheduledDate?: Date
  memo?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  // Create transfer record
  const { data: transfer, error } = await supabase
    .from("neobank_transfers")
    .insert([
      {
        user_id: user.id,
        from_account_id: data.fromAccountId,
        to_account_id: data.toAccountId,
        external_account_id: data.externalAccountId,
        amount: data.amount,
        transfer_type: data.transferType,
        status: data.scheduledDate ? "scheduled" : "completed",
        scheduled_date: data.scheduledDate || new Date(),
        completed_date: data.scheduledDate ? null : new Date().toISOString(),
        currency: "USD",
        memo: data.memo,
        reference_number: `TXF${Date.now()}${Math.floor(Math.random() * 1000)}`,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating transfer:", error)
    return { data: null, error: error.message }
  }

  // Create transaction records for immediate transfers
  if (!data.scheduledDate && data.fromAccountId) {
    await createNeobankTransaction({
      accountId: data.fromAccountId,
      amount: data.amount,
      description: `Transfer to ${data.toAccountId ? "account" : "external"}`,
      transactionType: "debit",
      merchantName: "Internal Transfer",
      memo: data.memo,
    })

    if (data.toAccountId) {
      await createNeobankTransaction({
        accountId: data.toAccountId,
        amount: data.amount,
        description: "Transfer received",
        transactionType: "credit",
        merchantName: "Internal Transfer",
        memo: data.memo,
      })
    }
  }

  console.log("[v0] Created transfer:", transfer.id, data.amount)
  return { data: transfer, error: null }
}
