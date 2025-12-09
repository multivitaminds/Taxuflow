"use server"

import { createClientSafe } from "@/lib/supabase/server"

function getMockUser() {
  return {
    id: "demo-user-id",
    email: "demo@taxu.com",
    user_metadata: {
      full_name: "Demo User",
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  }
}

export async function getUser() {
  try {
    const supabase = await createClientSafe()

    if (!supabase) {
      console.log("[v0] Using mock user for preview environment")
      return getMockUser() as any
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error("[v0] Error getting user:", error)
    return getMockUser() as any
  }
}
