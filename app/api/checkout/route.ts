import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClientSafe } from "@/lib/supabase/server"
import { getPlanById, getAddOnById } from "@/lib/subscription-plans"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Checkout API called")
    const { planId, addOnId } = await request.json()
    console.log("[v0] Plan ID:", planId, "Add-on ID:", addOnId)

    if (!planId && !addOnId) {
      return NextResponse.json({ error: "Plan ID or Add-on ID is required" }, { status: 400 })
    }

    let itemDetails: { name: string; description: string; price: number; interval: string | null } | null = null

    if (planId) {
      const plan = getPlanById(planId)
      if (!plan) {
        console.log("[v0] Invalid plan ID:", planId)
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
      }
      itemDetails = {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        interval: plan.interval,
      }
      console.log("[v0] Plan found:", plan.name, plan.price)
    } else if (addOnId) {
      const addOn = getAddOnById(addOnId)
      if (!addOn) {
        console.log("[v0] Invalid add-on ID:", addOnId)
        return NextResponse.json({ error: "Invalid add-on" }, { status: 400 })
      }
      itemDetails = {
        name: addOn.name,
        description: addOn.description,
        price: addOn.price,
        interval: null, // Add-ons are one-time purchases
      }
      console.log("[v0] Add-on found:", addOn.name, addOn.price)
    }

    if (!itemDetails) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 })
    }

    const hasSupabaseKeys = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasStripeKey = process.env.STRIPE_SECRET_KEY

    if (!hasSupabaseKeys || !hasStripeKey) {
      console.log("[v0] Missing API keys, defaulting to demo mode immediately")
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?success=true&${planId ? `plan=${planId}` : `addon=${addOnId}`}&demo=true`,
      })
    }

    if (itemDetails.price === 0) {
      return NextResponse.json({ error: "Free items don't require checkout" }, { status: 400 })
    }

    const supabase = await createClientSafe()

    if (!supabase) {
      console.log("[v0] Supabase client failed to initialize, returning demo mode")
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?success=true&${planId ? `plan=${planId}` : `addon=${addOnId}`}&demo=true`,
      })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user found, returning mock success")
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?success=true&${planId ? `plan=${planId}` : `addon=${addOnId}`}&demo=true`,
      })
    }

    console.log("[v0] User authenticated:", user.id)

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

      await supabase.from("user_profiles").update({ stripe_customer_id: customerId }).eq("id", user.id)
    }

    const isSubscription = itemDetails.interval && itemDetails.interval !== "one-time"

    console.log("[v0] Creating checkout session, mode:", isSubscription ? "subscription" : "payment")

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: itemDetails.name,
              description: itemDetails.description,
            },
            unit_amount: Math.round(itemDetails.price * 100), // Convert to cents
            ...(isSubscription
              ? {
                  recurring: {
                    interval: itemDetails.interval as "month" | "year",
                  },
                }
              : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?success=true&${planId ? `plan=${planId}` : `addon=${addOnId}`}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://taxu.io"}/dashboard/subscription?canceled=true`,
      metadata: {
        supabase_user_id: user.id,
        ...(planId ? { plan_id: planId, planId: planId } : {}),
        ...(addOnId ? { addon_id: addOnId, addOnId: addOnId } : {}),
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
