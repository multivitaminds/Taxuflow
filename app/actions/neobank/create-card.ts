"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createNeobankCard(formData: {
  cardType: "virtual" | "physical"
  cardName: string
  monthlyLimit: number
  cardholder: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Generate card details
  const last4 = Math.floor(1000 + Math.random() * 9000).toString()
  const cardNumber = `****-****-****-${last4}`
  const cvv = Math.floor(100 + Math.random() * 900).toString()
  const currentYear = new Date().getFullYear()
  const expiryYear = (currentYear + 4).toString().slice(-2)
  const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")

  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id: user.id,
      card_type: formData.cardType,
      cardholder_name: formData.cardholder.toUpperCase(),
      card_number: cardNumber,
      last_four: last4,
      expiry_date: `${expiryMonth}/${expiryYear}`,
      cvv: cvv,
      spend_limit: formData.monthlyLimit,
      status: "active",
      is_virtual: formData.cardType === "virtual",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating card:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/neobank/cards")
  return { success: true, data }
}

export async function updateCardStatus(cardId: string, status: "active" | "frozen" | "cancelled") {
  if (!cardId || cardId.includes("card_") || cardId.length < 10) {
    console.error("[v0] Invalid card ID format:", cardId)
    return { success: false, error: "Invalid card ID format" }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("cards")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", cardId)
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error updating card status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/neobank/cards")
  return { success: true }
}
