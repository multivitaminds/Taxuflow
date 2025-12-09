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
    const category = searchParams.get("category") // tax_filing, neobank, investment, accounting
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("webhook_events")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq("event_category", category)
    }

    const { data: events, error: eventsError } = await query

    if (eventsError) {
      console.error("[v0] Error fetching webhook events:", eventsError)
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }

    let countQuery = supabase.from("webhook_events").select("*", { count: "exact", head: true })

    if (category) {
      countQuery = countQuery.eq("event_category", category)
    }

    const { count } = await countQuery

    return NextResponse.json({
      events,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error("[v0] Error in webhook events route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
