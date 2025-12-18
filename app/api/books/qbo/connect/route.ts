import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clientId = process.env.QBO_CLIENT_ID
    const redirectUri = process.env.QBO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/books/qbo/callback`

    // Check if QuickBooks credentials are configured
    if (!clientId) {
      return NextResponse.json(
        {
          error: "QuickBooks integration not configured",
          message: "Please add QBO_CLIENT_ID and QBO_CLIENT_SECRET to your environment variables",
          setupGuide: "https://developer.intuit.com/app/developer/qbo/docs/get-started",
        },
        { status: 400 },
      )
    }

    const state = randomBytes(32).toString("hex")

    await supabase.from("oauth_states").insert({
      user_id: user.id,
      state,
      provider: "quickbooks",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    })

    // Build QuickBooks OAuth URL
    const authUrl = new URL("https://appcenter.intuit.com/connect/oauth2")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "com.intuit.quickbooks.accounting")
    authUrl.searchParams.set("state", state)

    console.log("[v0] QuickBooks OAuth URL generated for user:", user.id)

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    })
  } catch (error) {
    console.error("[v0] QuickBooks connect error:", error)
    return NextResponse.json({ error: "Failed to initiate QuickBooks connection" }, { status: 500 })
  }
}
