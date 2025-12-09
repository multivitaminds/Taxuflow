import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST - Add a message to a ticket
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
    const { ticket_id, message } = body

    if (!ticket_id || !message) {
      return NextResponse.json({ error: "Ticket ID and message are required" }, { status: 400 })
    }

    // Verify ticket ownership
    const { data: ticket, error: ticketError } = await supabase
      .from("developer_support_tickets")
      .select("id, user_id")
      .eq("id", ticket_id)
      .single()

    if (ticketError || !ticket || ticket.user_id !== user.id) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Create message
    const { data: newMessage, error: messageError } = await supabase
      .from("developer_support_messages")
      .insert({
        ticket_id,
        user_id: user.id,
        is_staff: false,
        message,
      })
      .select()
      .single()

    if (messageError) {
      console.error("[v0] Error creating message:", messageError)
      return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
    }

    // Update ticket's updated_at timestamp
    await supabase
      .from("developer_support_tickets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", ticket_id)

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in create message API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
