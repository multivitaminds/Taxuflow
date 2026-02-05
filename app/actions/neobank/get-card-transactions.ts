"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCardTransactions(cardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("card_transactions")
    .select("*")
    .eq("card_id", cardId)
    .order("transaction_date", { ascending: false })
    .limit(10)

  if (error) {
    console.error("[v0] Error fetching card transactions:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
