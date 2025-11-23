import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encrypt } from "@/lib/crypto"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const realmId = searchParams.get("realmId")

    if (!code || !realmId) {
      return NextResponse.redirect(new URL("/books?error=missing_params", request.url))
    }

    console.log("[v0] QuickBooks callback received:", { code: code.substring(0, 10) + "...", realmId })

    const clientId = process.env.QBO_CLIENT_ID
    const clientSecret = process.env.QBO_CLIENT_SECRET
    const redirectUri =
      process.env.QBO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/integrations/quickbooks/callback`

    if (!clientId || !clientSecret) {
      console.error("[v0] QuickBooks credentials not configured")
      return NextResponse.redirect(new URL("/books?error=not_configured", request.url))
    }

    // Exchange authorization code for access and refresh tokens
    const tokenResponse = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        Accept: "application/json",
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
      console.error("[v0] QuickBooks token exchange failed:", error)
      return NextResponse.redirect(new URL("/books?error=token_exchange_failed", request.url))
    }

    const tokens = await tokenResponse.json()
    console.log("[v0] QuickBooks tokens received successfully")

    // Get authenticated user from Supabase
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[v0] User not authenticated:", userError)
      return NextResponse.redirect(new URL("/login?error=not_authenticated", request.url))
    }

    // Encrypt tokens before storing (security best practice)
    const encryptedAccessToken = encrypt(tokens.access_token)
    const encryptedRefreshToken = encrypt(tokens.refresh_token)

    // Store encrypted QuickBooks connection in database
    const { error: insertError } = await supabase.from("qbo_connections").upsert({
      user_id: user.id,
      realm_id: realmId,
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      connected_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("[v0] Failed to store QuickBooks connection:", insertError)
      return NextResponse.redirect(new URL("/books?error=storage_failed", request.url))
    }

    console.log("[v0] QuickBooks connection stored successfully for user:", user.id)
    return NextResponse.redirect(new URL("/books?success=connected", request.url))
  } catch (error) {
    console.error("[v0] QuickBooks callback error:", error)
    return NextResponse.redirect(new URL("/books?error=callback_failed", request.url))
  }
}
