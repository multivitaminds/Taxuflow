import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getQuickBooksAuthUrl } from "@/lib/quickbooks/oauth"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate OAuth URL with user ID in state
    const authUrl = getQuickBooksAuthUrl(user.id)

    return NextResponse.json({ url: authUrl })
  } catch (error) {
    console.error("[v0] Error generating QuickBooks auth URL:", error)
    return NextResponse.json({ error: "Failed to generate authorization URL" }, { status: 500 })
  }
}
