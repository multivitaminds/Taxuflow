"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function refreshCreditScore() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // In a real app, this would call a credit bureau API
  // For now, we'll simulate a refresh

  const { data: currentScore } = await supabase
    .from("credit_scores")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (currentScore) {
    // Update the last_updated timestamp
    const { data, error } = await supabase
      .from("credit_scores")
      .update({
        last_updated: new Date().toISOString(),
        next_update: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
      .eq("id", currentScore.id)
      .select()
      .single()

    if (error) {
      console.error("Error refreshing credit score:", error)
      return { error: error.message }
    }

    revalidatePath("/neobank/credit-score")
    return { data, message: "Credit score refreshed successfully" }
  }

  return { error: "No credit score found" }
}
