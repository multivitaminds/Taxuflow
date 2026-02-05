"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateAccountMode(mode: "SANDBOX" | "LIVE") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  // Update account mode
  const { error } = await supabase
    .from("user_profiles")
    .update({
      account_mode: mode,
      account_status: mode === "LIVE" ? "ACTIVE" : "SIGNED_UP",
    })
    .eq("id", user.id)

  if (error) {
    console.error("[v0] Error updating account mode:", error)
    return { error: error.message }
  }

  // Clear cache
  revalidatePath("/", "layout")

  return { success: true }
}
