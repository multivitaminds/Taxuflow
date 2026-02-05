"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateCard(
  cardId: string,
  updates: {
    card_name?: string
    cardholder_name?: string
    spend_limit?: number
    card_theme?: string
    card_emoji?: string
  },
) {
  try {
    const supabase = await createClient()

    // Update the card
    const { data, error } = await supabase.from("cards").update(updates).eq("id", cardId).select().single()

    if (error) {
      console.error("Error updating card:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/neobank/cards")
    return { success: true, data }
  } catch (error) {
    console.error("Error in updateCard:", error)
    return { success: false, error: "Failed to update card" }
  }
}
