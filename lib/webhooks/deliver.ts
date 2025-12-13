import { createHmac } from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import type { WebhookEventType, WebhookPayload } from "./types"

const MAX_RETRIES = 3
const RETRY_DELAYS = [60, 300, 900] // 1min, 5min, 15min in seconds

export async function deliverWebhook(
  eventId: string,
  eventType: WebhookEventType,
  resourceId: string,
  resourceType: string,
  userId: string,
  eventData: Record<string, any>,
) {
  const supabase = createAdminClient()

  // Store the event
  const { data: event, error: eventError } = await supabase
    .from("webhook_events")
    .insert({
      id: eventId,
      event_type: eventType,
      resource_id: resourceId,
      resource_type: resourceType,
      user_id: userId,
      data: eventData,
    })
    .select()
    .single()

  if (eventError) {
    console.error("[v0] Error storing webhook event:", eventError)
    return
  }

  // Find all active endpoints subscribed to this event type
  const { data: endpoints, error: endpointsError } = await supabase
    .from("webhook_endpoints")
    .select(
      `
      *,
      webhook_subscriptions!inner(*)
    `,
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("webhook_subscriptions.event_type", eventType)
    .eq("webhook_subscriptions.enabled", true)

  if (endpointsError || !endpoints || endpoints.length === 0) {
    console.log("[v0] No active webhook endpoints found for event:", eventType)
    return
  }

  console.log("[v0] Delivering webhook to", endpoints.length, "endpoint(s)")

  // Deliver to each endpoint
  for (const endpoint of endpoints) {
    await deliverToEndpoint(supabase, endpoint, eventId, eventType, eventData)
  }
}

async function deliverToEndpoint(
  supabase: any,
  endpoint: any,
  eventId: string,
  eventType: WebhookEventType,
  eventData: Record<string, any>,
) {
  const payload: WebhookPayload = {
    id: eventId,
    object: "event",
    type: eventType,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: eventData,
    },
  }

  const payloadString = JSON.stringify(payload)
  const signature = generateSignature(payloadString, endpoint.secret)
  const timestamp = Date.now().toString()

  // Create delivery log
  const { data: delivery } = await supabase
    .from("webhook_deliveries")
    .insert({
      webhook_endpoint_id: endpoint.id,
      event_id: eventId,
      event_type: eventType,
      payload: payload,
      status: "pending",
      attempt_number: 1,
    })
    .select()
    .single()

  if (!delivery) return

  const startTime = Date.now()

  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Taxu-Signature": signature,
        "X-Taxu-Timestamp": timestamp,
        "User-Agent": "Taxu-Webhooks/1.0",
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    const responseTime = Date.now() - startTime
    const responseBody = await response.text()

    // Update delivery log
    await supabase
      .from("webhook_deliveries")
      .update({
        http_status: response.status,
        response_body: responseBody.substring(0, 1000), // Store first 1000 chars
        response_time_ms: responseTime,
        status: response.ok ? "success" : "failed",
        delivered_at: response.ok ? new Date().toISOString() : undefined,
        error_message: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
        next_retry_at: response.ok ? undefined : new Date(Date.now() + RETRY_DELAYS[0] * 1000).toISOString(),
      })
      .eq("id", delivery.id)

    // Update endpoint last triggered time
    if (response.ok) {
      await supabase
        .from("webhook_endpoints")
        .update({ last_triggered_at: new Date().toISOString() })
        .eq("id", endpoint.id)
    }

    console.log(
      `[v0] Webhook delivered to ${endpoint.url}:`,
      response.ok ? "✅ Success" : `❌ Failed (${response.status})`,
    )
  } catch (error: any) {
    const responseTime = Date.now() - startTime

    // Update delivery log with error
    await supabase
      .from("webhook_deliveries")
      .update({
        response_time_ms: responseTime,
        status: "failed",
        error_message: error.message,
        next_retry_at: new Date(Date.now() + RETRY_DELAYS[0] * 1000).toISOString(),
      })
      .eq("id", delivery.id)

    console.error("[v0] Webhook delivery error:", error.message)
  }
}

export async function retryFailedWebhooks() {
  const supabase = createAdminClient()

  // Find deliveries ready for retry
  const { data: deliveries } = await supabase
    .from("webhook_deliveries")
    .select(
      `
      *,
      webhook_endpoints(*)
    `,
    )
    .eq("status", "retrying")
    .lte("next_retry_at", new Date().toISOString())
    .lt("attempt_number", MAX_RETRIES)
    .limit(100)

  if (!deliveries || deliveries.length === 0) return

  console.log("[v0] Retrying", deliveries.length, "failed webhook deliveries")

  for (const delivery of deliveries) {
    const endpoint = delivery.webhook_endpoints
    if (!endpoint || endpoint.status !== "active") continue

    const attemptNumber = delivery.attempt_number + 1
    const payloadString = JSON.stringify(delivery.payload)
    const signature = generateSignature(payloadString, endpoint.secret)
    const timestamp = Date.now().toString()

    // Update to retrying status
    await supabase
      .from("webhook_deliveries")
      .update({
        status: "retrying",
        attempt_number: attemptNumber,
      })
      .eq("id", delivery.id)

    const startTime = Date.now()

    try {
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Taxu-Signature": signature,
          "X-Taxu-Timestamp": timestamp,
          "User-Agent": "Taxu-Webhooks/1.0",
        },
        body: payloadString,
        signal: AbortSignal.timeout(10000),
      })

      const responseTime = Date.now() - startTime
      const responseBody = await response.text()

      const isSuccess = response.ok
      const nextRetryDelay = attemptNumber < MAX_RETRIES ? RETRY_DELAYS[attemptNumber] : undefined

      await supabase
        .from("webhook_deliveries")
        .update({
          http_status: response.status,
          response_body: responseBody.substring(0, 1000),
          response_time_ms: responseTime,
          status: isSuccess ? "success" : attemptNumber >= MAX_RETRIES ? "failed" : "retrying",
          delivered_at: isSuccess ? new Date().toISOString() : undefined,
          error_message: isSuccess ? undefined : `Retry ${attemptNumber} failed: HTTP ${response.status}`,
          next_retry_at:
            isSuccess || attemptNumber >= MAX_RETRIES
              ? undefined
              : new Date(Date.now() + nextRetryDelay! * 1000).toISOString(),
        })
        .eq("id", delivery.id)

      console.log(`[v0] Retry ${attemptNumber} for webhook ${delivery.id}:`, isSuccess ? "✅ Success" : "❌ Failed")
    } catch (error: any) {
      const responseTime = Date.now() - startTime
      const nextRetryDelay = attemptNumber < MAX_RETRIES ? RETRY_DELAYS[attemptNumber] : undefined

      await supabase
        .from("webhook_deliveries")
        .update({
          response_time_ms: responseTime,
          status: attemptNumber >= MAX_RETRIES ? "failed" : "retrying",
          error_message: `Retry ${attemptNumber} error: ${error.message}`,
          next_retry_at:
            attemptNumber >= MAX_RETRIES ? undefined : new Date(Date.now() + nextRetryDelay! * 1000).toISOString(),
        })
        .eq("id", delivery.id)
    }
  }
}

function generateSignature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateSignature(payload, secret)
  return signature === expectedSignature
}
