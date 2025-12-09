import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Get user's API keys
    const { data: keys } = await supabase.from("api_keys").select("id").eq("user_id", user.id)

    if (!keys || keys.length === 0) {
      return NextResponse.json({ activity: [] })
    }

    const keyIds = keys.map((k) => k.id)

    // Fetch recent API requests
    const { data: requests, error: requestsError } = await supabase
      .from("api_request_logs")
      .select("*")
      .in("api_key_id", keyIds)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (requestsError) {
      console.error("[v0] Error fetching requests:", requestsError)
      return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
    }

    // Fetch recent webhook deliveries
    const { data: webhooks } = await supabase.from("webhooks").select("id").eq("user_id", user.id)

    const webhookIds = webhooks?.map((w) => w.id) || []

    let deliveries: any[] = []
    if (webhookIds.length > 0) {
      const { data: webhookDeliveries } = await supabase
        .from("webhook_deliveries")
        .select(`
          *,
          webhook_events (
            event_type,
            event_category
          )
        `)
        .in("webhook_id", webhookIds)
        .order("created_at", { ascending: false })
        .limit(limit)

      deliveries = webhookDeliveries || []
    }

    // Combine and format activity
    const apiActivity = requests.map((req) => ({
      type: "api_request",
      id: req.id,
      endpoint: req.endpoint,
      method: req.method,
      status: req.status_code,
      responseTime: req.response_time_ms,
      timestamp: req.created_at,
    }))

    const webhookActivity = deliveries.map((del) => ({
      type: "webhook",
      id: del.id,
      event: del.webhook_events?.event_type || "unknown",
      status: del.delivery_status,
      attempts: del.delivery_attempts,
      timestamp: del.created_at,
    }))

    // Merge and sort by timestamp
    const allActivity = [...apiActivity, ...webhookActivity]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({ activity: allActivity })
  } catch (error) {
    console.error("[v0] Error in recent activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
