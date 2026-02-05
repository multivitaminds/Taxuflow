"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCreditAccounts() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("credit_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("opened_date", { ascending: false })

  if (error) {
    console.error("Error fetching credit accounts:", error)
    return { error: error.message }
  }

  return { data }
}
