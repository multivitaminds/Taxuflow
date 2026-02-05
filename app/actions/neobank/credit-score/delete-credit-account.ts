"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteCreditAccount(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("credit_accounts").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting credit account:", error)
    return { error: error.message }
  }

  revalidatePath("/neobank/credit-score")
  return { success: true }
}
