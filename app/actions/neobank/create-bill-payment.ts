"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBillPayment(data: {
  payee_name: string
  account_id: string
  amount: number
  scheduled_date: string
  memo?: string
}) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Unauthorized" }
    }

    // Create transaction for bill payment
    const { data: transaction, error } = await supabase
      .from("neobank_transactions")
      .insert({
        account_id: data.account_id,
        amount: -Math.abs(data.amount),
        description: `Bill Payment to ${data.payee_name}`,
        merchant_name: data.payee_name,
        transaction_type: "debit",
        status: "pending",
        transaction_date: data.scheduled_date,
        metadata: {
          type: "bill_payment",
          memo: data.memo,
        },
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/neobank/bill-pay")
    return { success: true, data: transaction }
  } catch (error) {
    console.error("Error creating bill payment:", error)
    return { error: error instanceof Error ? error.message : "Failed to create bill payment" }
  }
}
