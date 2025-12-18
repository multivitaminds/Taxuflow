"use server"

import { createClientSafe } from "@/lib/supabase/server"

function getMockProfile() {
  return {
    id: "demo-user-id",
    email: "demo@taxu.com",
    full_name: "Demo User",
    user_type: "demo",
    subscription_tier: "free",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function getUserProfile(userId?: string) {
  try {
    const supabase = await createClientSafe()

    if (!supabase) {
      console.log("[v0] Using mock profile for preview environment")
      return getMockProfile() as any
    }

    let targetUserId = userId

    // If no userId provided, get current authenticated user
    if (!targetUserId) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        return getMockProfile() as any
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
      return getMockProfile() as any
    }

    return profile
  } catch (error) {
    console.error("[v0] Error getting user profile:", error)
    return getMockProfile() as any
  }
}
