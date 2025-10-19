import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { decrypt } from "@/lib/crypto"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get QuickBooks connection
    const { data: connection, error: connError } = await supabase
      .from("qbo_connections")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (connError || !connection) {
      return NextResponse.json({ error: "QuickBooks not connected" }, { status: 400 })
    }

    console.log("[v0] Starting QuickBooks sync for realm:", connection.realm_id)

    // Decrypt access token
    const accessToken = decrypt(connection.access_token)

    // Sync accounts
    const accountsResponse = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${connection.realm_id}/query?query=SELECT * FROM Account`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    )

    if (!accountsResponse.ok) {
      console.error("[v0] Failed to fetch accounts:", await accountsResponse.text())
      return NextResponse.json({ error: "Failed to sync accounts" }, { status: 500 })
    }

    const accountsData = await accountsResponse.json()
    console.log("[v0] Synced accounts:", accountsData.QueryResponse?.Account?.length || 0)

    // Sync invoices
    const invoicesResponse = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${connection.realm_id}/query?query=SELECT * FROM Invoice`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    )

    if (!invoicesResponse.ok) {
      console.error("[v0] Failed to fetch invoices:", await invoicesResponse.text())
    }

    const invoicesData = await invoicesResponse.json()
    console.log("[v0] Synced invoices:", invoicesData.QueryResponse?.Invoice?.length || 0)

    // Update last sync time
    await supabase.from("qbo_connections").update({ last_sync: new Date().toISOString() }).eq("user_id", user.id)

    return NextResponse.json({
      success: true,
      synced: {
        accounts: accountsData.QueryResponse?.Account?.length || 0,
        invoices: invoicesData.QueryResponse?.Invoice?.length || 0,
      },
    })
  } catch (error) {
    console.error("[v0] QuickBooks sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
