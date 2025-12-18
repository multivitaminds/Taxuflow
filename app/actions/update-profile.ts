"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function updateUserProfile(userId: string, fullName: string, email: string) {
  try {
    const supabase = await createServerClient()

    // Update user_profiles table
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({ full_name: fullName, email: email })
      .eq("user_id", userId)

    if (profileError) {
      throw profileError
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export async function updateProfile(fullName: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Update user_profiles table
  const { error: profileError } = await supabase
    .from("user_profiles")
    .update({
      full_name: fullName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (profileError) {
    console.error("[v0] Error updating profile:", profileError)
    return { error: profileError.message }
  }

  // Also update auth metadata for consistency
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  })

  if (metadataError) {
    console.error("[v0] Error updating metadata:", metadataError)
  }

  return { success: true }
}
