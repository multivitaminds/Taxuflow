import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-11-20.acacia",
// })

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") return NextResponse.json({})

  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    console.error("[v0] Missing Stripe signature")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock")
  } catch (err: any) {
    console.error("[v0] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  console.log("[v0] Stripe webhook event:", event.type)

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("[v0] Error processing webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[v0] Checkout completed:", session.id)

  const supabase = await createServerClient()
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const planId = session.metadata?.planId || "free"

  // Get user by email
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", session.customer_email)
    .single()

  if (profileError || !profile) {
    console.error("[v0] User not found for email:", session.customer_email)
    return
  }

  // Update user profile with Stripe data
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId || null,
      subscription_tier: planId,
      subscription_status: subscriptionId ? "active" : "active",
    })
    .eq("id", profile.id)

  if (updateError) {
    console.error("[v0] Error updating user profile:", updateError)
  } else {
    console.log("[v0] ✅ User profile updated successfully for:", session.customer_email)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log("[v0] Subscription updated:", subscription.id)

  const supabase = await createServerClient()
  const customerId = subscription.customer as string

  // Get plan ID from metadata or price
  const planId = subscription.metadata?.planId || "premium"

  const { error } = await supabase
    .from("user_profiles")
    .update({
      stripe_subscription_id: subscription.id,
      subscription_tier: planId,
      subscription_status: subscription.status,
    })
    .eq("stripe_customer_id", customerId)

  if (error) {
    console.error("[v0] Error updating subscription:", error)
  } else {
    console.log("[v0] ✅ Subscription updated successfully")
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[v0] Subscription deleted:", subscription.id)

  const supabase = await createServerClient()
  const customerId = subscription.customer as string

  const { error } = await supabase
    .from("user_profiles")
    .update({
      stripe_subscription_id: null,
      subscription_tier: "free",
      subscription_status: "canceled",
    })
    .eq("stripe_customer_id", customerId)

  if (error) {
    console.error("[v0] Error deleting subscription:", error)
  } else {
    console.log("[v0] ✅ Subscription deleted successfully")
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("[v0] Payment succeeded for invoice:", invoice.id)

  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    await handleSubscriptionUpdate(subscription)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("[v0] Payment failed for invoice:", invoice.id)

  const supabase = await createServerClient()
  const customerId = invoice.customer as string

  const { error } = await supabase
    .from("user_profiles")
    .update({
      subscription_status: "past_due",
    })
    .eq("stripe_customer_id", customerId)

  if (error) {
    console.error("[v0] Error updating payment status:", error)
  }
}
