"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function upgradeToLiveAccount() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  try {
    // Call the database function to upgrade to live account
    const { error: upgradeError } = await supabase.rpc("upgrade_to_live_account", {
      p_user_id: user.id,
    })

    if (upgradeError) {
      console.error("[v0] Error upgrading to live account:", upgradeError)
      return { success: false, error: upgradeError.message }
    }

    // Revalidate all paths to show the new live account state
    revalidatePath("/", "layout")

    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error upgrading to live account:", error)
    return { success: false, error: "Failed to upgrade account" }
  }
}
