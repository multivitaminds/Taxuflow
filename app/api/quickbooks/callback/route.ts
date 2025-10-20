import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { exchangeCodeForTokens } from "@/lib/quickbooks/oauth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const state = searchParams.get("state") // user ID
    const realmId = searchParams.get("realmId")

    if (!code || !state || !realmId) {
      return NextResponse.redirect(new URL("/accounting?error=missing_params", request.url))
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code)

    // Save tokens to database
    const supabase = await createServerClient()

    const { error } = await supabase.from("quickbooks_connections").upsert({
      user_id: state,
      realm_id: realmId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
      connected_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Error saving QuickBooks connection:", error)
      return NextResponse.redirect(new URL("/accounting?error=save_failed", request.url))
    }

    // Redirect to accounting page with success message
    return NextResponse.redirect(new URL("/accounting?connected=true", request.url))
  } catch (error) {
    console.error("[v0] QuickBooks callback error:", error)
    return NextResponse.redirect(new URL("/accounting?error=connection_failed", request.url))
  }
}
