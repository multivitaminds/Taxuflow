import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch API keys for the user
    const { data: keys, error } = await supabase
      .from("api_keys")
      .select("id, name, key_prefix, environment, is_active, created_at, last_used_at, usage_count")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ keys })
  } catch (error) {
    console.error("[v0] Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, environment = "test", scopes = [] } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate API key
    const prefix = environment === "production" ? "pk_live" : "pk_test"
    const randomBytes = crypto.randomBytes(32).toString("hex")
    const apiKey = `${prefix}_${randomBytes}`

    // Hash the key for storage
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex")

    // Insert into database
    const { data: newKey, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        name,
        key_prefix: `${prefix}_...${randomBytes.slice(-4)}`,
        key_hash: keyHash,
        environment,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    // Insert scopes if provided
    if (scopes.length > 0) {
      const scopeRecords = scopes.map((scope: string) => ({
        api_key_id: newKey.id,
        scope,
      }))

      await supabase.from("api_key_scopes").insert(scopeRecords)
    }

    // Return the full API key (only time it's shown)
    return NextResponse.json({
      apiKey,
      keyInfo: newKey,
    })
  } catch (error) {
    console.error("[v0] Error creating API key:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
