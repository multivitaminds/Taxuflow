import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    })
  : null

export async function POST(req: NextRequest) {
  if (!stripe) {
    console.warn("[v0] Stripe not configured, returning demo checkout URL")
    return NextResponse.json({
      url: `${req.nextUrl.origin}/dashboard?demo=true&session_id=demo_session`,
    })
  }

  try {
    const { priceId, mode = "subscription" } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: mode as "subscription" | "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
