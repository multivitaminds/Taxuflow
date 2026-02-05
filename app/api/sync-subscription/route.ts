import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function POST() {
  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (error) {
      console.warn("[v0] Supabase client creation failed (likely missing env vars):", error)
      return NextResponse.json({
        success: true,
        message: "Demo mode: Subscription sync simulated",
        subscription: { tier: "Free", status: "active" },
      })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      console.log("[v0] No Stripe customer found, user is on free tier")
      return NextResponse.json({
        success: true,
        message: "No subscription found - using free tier",
        subscription: { tier: "free", status: "active" },
      })
    }

    console.log("[v0] Syncing subscription for customer:", profile.stripe_customer_id)

    // Fetch latest subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      limit: 1,
      status: "all",
    })

    if (subscriptions.data.length === 0) {
      console.log("[v0] No active subscription found - checking for one-time payments")

      // Check for successful payments without subscription (one-time payments)
      const paymentIntents = await stripe.paymentIntents.list({
        customer: profile.stripe_customer_id,
        limit: 1,
      })

      if (paymentIntents.data.length > 0 && paymentIntents.data[0].status === "succeeded") {
        const payment = paymentIntents.data[0]
        const planId = payment.metadata?.planId || "pro-monthly"

        console.log("[v0] Found successful one-time payment, updating to:", planId)

        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            subscription_tier: planId,
            subscription_status: "active",
          })
          .eq("id", user.id)

        if (updateError) {
          console.error("[v0] Error updating profile:", updateError)
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          subscription: {
            tier: planId,
            status: "active",
          },
        })
      }

      console.log("[v0] No subscription or payment found, defaulting to free tier")
      return NextResponse.json({
        success: true,
        message: "No active subscription - using free tier",
        subscription: { tier: "free", status: "active" },
      })
    }

    const subscription = subscriptions.data[0]
    const planId = subscription.metadata?.planId || subscription.items.data[0]?.price.metadata?.tier || "pro-monthly"

    console.log("[v0] Found subscription:", subscription.id, "Status:", subscription.status, "Plan:", planId)

    // Update user profile with latest subscription data
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        stripe_subscription_id: subscription.id,
        subscription_tier: planId,
        subscription_status: subscription.status,
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[v0] Error updating profile:", updateError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        tier: planId,
        status: subscription.status,
      },
    })
  } catch (error) {
    console.error("[v0] Sync subscription error:", error)
    return NextResponse.json(
      { error: "Unable to sync subscription at this time. Please try again later." },
      { status: 500 },
    )
  }
}
