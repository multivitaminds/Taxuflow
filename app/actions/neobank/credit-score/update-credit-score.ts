"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateCreditScore(scoreData: {
  score: number
  previous_score?: number
  percentile?: number
  rating?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("credit_scores")
    .upsert({
      user_id: user.id,
      ...scoreData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error updating credit score:", error)
    return { error: error.message }
  }

  revalidatePath("/neobank/credit-score")
  return { data }
}
