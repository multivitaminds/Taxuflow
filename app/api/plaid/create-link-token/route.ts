import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { plaidClient } from "@/lib/plaid-client"

export async function POST() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const linkToken = await plaidClient.createLinkToken(user.id)

    return NextResponse.json({ linkToken })
  } catch (error: any) {
    console.error("[v0] Plaid link token error:", error)
    return NextResponse.json({ error: error.message || "Failed to create link token" }, { status: 500 })
  }
}
