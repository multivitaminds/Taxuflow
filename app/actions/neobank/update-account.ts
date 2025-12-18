"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateAccountBalance(accountId: string, amount: number, operation: "add" | "subtract") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Get current balance
  const { data: account } = await supabase
    .from("neobank_accounts")
    .select("balance")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single()

  if (!account) {
    return { success: false, error: "Account not found" }
  }

  const currentBalance = Number(account.balance) || 0
  const newBalance = operation === "add" ? currentBalance + amount : currentBalance - amount

  if (newBalance < 0) {
    return { success: false, error: "Insufficient funds" }
  }

  const { error } = await supabase
    .from("neobank_accounts")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("id", accountId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error updating account balance:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/neobank")
  revalidatePath("/neobank/accounts")
  return { success: true, newBalance }
}
