import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
    })
  : null

export async function POST(req: NextRequest) {
  if (!stripe) {
    console.warn("[v0] Stripe not configured, returning dashboard URL")
    return NextResponse.json({
      url: `${req.nextUrl.origin}/dashboard`,
    })
  }

  try {
    const { customerId } = await req.json()

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.nextUrl.origin}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Stripe portal error:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}
