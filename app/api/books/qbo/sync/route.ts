import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { decrypt } from "@/lib/crypto"
import { handleApiError, ApiError, ErrorCode } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new ApiError("Not authenticated", ErrorCode.UNAUTHORIZED)
    }

    // Get QuickBooks connection
    const { data: connection, error: connError } = await supabase
      .from("qbo_connections")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (connError || !connection) {
      throw new ApiError(
        "QuickBooks not connected. Please connect your QuickBooks account first.",
        ErrorCode.INTEGRATION_ERROR,
      )
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
      const errorText = await accountsResponse.text()
      console.error("[v0] Failed to fetch accounts:", errorText)
      throw new ApiError(
        `Failed to sync accounts from QuickBooks: ${accountsResponse.statusText}`,
        ErrorCode.EXTERNAL_API_ERROR,
      )
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
    return handleApiError(error)
  }
}
