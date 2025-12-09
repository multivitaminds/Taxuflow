import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - List support tickets for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") // open, in_progress, resolved, closed
    const priority = searchParams.get("priority") // low, medium, high, urgent
    const category = searchParams.get("category") // api, webhook, sdk, documentation, billing, other
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("developer_support_tickets")
      .select("*, developer_support_messages(count)", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }
    if (priority) {
      query = query.eq("priority", priority)
    }
    if (category) {
      query = query.eq("category", category)
    }

    const { data: tickets, error, count } = await query

    if (error) {
      console.error("[v0] Error fetching support tickets:", error)
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
    }

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error in tickets API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create a new support ticket
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { subject, description, priority, category } = body

    if (!subject || !description) {
      return NextResponse.json({ error: "Subject and description are required" }, { status: 400 })
    }

    // Generate ticket number
    const ticketNumber = `TICK-${Math.floor(1000 + Math.random() * 9000)}`

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("developer_support_tickets")
      .insert({
        user_id: user.id,
        ticket_number: ticketNumber,
        subject,
        description,
        status: "open",
        priority: priority || "medium",
        category: category || "other",
      })
      .select()
      .single()

    if (ticketError) {
      console.error("[v0] Error creating ticket:", ticketError)
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }

    // Create initial message
    const { error: messageError } = await supabase.from("developer_support_messages").insert({
      ticket_id: ticket.id,
      user_id: user.id,
      is_staff: false,
      message: description,
    })

    if (messageError) {
      console.error("[v0] Error creating initial message:", messageError)
    }

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in create ticket API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
