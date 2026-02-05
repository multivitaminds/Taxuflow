"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function activateLiveAccount(applicationId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    console.log("[v0] Activating live account for user:", user.id)

    // Call database activation function
    const { data, error } = await supabase.rpc("activate_live_account", {
      p_user_id: user.id,
      p_application_id: applicationId,
    })

    if (error) {
      console.error("[v0] Error activating live account:", error)
      return { success: false, error: error.message }
    }

    // Check if activation was successful
    if (!data || !data.success) {
      return {
        success: false,
        error: data?.error || "Activation failed",
        code: data?.code,
      }
    }

    console.log("[v0] Live account activated successfully:", data)

    // Revalidate all paths to reflect new account mode
    revalidatePath("/", "layout")

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Failed to activate live account:", error)
    return { success: false, error: error.message }
  }
}

export async function rollbackToSandbox(reason?: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    console.log("[v0] Rolling back to sandbox for user:", user.id)

    // Call database rollback function
    const { data, error } = await supabase.rpc("rollback_to_sandbox", {
      p_user_id: user.id,
      p_reason: reason || "User requested rollback",
    })

    if (error) {
      console.error("[v0] Error rolling back to sandbox:", error)
      return { success: false, error: error.message }
    }

    if (!data || !data.success) {
      return {
        success: false,
        error: data?.error || "Rollback failed",
        code: data?.code,
      }
    }

    console.log("[v0] Successfully rolled back to sandbox:", data)

    // Revalidate all paths
    revalidatePath("/", "layout")

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Failed to rollback to sandbox:", error)
    return { success: false, error: error.message }
  }
}
