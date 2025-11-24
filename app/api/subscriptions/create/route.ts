import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createServerClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

const stripeInstance =
  stripe ||
  new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
  })

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PHASE === "phase-production-build") return NextResponse.json({})

  try {
    const { priceId, planId } = await req.json()

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripeInstance.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to profile
      await supabase.from("user_profiles").update({ stripe_customer_id: customerId }).eq("id", user.id)
    }

    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      customer: customerId,
      mode: priceId.includes("monthly") || priceId.includes("yearly") ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard/subscription?success=true`,
      cancel_url: `${req.nextUrl.origin}/dashboard/subscription?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Subscription creation error:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
