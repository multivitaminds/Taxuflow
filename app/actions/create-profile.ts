"use server"

import { createClient } from "@/lib/supabase/server"

export async function createUserProfile(userId: string, email: string, fullName?: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("user_profiles").insert({
      id: userId,
      email: email,
      full_name: fullName || email.split("@")[0],
      account_type: "demo", // Start as demo for backwards compatibility
      account_mode: "SANDBOX", // New fintech-grade: Start in SANDBOX
      account_status: "SIGNED_UP", // Track registration status
      tenant_id: userId, // Set tenant_id to user_id for proper data isolation
      is_demo_seeded: false, // Track if demo data has been seeded
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Profile creation error:", error)
      throw error
    }

    console.log("[v0] Profile created successfully - account_mode: SANDBOX, account_status: SIGNED_UP")

    console.log("[v0] Triggering demo data seeding...")
    const { seedDemoData } = await import("@/lib/demo/seed-data")
    const seedResult = await seedDemoData(userId)

    if (seedResult.success) {
      // Mark as seeded
      await supabase.from("user_profiles").update({ is_demo_seeded: true }).eq("id", userId)

      console.log("[v0] Demo data seeded successfully on signup")
    } else {
      console.error("[v0] Failed to seed demo data:", seedResult.error)
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Failed to create profile:", error)
    return { success: false, error: error.message }
  }
}

export async function completeRegistration(userId: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("user_profiles")
      .update({
        account_type: "live",
        account_mode: "LIVE",
        account_status: "ACTIVE",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("[v0] Registration completion error:", error)
      throw error
    }

    console.log("[v0] Registration completed - account_mode: LIVE, account_status: ACTIVE")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] Failed to complete registration:", error)
    return { success: false, error: error.message }
  }
}
