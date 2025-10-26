import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendProactiveFilingUpdate } from "@/lib/ai/filing-notifications"
import { timingSafeEqual, createHmac } from "crypto"

export async function POST(req: NextRequest) {
  // Process webhook asynchronously after responding
  const responsePromise = NextResponse.json({ success: true, message: "Webhook received" })

  // Process webhook asynchronously
  processWebhook(req).catch((error) => {
    console.error("[v0] Webhook processing error:", error)
  })

  return responsePromise
}

async function processWebhook(req: NextRequest) {
  try {
    console.log("[v0] === WEBHOOK REQUEST RECEIVED ===")
    console.log("[v0] URL:", req.url)
    console.log("[v0] Method:", req.method)

    // Log all headers
    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
      console.log(`[v0] Header ${key}:`, value.substring(0, 50) + (value.length > 50 ? "..." : ""))
    })

    const signature = req.headers.get("signature") || req.headers.get("Signature")
    const timestamp = req.headers.get("timestamp") || req.headers.get("Timestamp")
    const clientId = process.env.TAXBANDITS_CLIENT_ID
    const clientSecret = process.env.TAXBANDITS_API_SECRET

    console.log("[v0] Environment variables check:")
    console.log("[v0] - TAXBANDITS_CLIENT_ID:", clientId ? `${clientId.substring(0, 10)}...` : "❌ MISSING")
    console.log("[v0] - TAXBANDITS_API_SECRET:", clientSecret ? "✅ Set" : "❌ MISSING")

    if (!signature || !timestamp) {
      console.error("[v0] ❌ Missing signature or timestamp headers")
      return
    }

    if (!clientId || !clientSecret) {
      console.error("[v0] ❌ Missing TaxBandits credentials in environment variables")
      return
    }

    // Get request body
    const body = await req.text()
    console.log("[v0] Webhook payload length:", body.length)
    console.log("[v0] Webhook payload:", body.substring(0, 500) + (body.length > 500 ? "..." : ""))

    const message = clientId + timestamp
    const expectedSignature = createHmac("sha256", clientSecret).update(message).digest("base64")

    // Convert strings to buffers for timing-safe comparison
    const expectedBuffer = Buffer.from(expectedSignature)
    const receivedBuffer = Buffer.from(signature)

    if (expectedBuffer.length !== receivedBuffer.length || !timingSafeEqual(expectedBuffer, receivedBuffer)) {
      console.error("[v0] Signature verification FAILED!")
      return
    }

    console.log("[v0] Signature verified successfully!")

    // Parse payload
    const payload = JSON.parse(body)
    const { SubmissionId, FormType, Records } = payload

    console.log("[v0] Webhook data:")
    console.log("[v0] - SubmissionId:", SubmissionId)
    console.log("[v0] - FormType:", FormType)
    console.log("[v0] - Records:", Records?.length || 0)

    // Process records
    await processWebhookRecords(SubmissionId, Records)

    console.log("[v0] ✅ Webhook processed successfully")
  } catch (error) {
    console.error("[v0] ❌ Error processing webhook:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
  }
}

async function processWebhookRecords(submissionId: string, records: any[]) {
  try {
    const supabase = createAdminClient()

    for (const record of records || []) {
      const { RecordId, Status, StatusCode, StatusTime, Errors } = record

      console.log("[v0] Processing record:", RecordId, "Status:", Status)

      // Find the filing by submission ID
      const { data: filing, error: findError } = await supabase
        .from("tax_filings")
        .select("*")
        .eq("submission_id", submissionId)
        .single()

      if (findError || !filing) {
        console.error("[v0] Filing not found for submission:", submissionId, findError)
        continue
      }

      // Map TaxBandits status to our status
      const filingStatus = Status === "Accepted" ? "accepted" : Status === "Rejected" ? "rejected" : "processing"

      // Update filing status
      const { error: updateError } = await supabase
        .from("tax_filings")
        .update({
          filing_status: filingStatus,
          irs_status: Status,
          rejection_reasons: Errors,
          accepted_at: filingStatus === "accepted" ? StatusTime : filing.accepted_at,
          rejected_at: filingStatus === "rejected" ? StatusTime : filing.rejected_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", filing.id)

      if (updateError) {
        console.error("[v0] Failed to update filing:", updateError)
        continue
      }

      console.log("[v0] ✅ Filing updated:", filing.id, "→", filingStatus)

      // Send AI notification to user
      try {
        await sendProactiveFilingUpdate(filing.user_id, filing.id)
        console.log("[v0] ✅ AI notification sent to user:", filing.user_id)
      } catch (notificationError) {
        console.error("[v0] Failed to send notification:", notificationError)
      }
    }
  } catch (error) {
    console.error("[v0] Error processing webhook records:", error)
  }
}

export async function GET(req: NextRequest) {
  console.log("[v0] GET request to webhook endpoint")
  return NextResponse.json({
    status: "ok",
    message: "Taxu webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  })
}
