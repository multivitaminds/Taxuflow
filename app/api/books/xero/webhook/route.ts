import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { decrypt, encrypt } from "@/lib/crypto"
import crypto from "crypto"

// Xero webhook signature verification
function verifyWebhookSignature(payload: string, signature: string, webhookKey: string): boolean {
  const computedSignature = crypto.createHmac("sha256", webhookKey).update(payload).digest("base64")
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-xero-signature")
    const webhookKey = process.env.XERO_WEBHOOK_KEY

    // Get raw body for signature verification
    const body = await request.text()

    // Verify webhook signature if webhook key is configured
    if (webhookKey && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookKey)
      if (!isValid) {
        console.error("[v0] Xero webhook signature verification failed")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    console.log("[v0] Xero webhook received:", {
      eventCategory: payload.eventCategory,
      eventType: payload.eventType,
      tenantId: payload.tenantId,
    })

    // Handle different event types
    const { events } = payload

    if (!events || events.length === 0) {
      return NextResponse.json({ success: true, message: "No events to process" })
    }

    const supabase = await createClient()

    for (const event of events) {
      const { eventCategory, eventType, eventDateUtc, resourceId, tenantId } = event

      console.log("[v0] Processing event:", {
        category: eventCategory,
        type: eventType,
        resourceId,
      })

      // Find the user with this tenant connection
      const { data: connection } = await supabase
        .from("xero_connections")
        .select("*")
        .eq("tenant_id", tenantId)
        .single()

      if (!connection) {
        console.warn("[v0] No connection found for tenant:", tenantId)
        continue
      }

      // Handle different event categories
      switch (eventCategory) {
        case "INVOICE":
          await handleInvoiceEvent(connection, eventType, resourceId, supabase)
          break

        case "CONTACT":
          await handleContactEvent(connection, eventType, resourceId, supabase)
          break

        case "BILL":
          await handleBillEvent(connection, eventType, resourceId, supabase)
          break

        default:
          console.log("[v0] Unhandled event category:", eventCategory)
      }

      // Log webhook event
      await supabase.from("webhook_logs").insert({
        provider: "xero",
        event_type: `${eventCategory}.${eventType}`,
        tenant_id: tenantId,
        resource_id: resourceId,
        payload: event,
        processed_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Xero webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

// Handle invoice events (CREATE, UPDATE, DELETE)
async function handleInvoiceEvent(connection: any, eventType: string, resourceId: string, supabase: any) {
  try {
    // Get fresh access token
    const accessToken = await refreshTokenIfNeeded(connection, supabase)

    if (eventType === "DELETE") {
      // Mark invoice as deleted
      await supabase.from("synced_invoices").update({ deleted_at: new Date().toISOString() }).eq("xero_id", resourceId)
      return
    }

    // Fetch invoice details from Xero
    const response = await fetch(`https://api.xero.com/api.xro/2.0/Invoices/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "xero-tenant-id": connection.tenant_id,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch invoice from Xero:", await response.text())
      return
    }

    const data = await response.json()
    const invoice = data.Invoices[0]

    // Upsert invoice to your database
    await supabase.from("synced_invoices").upsert({
      user_id: connection.user_id,
      provider: "xero",
      xero_id: invoice.InvoiceID,
      invoice_number: invoice.InvoiceNumber,
      contact_name: invoice.Contact?.Name,
      total: invoice.Total,
      amount_due: invoice.AmountDue,
      status: invoice.Status,
      date: invoice.Date,
      due_date: invoice.DueDate,
      synced_at: new Date().toISOString(),
    })

    console.log("[v0] Invoice synced:", invoice.InvoiceNumber)
  } catch (error) {
    console.error("[v0] Failed to handle invoice event:", error)
  }
}

// Handle contact events
async function handleContactEvent(connection: any, eventType: string, resourceId: string, supabase: any) {
  try {
    const accessToken = await refreshTokenIfNeeded(connection, supabase)

    if (eventType === "DELETE") {
      await supabase.from("synced_contacts").update({ deleted_at: new Date().toISOString() }).eq("xero_id", resourceId)
      return
    }

    const response = await fetch(`https://api.xero.com/api.xro/2.0/Contacts/${resourceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "xero-tenant-id": connection.tenant_id,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("[v0] Failed to fetch contact from Xero")
      return
    }

    const data = await response.json()
    const contact = data.Contacts[0]

    await supabase.from("synced_contacts").upsert({
      user_id: connection.user_id,
      provider: "xero",
      xero_id: contact.ContactID,
      name: contact.Name,
      email: contact.EmailAddress,
      phone: contact.Phones?.[0]?.PhoneNumber,
      is_customer: contact.IsCustomer,
      is_supplier: contact.IsSupplier,
      synced_at: new Date().toISOString(),
    })

    console.log("[v0] Contact synced:", contact.Name)
  } catch (error) {
    console.error("[v0] Failed to handle contact event:", error)
  }
}

// Handle bill events (purchase invoices)
async function handleBillEvent(connection: any, eventType: string, resourceId: string, supabase: any) {
  // Similar to invoice handling but for bills
  console.log("[v0] Bill event handling not fully implemented yet")
}

// Refresh Xero access token if expired
async function refreshTokenIfNeeded(connection: any, supabase: any): Promise<string> {
  const expiresAt = new Date(connection.expires_at)
  const now = new Date()

  // If token expires in less than 5 minutes, refresh it
  if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
    console.log("[v0] Refreshing Xero token")

    const refreshToken = decrypt(connection.refresh_token)

    const response = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh Xero token")
    }

    const tokens = await response.json()

    // Update stored tokens
    await supabase
      .from("xero_connections")
      .update({
        access_token: encrypt(tokens.access_token),
        refresh_token: encrypt(tokens.refresh_token),
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      })
      .eq("id", connection.id)

    return tokens.access_token
  }

  return decrypt(connection.access_token)
}
