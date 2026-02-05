import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import Stripe from "stripe"

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
    })
  : null

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
    }

    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = await request.json()

    // Retrieve the session to get linked accounts
    const session = await stripe.financialConnections.sessions.retrieve(sessionId)

    if (!session.accounts || session.accounts.data.length === 0) {
      return NextResponse.json({ error: "No accounts linked" }, { status: 400 })
    }

    // Save each linked account to our database
    const savedAccounts = []

    for (const account of session.accounts.data) {
      const { data: saved, error: saveError } = await supabase
        .from("stripe_financial_connections")
        .upsert(
          {
            user_id: user.id,
            linked_account_id: account.id,
            institution_name: account.institution_name,
            institution_id: account.institution?.id,
            account_number_last4: account.last4,
            routing_number: account.routing_number,
            account_type: account.category,
            account_subtype: account.subcategory,
            status: "connected",
            permissions: session.permissions,
            balance_current: account.balance?.current?.amount,
            balance_available: account.balance?.available?.amount,
            balance_currency: account.balance?.current?.currency || "usd",
            balance_updated_at: new Date().toISOString(),
            ownership_verified: account.ownership?.type === "primary",
            connection_method: "oauth",
            last_refreshed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "linked_account_id",
          },
        )
        .select()
        .single()

      if (saveError) {
        console.error("[v0] Error saving account:", saveError)
      } else {
        savedAccounts.push(saved)
      }
    }

    return NextResponse.json({
      success: true,
      accounts: savedAccounts,
      count: savedAccounts.length,
    })
  } catch (error: any) {
    console.error("[v0] Financial Connections callback error:", error)
    return NextResponse.json({ error: error.message || "Failed to process callback" }, { status: 500 })
  }
}
