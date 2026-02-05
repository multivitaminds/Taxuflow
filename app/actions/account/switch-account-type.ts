"use server"

import { createClient } from "@/lib/supabase/server"
import { clearAccountTypeCache } from "@/lib/demo/context"
import { seedDemoData } from "@/lib/demo/seed-data"

export async function switchAccountType(targetType: "demo" | "live") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    // Get current account type
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("account_type, is_demo_seeded")
      .eq("id", user.id)
      .single()

    const currentType = profile?.account_type || "live"

    if (currentType === targetType) {
      return { error: "Already using this account type" }
    }

    // Switching from demo to live - clear all data
    if (targetType === "live") {
      const { error: clearError } = await supabase.rpc("clear_user_data", {
        target_user_id: user.id,
      })

      if (clearError) {
        console.error("Error clearing user data:", clearError)
        return { error: "Failed to clear demo data" }
      }

      clearAccountTypeCache(user.id)

      return { success: true, message: "Switched to live account. All demo data has been cleared." }
    }

    // Switching from live to demo - seed demo data
    if (targetType === "demo") {
      // Update account type first
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          account_type: "demo",
          last_account_switch: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        console.error("Error updating account type:", updateError)
        return { error: "Failed to update account type" }
      }

      // Seed demo data using SQL function
      const { error: seedError } = await supabase.rpc("seed_demo_data", {
        target_user_id: user.id,
      })

      if (seedError) {
        console.error("Error seeding demo data:", seedError)
        return { error: "Failed to seed demo data" }
      }

      clearAccountTypeCache(user.id)

      return { success: true, message: "Switched to demo account with sample data." }
    }

    return { error: "Invalid account type" }
  } catch (error) {
    console.error("Error switching account type:", error)
    return { error: "Failed to switch account type" }
  }
}
