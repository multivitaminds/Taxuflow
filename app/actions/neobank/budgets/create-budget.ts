"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBudget(name: string, amount: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("budgets")
    .insert({
      user_id: user.id,
      name,
      fiscal_year: new Date().getFullYear(),
      start_date: new Date().toISOString().split("T")[0],
      status: "active",
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/neobank/budgets")
  return { success: true, data }
}
