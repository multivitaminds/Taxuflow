import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { delivery_id } = body

    if (!delivery_id) {
      return NextResponse.json({ error: "Delivery ID required" }, { status: 400 })
    }

    // Get delivery with webhook ownership verification
    const { data: delivery, error: fetchError } = await supabase
      .from("webhook_deliveries")
      .select("*, webhooks!inner(user_id, url), webhook_events(event_type, data)")
      .eq("id", delivery_id)
      .single()

    if (fetchError || !delivery) {
      console.error("Error fetching webhook delivery:", fetchError)
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }

    // Verify ownership
    if (delivery.webhooks.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Retry the webhook delivery
    try {
      const webhookUrl = delivery.webhooks.url
      const eventData = delivery.webhook_events?.data || {}

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Taxu-Event": delivery.webhook_events?.event_type || "unknown",
          "X-Taxu-Delivery-Id": delivery_id,
        },
        body: JSON.stringify(eventData),
      })

      const responseBody = await response.text()
      const newStatus = response.ok ? "delivered" : "failed"

      // Update delivery status
      const { data: updated, error: updateError } = await supabase
        .from("webhook_deliveries")
        .update({
          status: newStatus,
          response_status_code: response.status,
          response_body: responseBody.substring(0, 5000), // Limit size
          attempt_count: delivery.attempt_count + 1,
          delivered_at: response.ok ? new Date().toISOString() : null,
        })
        .eq("id", delivery_id)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating webhook delivery:", updateError)
        return NextResponse.json({ error: "Failed to update delivery status" }, { status: 500 })
      }

      return NextResponse.json({
        success: response.ok,
        delivery: updated,
        message: response.ok ? "Webhook delivered successfully" : `Webhook failed with status ${response.status}`,
      })
    } catch (fetchError) {
      console.error("Error retrying webhook delivery:", fetchError)

      // Update delivery to failed
      await supabase
        .from("webhook_deliveries")
        .update({
          status: "failed",
          response_body: String(fetchError),
          attempt_count: delivery.attempt_count + 1,
        })
        .eq("id", delivery_id)

      return NextResponse.json(
        { error: "Failed to retry webhook delivery", details: String(fetchError) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in webhook retry route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
