import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const clientId = process.env.QBO_CLIENT_ID
    const redirectUri = process.env.QBO_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/books/qbo/callback`

    if (!clientId) {
      return NextResponse.json(
        {
          error: "QuickBooks integration not configured",
          message: "Please add QBO_CLIENT_ID and QBO_CLIENT_SECRET to your environment variables",
        },
        { status: 400 },
      )
    }

    const state = JSON.stringify({ userId, random: Math.random().toString(36).substring(7) })

    // Build QuickBooks OAuth URL
    const authUrl = new URL("https://appcenter.intuit.com/connect/oauth2")
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", redirectUri)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "com.intuit.quickbooks.accounting")
    authUrl.searchParams.set("state", state)

    console.log("[v0] QuickBooks OAuth URL generated")

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error("[v0] QuickBooks connect error:", error)
    return NextResponse.json({ error: "Failed to initiate QuickBooks connection" }, { status: 500 })
  }
}
