"use server"

import { createClient } from "@/lib/supabase/server"

export async function getOrCreateApplication() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check for existing application
    const { data: existingApp, error: fetchError } = await supabase
      .from("registration_applications_new")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error("[v0] Error fetching application:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Return existing application if found
    if (existingApp) {
      console.log("[v0] Found existing application:", existingApp.id)
      return { success: true, data: existingApp }
    }

    // Create new application
    const applicationNumber = `APP-${Date.now().toString().slice(-10)}`

    const { data: newApp, error: createError } = await supabase
      .from("registration_applications_new")
      .insert({
        user_id: user.id,
        application_number: applicationNumber,
        status: "IN_PROGRESS",
        current_step: 1,
        completed_steps: [],
        platforms_selected: {
          tax_filing: false,
          neobank: false,
          investment: false,
          accounting: false,
        },
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating application:", createError)
      return { success: false, error: createError.message }
    }

    console.log("[v0] Created new application:", newApp.application_number)

    return { success: true, data: newApp }
  } catch (error: any) {
    console.error("[v0] Failed to get/create application:", error)
    return { success: false, error: error.message }
  }
}

export async function getRegistrationStatus() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Call database function for registration status
    const { data, error } = await supabase.rpc("get_registration_status", {
      p_user_id: user.id,
    })

    if (error) {
      console.error("[v0] Error getting registration status:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("[v0] Failed to get registration status:", error)
    return { success: false, error: error.message }
  }
}
