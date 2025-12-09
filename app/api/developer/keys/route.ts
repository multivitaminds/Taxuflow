import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch API keys with their scopes
    const { data: keys, error: keysError } = await supabase
      .from("api_keys")
      .select(`
        *,
        api_key_scopes (
          scope_name,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (keysError) {
      console.error("[v0] Error fetching API keys:", keysError)
      return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
    }

    // Format keys for display
    const formattedKeys = keys.map((key) => ({
      id: key.id,
      name: key.name,
      key: `${key.key_prefix}••••••••••••••••${key.key_suffix}`,
      environment: key.environment,
      status: key.status,
      scopes: key.api_key_scopes?.map((s: any) => s.scope_name) || [],
      last_used_at: key.last_used_at,
      created_at: key.created_at,
    }))

    return NextResponse.json({ keys: formattedKeys })
  } catch (error) {
    console.error("[v0] Error in API keys route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
