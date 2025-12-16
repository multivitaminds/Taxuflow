"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTaxBucket(data: {
  name: string
  percentage: number
  goal_amount?: number
}) {
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
      .insert({
        user_id: user.id,
        name: data.name,
        percentage: data.percentage,
        goal_amount: data.goal_amount || 0,
        current_balance: 0,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/neobank/tax-buckets")
    return { success: true, data: bucket }
  } catch (error) {
    console.error("Error creating tax bucket:", error)
    return { error: error instanceof Error ? error.message : "Failed to create tax bucket" }
  }
}
