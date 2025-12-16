"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateCardStatus(cardId: string, status: "active" | "frozen" | "cancelled") {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("neobank_cards")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/neobank/cards")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating card status:", error)
    return { error: error instanceof Error ? error.message : "Failed to update card status" }
  }
}
