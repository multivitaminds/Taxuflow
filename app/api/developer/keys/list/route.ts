import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
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

    // Fetch user's API keys
    const { data: keys, error: fetchError } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("[v0] Error fetching API keys:", fetchError)
      return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
    }

    // Format keys for display (hide full key, show only prefix and suffix)
    const formattedKeys = keys.map((key) => ({
      id: key.id,
      name: key.name,
      key: `${key.key_prefix}••••••••••••••••${key.key_suffix}`,
      environment: key.environment,
      status: key.status,
      last_used_at: key.last_used_at,
      created_at: key.created_at,
    }))

    return NextResponse.json({ keys: formattedKeys })
  } catch (error) {
    console.error("[v0] Error in API keys list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
