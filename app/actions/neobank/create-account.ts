"use server"

import { createClient } from "@/lib/supabase/server"

export async function createNeobankAccount(accountType: "checking" | "savings") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const accountNumber = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
  const routingNumber = "121000248" // Taxu Bank routing number

  const { data, error } = await supabase
    .from("neobank_accounts")
    .insert([
      {
        user_id: user.id,
        account_type: accountType,
        account_number: accountNumber,
        routing_number: routingNumber,
        balance: 0,
        currency: "USD",
        status: "active",
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating neobank account:", error)
    return { data: null, error: error.message }
  }

  console.log("[v0] Created neobank account:", accountType, accountNumber)
  return { data, error: null }
}
