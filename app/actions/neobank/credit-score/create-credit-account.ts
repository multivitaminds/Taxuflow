"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createCreditAccount(accountData: {
  account_name: string
  account_type: string
  balance: number
  credit_limit: number
  status?: string
  payment_status?: string
  opened_date?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const utilization = accountData.credit_limit > 0 ? (accountData.balance / accountData.credit_limit) * 100 : 0

  const { data, error } = await supabase
    .from("credit_accounts")
    .insert({
      user_id: user.id,
      ...accountData,
      utilization_percentage: utilization,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating credit account:", error)
    return { error: error.message }
  }

  revalidatePath("/neobank/credit-score")
  return { data }
}
