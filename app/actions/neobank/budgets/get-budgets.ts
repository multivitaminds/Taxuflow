"use server"

import { createClient } from "@/lib/supabase/server"

export async function getBudgets() {
  const supabase = await createClient()

  if (!supabase) {
    return { data: [], error: "Supabase client not available" }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: [], error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching budgets:", error)
    return { data: [], error: error.message }
  }

  return { data: data || [], error: null }
}
