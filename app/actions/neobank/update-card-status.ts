"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateCardStatus(cardId: string, status: "active" | "frozen" | "cancelled") {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const { data, error } = await supabase
      .from("cards")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cardId)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating card status:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/neobank/cards")
    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error updating card status:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update card status" }
  }
}
