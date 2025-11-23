import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { plaidClient } from "@/lib/plaid-client"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { publicToken, providerName } = await request.json()

    if (!publicToken || !providerName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Exchange public token for access token
    const { accessToken, itemId } = await plaidClient.exchangePublicToken(publicToken)

    // Store connection in database
    const { data: connection, error: dbError } = await supabase
      .from("payroll_connections")
      .insert({
        user_id: user.id,
        provider_name: providerName,
        plaid_access_token: accessToken,
        plaid_item_id: itemId,
        connection_status: "active",
        last_synced_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ success: true, connection })
  } catch (error: any) {
    console.error("[v0] Plaid token exchange error:", error)
    return NextResponse.json({ error: error.message || "Failed to exchange token" }, { status: 500 })
  }
}
