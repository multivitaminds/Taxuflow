import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
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
