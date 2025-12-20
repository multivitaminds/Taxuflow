import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { url, description, status, events } = body

  const updates: any = {}
  if (url) updates.url = url
  if (description !== undefined) updates.description = description
  if (status) updates.status = status

  const { data: endpoint, error } = await supabase
    .from("webhook_endpoints")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update subscriptions if events provided
  if (events && Array.isArray(events)) {
    // Delete existing subscriptions
    await supabase.from("webhook_subscriptions").delete().eq("webhook_endpoint_id", id)

    // Create new subscriptions
    const subscriptions = events.map((event_type: string) => ({
      webhook_endpoint_id: id,
      event_type,
      enabled: true,
    }))

    await supabase.from("webhook_subscriptions").insert(subscriptions)
  }

  return NextResponse.json({ endpoint })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { error } = await supabase.from("webhook_endpoints").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
