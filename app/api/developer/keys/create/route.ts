import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

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

    const { name, environment } = await request.json()

    if (!name || !environment) {
      return NextResponse.json({ error: "Name and environment are required" }, { status: 400 })
    }

    if (!["production", "test"].includes(environment)) {
      return NextResponse.json({ error: "Environment must be 'production' or 'test'" }, { status: 400 })
    }

    // Generate API key
    const randomBytes = crypto.randomBytes(32).toString("hex")
    const prefix = environment === "production" ? "pk_live_" : "pk_test_"
    const apiKey = `${prefix}${randomBytes}`

    // Hash the API key for storage
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex")

    // Get last 4 characters for display
    const keySuffix = randomBytes.slice(-4)

    // Store in database
    const { data: newKey, error: insertError } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        name,
        key_prefix: prefix,
        key_hash: keyHash,
        key_suffix: keySuffix,
        environment,
        status: "active",
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error creating API key:", insertError)
      return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
    }

    // Return the full API key (only shown once!)
    return NextResponse.json({
      id: newKey.id,
      name: newKey.name,
      apiKey: apiKey, // Full key - only shown once
      environment: newKey.environment,
      created_at: newKey.created_at,
    })
  } catch (error) {
    console.error("[v0] Error in API key creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
