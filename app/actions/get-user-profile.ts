"use server"

import { createClientSafe } from "@/lib/supabase/server"

export async function getUserProfile(userId?: string) {
  try {
    const supabase = await createClientSafe()

    if (!supabase) {
      console.error("[v0] Supabase client not available for profile fetch")
      return null
    }

    let targetUserId = userId

    // If no userId provided, get current authenticated user
    if (!targetUserId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        return null
      }

      targetUserId = user.id
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", targetUserId)
      .maybeSingle()

    if (profileError) {
      console.error("[v0] Error fetching profile:", profileError)
      return null
    }

    return profile
  } catch (error) {
    console.error("[v0] Error getting user profile:", error)
    return null
  }
}
