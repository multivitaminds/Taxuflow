import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getLinkedAccounts,
  disconnectAccount,
  refreshAccountData,
  isStripeConfigured,
} from "@/lib/stripe-financial-connections"

export async function GET() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({
        error: null, // Don't show error for unconfigured Stripe
        accounts: [],
        stripeConfigured: false,
      })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({
        error: null,
        accounts: [],
        stripeConfigured: true,
      })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized", accounts: [] }, { status: 401 })
    }

    // Get accounts from Stripe
    const stripeAccounts = await getLinkedAccounts(user.id)

    // Also get from our database for additional metadata
    const { data: dbAccounts } = await supabase
      .from("stripe_financial_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "connected")

    // Merge data
    const accounts = stripeAccounts.map((sa) => {
      const dbAccount = dbAccounts?.find((db) => db.linked_account_id === sa.id)
      return {
        ...sa,
        balance: dbAccount?.balance_current,
        balanceAvailable: dbAccount?.balance_available,
        lastRefreshed: dbAccount?.last_refreshed_at,
      }
    })

    return NextResponse.json({ accounts, stripeConfigured: true })
  } catch (error: any) {
    console.error("[v0] Get financial connections error:", error)
    return NextResponse.json({ error: error.message || "Failed to get accounts", accounts: [] }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 500 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("accountId")

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 })
    }

    // Disconnect from Stripe
    await disconnectAccount(accountId)

    // Update our database
    await supabase
      .from("stripe_financial_connections")
      .update({ status: "disconnected" })
      .eq("linked_account_id", accountId)
      .eq("user_id", user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Disconnect account error:", error)
    return NextResponse.json({ error: error.message || "Failed to disconnect account" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable" }, { status: 500 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 })
    }

    // Refresh account data from Stripe
    const refreshedData = await refreshAccountData(accountId)

    // Update our database
    await supabase
      .from("stripe_financial_connections")
      .update({
        balance_current: refreshedData.balance?.current?.amount,
        balance_available: refreshedData.balance?.available?.amount,
        balance_updated_at: new Date().toISOString(),
        last_refreshed_at: new Date().toISOString(),
        refresh_status: "success",
      })
      .eq("linked_account_id", accountId)
      .eq("user_id", user.id)

    return NextResponse.json({ success: true, data: refreshedData })
  } catch (error: any) {
    console.error("[v0] Refresh account error:", error)
    return NextResponse.json({ error: error.message || "Failed to refresh account" }, { status: 500 })
  }
}
