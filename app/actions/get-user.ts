"use server"

import { createClientSafe } from "@/lib/supabase/server"

export async function getUser() {
  try {
    const supabase = await createClientSafe()

    if (!supabase) {
      console.error("[v0] Supabase client not available")
      return null
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
    return null
  }
}
