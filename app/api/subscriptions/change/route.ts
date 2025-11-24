import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(req: NextRequest) {
  try {
    const { newPriceId, newPlanId } = await req.json()

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    if (!profile?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 })
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
    })

    // Update user profile
    await supabase
      .from("user_profiles")
      .update({
        subscription_tier: newPlanId,
        subscription_status: updatedSubscription.status,
      })
      .eq("id", user.id)

    return NextResponse.json({ success: true, subscription: updatedSubscription })
  } catch (error) {
    console.error("[v0] Subscription change error:", error)
    return NextResponse.json({ error: "Failed to change subscription" }, { status: 500 })
  }
}
