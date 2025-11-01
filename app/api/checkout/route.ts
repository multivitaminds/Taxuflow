import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase/server"
import { getPlanById } from "@/lib/subscription-plans"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Checkout API called")
    const { planId } = await request.json()
    console.log("[v0] Plan ID:", planId)

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Get plan details
    const plan = getPlanById(planId)
    if (!plan) {
      console.log("[v0] Invalid plan ID:", planId)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    console.log("[v0] Plan found:", plan.name, plan.price)

    if (plan.price === 0) {
      return NextResponse.json({ error: "Free plan doesn't require checkout" }, { status: 400 })
    }

    // Get user
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] User not authenticated")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single()

    console.log("[v0] User profile:", profile)

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      console.log("[v0] Creating new Stripe customer")
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.full_name,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id
      console.log("[v0] Created customer:", customerId)

      // Save customer ID
      await supabase.from("user_profiles").update({ stripe_customer_id: customerId }).eq("id", user.id)
    }

    const isSubscription = plan.interval && plan.interval !== "one-time"

    console.log("[v0] Creating checkout session, mode:", isSubscription ? "subscription" : "payment")

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            ...(isSubscription
              ? {
                  recurring: {
                    interval: plan.interval as "month" | "year",
                  },
                }
              : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?success=true&plan=${planId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        plan_id: planId,
        planId: planId, // Added for webhook compatibility
      },
    })

    console.log("[v0] Checkout session created:", session.id)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
