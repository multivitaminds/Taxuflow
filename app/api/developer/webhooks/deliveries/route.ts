import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const event_id = searchParams.get("event_id")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get user's webhooks
    const { data: webhooks } = await supabase.from("webhooks").select("id").eq("user_id", user.id)

    if (!webhooks || webhooks.length === 0) {
      return NextResponse.json({ deliveries: [], pagination: { total: 0, limit, offset, hasMore: false } })
    }

    const webhookIds = webhooks.map((w) => w.id)

    // Build query for deliveries
    let query = supabase
      .from("webhook_deliveries")
      .select("*, webhook_events(event_type, event_category, data), webhooks(url)")
      .in("webhook_id", webhookIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    if (event_id) {
      query = query.eq("event_id", event_id)
    }

    const { data: deliveries, error: deliveriesError } = await query

    if (deliveriesError) {
      console.error("Error fetching webhook deliveries:", deliveriesError)
      return NextResponse.json({ error: "Failed to fetch webhook deliveries" }, { status: 500 })
    }

    // Get total count
    let countQuery = supabase
      .from("webhook_deliveries")
      .select("*", { count: "exact", head: true })
      .in("webhook_id", webhookIds)

    if (status) {
      countQuery = countQuery.eq("status", status)
    }

    if (event_id) {
      countQuery = countQuery.eq("event_id", event_id)
    }

    const { count } = await countQuery

    return NextResponse.json({
      deliveries: deliveries || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error("Error in webhook deliveries route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
