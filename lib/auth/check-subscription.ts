import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requirePaidSubscription() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_tier")
    .eq("user_id", user.id)
    .maybeSingle()

  // Free tier users cannot access developer portal
  if (!profile || profile.subscription_tier === "Free") {
    redirect("/pricing?upgrade=developer")
  }

  return { user, profile }
}

export const PAID_TIERS = ["Developer", "Startup", "Business", "Enterprise", "Premium", "AI Co-Pilot"]

export function isPaidTier(tier: string | null | undefined): boolean {
  return tier ? PAID_TIERS.includes(tier) : false
}
