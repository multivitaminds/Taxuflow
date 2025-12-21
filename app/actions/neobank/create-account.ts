"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function createNeobankAccount(accountType: "checking" | "savings") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data: existingUser } = await supabase.from("users").select("id").eq("id", user.id).single()

  if (!existingUser) {
    const adminClient = createAdminClient()

    if (!adminClient) {
      console.error("[v0] Failed to create admin client")
      return { data: null, error: "Service configuration error" }
    }

    const { error: userError } = await adminClient.from("users").insert({
      id: user.id,
      email: user.email,
      email_verified: user.email_confirmed_at ? true : false,
      is_active: true,
    })

    if (userError) {
      console.error("[v0] Error creating user record:", userError)
      return { data: null, error: "Failed to create user record" }
    }
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
