"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateCreditAccount(
  id: string,
  accountData: {
    account_name?: string
    account_type?: string
    balance?: number
    credit_limit?: number
    status?: string
    payment_status?: string
  },
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Calculate utilization if balance or limit changed
  const updateData: any = { ...accountData }
  if (accountData.balance !== undefined || accountData.credit_limit !== undefined) {
    const { data: existing } = await supabase
      .from("credit_accounts")
      .select("balance, credit_limit")
      .eq("id", id)
      .single()

    if (existing) {
      const balance = accountData.balance ?? existing.balance
      const limit = accountData.credit_limit ?? existing.credit_limit
      updateData.utilization_percentage = limit > 0 ? (balance / limit) * 100 : 0
    }
  }

  const { data, error } = await supabase
    .from("credit_accounts")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating credit account:", error)
    return { error: error.message }
  }

  revalidatePath("/neobank/credit-score")
  return { data }
}
