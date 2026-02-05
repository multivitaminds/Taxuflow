"use server"

import { createClient } from "@/lib/supabase/server"

export async function getNeobankCards() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching cards:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export const getCards = getNeobankCards
