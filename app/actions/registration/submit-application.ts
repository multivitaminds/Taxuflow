"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitApplicationForReview(applicationId: string) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    console.log("[v0] Submitting application for review:", applicationId)

    // Call database function
    const { data, error } = await supabase.rpc("submit_application_for_review", {
      p_application_id: applicationId,
      p_user_id: user.id,
    })

    if (error) {
      console.error("[v0] Error submitting application:", error)
      return { success: false, error: error.message }
    }

    // Update user profile
    await supabase
      .from("user_profiles")
      .update({
        live_registration_status: "PENDING_REVIEW",
        live_registration_started_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    console.log("[v0] Application submitted successfully:", data)

    revalidatePath("/live-registration")
    revalidatePath("/dashboard")

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Failed to submit application:", error)
    return { success: false, error: error.message }
  }
}
