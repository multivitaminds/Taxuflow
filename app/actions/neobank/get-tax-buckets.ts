"use server"

import { createClient } from "@/lib/supabase/server"

export async function getTaxBuckets() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("tax_buckets")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Error fetching tax buckets:", error)
    return { error: error instanceof Error ? error.message : "Failed to fetch tax buckets" }
  }
}
