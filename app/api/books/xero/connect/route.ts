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

    const clientId = process.env.XERO_CLIENT_ID
    const redirectUri = process.env.XERO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/books/xero/callback`

    // Check if Xero credentials are configured
    if (!clientId) {
      return NextResponse.json(
        {
          error: "Xero integration not configured",
          message: "Please add XERO_CLIENT_ID and XERO_CLIENT_SECRET to your environment variables",
          setupGuide: "https://developer.xero.com/documentation/getting-started-guide/",
        },
        { status: 400 },
      )
    }

    const state = randomBytes(32).toString("hex")

    await supabase.from("oauth_states").insert({
      user_id: user.id,
      state,
      provider: "xero",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    })

    // Build Xero OAuth URL
    const authUrl = new URL("https://login.xero.com/identity/connect/authorize")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "accounting.transactions accounting.contacts accounting.settings")
    authUrl.searchParams.set("state", state)

    console.log("[v0] Xero OAuth URL generated for user:", user.id)

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    })
  } catch (error) {
    console.error("[v0] Xero connect error:", error)
    return NextResponse.json({ error: "Failed to initiate Xero connection" }, { status: 500 })
  }
}
