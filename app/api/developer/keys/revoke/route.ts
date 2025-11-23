import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { keyId } = await request.json()

    if (!keyId) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 })
    }

    // Revoke the API key
    const { error: updateError } = await supabase
      .from("api_keys")
      .update({ status: "revoked" })
      .eq("id", keyId)
      .eq("user_id", user.id) // Ensure user owns this key

    if (updateError) {
      console.error("[v0] Error revoking API key:", updateError)
      return NextResponse.json({ error: "Failed to revoke API key" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in API key revocation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
