import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("[v0] No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("[v0] Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("[v0] Stripe webhook event received:", event.type)

    const supabase = await createServerClient()

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[v0] Checkout session completed:", session.id)

        // Get the plan from metadata
        const planId = session.metadata?.planId
        const userId = session.metadata?.userId

        if (!userId || !planId) {
          console.error("[v0] Missing userId or planId in session metadata")
          break
        }

        // Update user profile with subscription info
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_tier: planId,
            subscription_status: "active",
          })
          .eq("id", userId)

        if (updateError) {
          console.error("[v0] Error updating user profile:", updateError)
        } else {
          console.log("[v0] Successfully updated user subscription to:", planId)
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription event:", event.type, subscription.id)

        // Find user by customer ID
        const { data: profile, error: findError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single()

        if (findError || !profile) {
          console.error("[v0] Could not find user for customer:", subscription.customer)
          break
        }

        // Get plan ID from subscription metadata or price
        const planId = subscription.metadata?.planId || "premium"

        // Update subscription status
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            stripe_subscription_id: subscription.id,
            subscription_tier: planId,
            subscription_status: subscription.status,
          })
          .eq("id", profile.id)

        if (updateError) {
          console.error("[v0] Error updating subscription:", updateError)
        } else {
          console.log("[v0] Successfully updated subscription status:", subscription.status)
        }
        break
      }

      case "customer.subscription.paused": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription paused:", subscription.id)

        const { data: profile, error: findError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single()

        if (findError || !profile) {
          console.error("[v0] Could not find user for customer:", subscription.customer)
          break
        }

        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            subscription_status: "paused",
          })
          .eq("id", profile.id)

        if (updateError) {
          console.error("[v0] Error pausing subscription:", updateError)
        } else {
          console.log("[v0] Successfully paused subscription")
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        console.log("[v0] Subscription deleted:", subscription.id)

        // Find user by customer ID
        const { data: profile, error: findError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single()

        if (findError || !profile) {
          console.error("[v0] Could not find user for customer:", subscription.customer)
          break
        }

        // Downgrade to free plan
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            stripe_subscription_id: null,
            subscription_tier: "free",
            subscription_status: "canceled",
          })
          .eq("id", profile.id)

        if (updateError) {
          console.error("[v0] Error downgrading to free:", updateError)
        } else {
          console.log("[v0] Successfully downgraded user to free plan")
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("[v0] Invoice payment failed:", invoice.id)

        if (!invoice.customer) break

        const { data: profile, error: findError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", invoice.customer as string)
          .single()

        if (findError || !profile) {
          console.error("[v0] Could not find user for customer:", invoice.customer)
          break
        }

        // Update subscription status to past_due
        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            subscription_status: "past_due",
          })
          .eq("id", profile.id)

        if (updateError) {
          console.error("[v0] Error updating payment failed status:", updateError)
        } else {
          console.log("[v0] Updated subscription to past_due due to payment failure")
        }
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        console.log("[v0] Invoice payment succeeded:", invoice.id)

        if (!invoice.customer) break

        const { data: profile, error: findError } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("stripe_customer_id", invoice.customer as string)
          .single()

        if (findError || !profile) {
          console.error("[v0] Could not find user for customer:", invoice.customer)
          break
        }

        const { error: updateError } = await supabase
          .from("user_profiles")
          .update({
            subscription_status: "active",
          })
          .eq("id", profile.id)

        if (updateError) {
          console.error("[v0] Error updating payment success status:", updateError)
        } else {
          console.log("[v0] Confirmed subscription active after payment success")
        }
        break
      }

      case "payment_intent.created": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[v0] Payment intent created:", paymentIntent.id, "Amount:", paymentIntent.amount)
        break
      }

      case "payment_intent.processing": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[v0] Payment intent processing:", paymentIntent.id)

        if (paymentIntent.metadata?.userId) {
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              subscription_status: "processing",
            })
            .eq("id", paymentIntent.metadata.userId)

          if (updateError) {
            console.error("[v0] Error updating processing status:", updateError)
          }
        }
        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[v0] Payment intent succeeded:", paymentIntent.id, "Amount:", paymentIntent.amount)

        if (paymentIntent.metadata?.userId) {
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              subscription_status: "active",
            })
            .eq("id", paymentIntent.metadata.userId)

          if (updateError) {
            console.error("[v0] Error updating success status:", updateError)
          } else {
            console.log("[v0] Payment succeeded, subscription activated")
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(
          "[v0] Payment intent failed:",
          paymentIntent.id,
          "Error:",
          paymentIntent.last_payment_error?.message,
        )

        if (paymentIntent.metadata?.userId) {
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              subscription_status: "payment_failed",
            })
            .eq("id", paymentIntent.metadata.userId)

          if (updateError) {
            console.error("[v0] Error updating payment failed status:", updateError)
          }
        }
        break
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("[v0] Payment intent canceled:", paymentIntent.id)

        if (paymentIntent.metadata?.userId) {
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({
              subscription_status: "canceled",
            })
            .eq("id", paymentIntent.metadata.userId)

          if (updateError) {
            console.error("[v0] Error updating canceled status:", updateError)
          }
        }
        break
      }

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
