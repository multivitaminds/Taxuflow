"use server"

import { createClient } from "@/lib/supabase/server"
import { createNeobankAccount } from "@/app/actions/neobank/create-account"

export async function createUserWithBankAccount(userId: string, email: string, fullName?: string, userType?: string) {
  try {
    const supabase = await createClient()

    // 1. Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: userId,
      email: email,
      full_name: fullName || email.split("@")[0],
      user_type: userType || "regular",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      throw profileError
    }

    console.log("[v0] User profile created for:", email)

    // 2. Create default checking account for tax refunds
    const accountResult = await createNeobankAccount("checking", "Tax Refund Account")

    if (accountResult.error) {
      console.error("[v0] Checking account creation error:", accountResult.error)
    } else {
      console.log("[v0] Checking account created for tax refunds:", accountResult.data?.account_number)
    }

    // 3. If business user, create business checking account
    if (userType === "business") {
      const businessAccountResult = await createNeobankAccount("checking", "Business Account")

      if (businessAccountResult.error) {
        console.error("[v0] Business account creation error:", businessAccountResult.error)
      } else {
        console.log("[v0] Business checking account created:", businessAccountResult.data?.account_number)
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Failed to create user with bank account:", error)
    return { success: false, error: error.message }
  }
}
