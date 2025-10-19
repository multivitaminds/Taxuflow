import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ connected: false })
    }

    const { data: connection, error } = await supabase
      .from("qbo_connections")
      .select("last_sync, connected_at")
      .eq("user_id", user.id)
      .single()

    if (error || !connection) {
      return NextResponse.json({ connected: false })
    }

    return NextResponse.json({
      connected: true,
      lastSync: connection.last_sync,
      connectedAt: connection.connected_at,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({ connected: false })
  }
}
