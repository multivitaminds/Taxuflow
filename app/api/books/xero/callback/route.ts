import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt } from "@/lib/crypto"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    if (!code) {
      return NextResponse.redirect(new URL("/accounting/settings?error=missing_params", request.url))
    }

    console.log("[v0] Xero callback received:", { code: code.substring(0, 10) + "..." })

    const clientId = process.env.XERO_CLIENT_ID
    const clientSecret = process.env.XERO_CLIENT_SECRET
    const redirectUri = process.env.XERO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/books/xero/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(new URL("/accounting/settings?error=not_configured", request.url))
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error("[v0] Xero token exchange failed:", error)
      return NextResponse.redirect(new URL("/accounting/settings?error=token_exchange_failed", request.url))
    }

    const tokens = await tokenResponse.json()
    console.log("[v0] Xero tokens received successfully")

    // Get Xero tenant/organization ID
    const connectionsResponse = await fetch("https://api.xero.com/connections", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!connectionsResponse.ok) {
      console.error("[v0] Failed to get Xero connections")
      return NextResponse.redirect(new URL("/accounting/settings?error=connection_failed", request.url))
    }

    const connections = await connectionsResponse.json()
    const tenantId = connections[0]?.tenantId

    if (!tenantId) {
      return NextResponse.redirect(new URL("/accounting/settings?error=no_tenant", request.url))
    }

    // Get user from Supabase
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0] User not authenticated:", userError)
      return NextResponse.redirect(new URL("/login?error=not_authenticated", request.url))
    }

    // Encrypt and store tokens
    const encryptedAccessToken = encrypt(tokens.access_token)
    const encryptedRefreshToken = encrypt(tokens.refresh_token)

    const { error: insertError } = await supabase.from("xero_connections").upsert({
      user_id: user.id,
      tenant_id: tenantId,
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      connected_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[v0] Failed to store Xero connection:", insertError)
      return NextResponse.redirect(new URL("/accounting/settings?error=storage_failed", request.url))
    }

    console.log("[v0] Xero connection stored successfully")
    return NextResponse.redirect(new URL("/accounting/settings?success=xero_connected", request.url))
  } catch (error) {
    console.error("[v0] Xero callback error:", error)
    return NextResponse.redirect(new URL("/accounting/settings?error=callback_failed", request.url))
  }
}
