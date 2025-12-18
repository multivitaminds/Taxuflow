import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: endpoints, error } = await supabase
      .from("webhook_endpoints")
      .select(
        `
      *,
      webhook_subscriptions(*)
    `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching webhooks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ endpoints })
  } catch (error) {
    console.error("[v0] GET webhooks exception:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] Create webhook - user check:", { hasUser: !!user })

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { url, description, events, environment = "production" } = body

    console.log("[v0] Create webhook request:", { url, eventsCount: events?.length })

    if (!url || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    const secret = `whsec_${crypto.randomBytes(32).toString("hex")}`
    console.log("[v0] Generated webhook secret")

    // Create endpoint
    const { data: endpoint, error: endpointError } = await supabase
      .from("webhook_endpoints")
      .insert({
        user_id: user.id,
        url,
        description,
        secret,
        environment,
        status: "active",
      })
      .select()
      .single()

    if (endpointError) {
      console.error("[v0] Error creating endpoint:", endpointError)
      return NextResponse.json({ error: endpointError.message }, { status: 500 })
    }

    console.log("[v0] Webhook endpoint created:", endpoint.id)

    // Create subscriptions
    const subscriptions = events.map((event_type: string) => ({
      webhook_endpoint_id: endpoint.id,
      event_type,
      enabled: true,
    }))

    const { error: subsError } = await supabase.from("webhook_subscriptions").insert(subscriptions)

    if (subsError) {
      console.error("[v0] Error creating subscriptions:", subsError)
      // Clean up endpoint if subscriptions fail
      await supabase.from("webhook_endpoints").delete().eq("id", endpoint.id)
      return NextResponse.json({ error: subsError.message }, { status: 500 })
    }

    console.log("[v0] Webhook subscriptions created:", subscriptions.length)

    return NextResponse.json({ endpoint: { ...endpoint, events } })
  } catch (error) {
    console.error("[v0] POST webhook exception:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
