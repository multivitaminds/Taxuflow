"use server"

import { createClient } from "@/lib/supabase/server"

export async function getScoreHistory(limit = 12) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("credit_score_history")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching score history:", error)
    return { error: error.message }
  }

  return { data }
}
