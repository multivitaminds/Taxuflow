import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - Get a specific ticket with messages
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // Get ticket
    const { data: ticket, error: ticketError } = await supabase
      .from("developer_support_tickets")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from("developer_support_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("[v0] Error fetching messages:", messagesError)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({
      ticket,
      messages: messages || [],
    })
  } catch (error) {
    console.error("[v0] Error in get ticket API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - Update ticket status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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
    const { status, priority } = body

    // Verify ownership
    const { data: ticket, error: checkError } = await supabase
      .from("developer_support_tickets")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (checkError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    // Update ticket
    const updates: any = {}
    if (status) updates.status = status
    if (priority) updates.priority = priority
    if (status === "resolved" || status === "closed") {
      updates.resolved_at = new Date().toISOString()
    }

    const { data: updatedTicket, error: updateError } = await supabase
      .from("developer_support_tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating ticket:", updateError)
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
    }

    return NextResponse.json({ ticket: updatedTicket })
  } catch (error) {
    console.error("[v0] Error in update ticket API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
