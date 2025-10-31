"use server"

import { createClient } from "@/lib/supabase/server"

export async function createUserProfile(userId: string, email: string) {
  try {
    const supabase = await createClient()

    // Create the user profile
    const { error } = await supabase.from("user_profiles").insert({
      id: userId,
      email: email,
      full_name: email.split("@")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Profile creation error:", error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error("[v0] Failed to create profile:", error)
    return { success: false, error: error.message }
  }
}
