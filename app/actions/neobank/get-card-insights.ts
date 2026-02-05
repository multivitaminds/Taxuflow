"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCardInsights(cardId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("card_insights")
    .select("*")
    .eq("card_id", cardId)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("[v0] Error fetching card insights:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}
