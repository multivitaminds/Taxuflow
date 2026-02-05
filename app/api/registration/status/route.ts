import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Fetching registration status for user:", user.id)

    // Get registration status from database function
    const { data, error } = await supabase.rpc("get_registration_status", {
      p_user_id: user.id,
    })

    if (error) {
      console.error("[v0] Error fetching registration status:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error in registration status route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
