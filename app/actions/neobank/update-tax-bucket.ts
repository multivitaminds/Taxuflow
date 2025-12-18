"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTaxBucket(
  bucketId: string,
  data: {
    name?: string
    percentage?: number
    goal_amount?: number
    current_balance?: number
  },
) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Unauthorized" }
    }

    const { data: bucket, error } = await supabase
      .from("tax_buckets")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bucketId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/neobank/tax-buckets")
    return { success: true, data: bucket }
  } catch (error) {
    console.error("Error updating tax bucket:", error)
    return { error: error instanceof Error ? error.message : "Failed to update tax bucket" }
  }
}
