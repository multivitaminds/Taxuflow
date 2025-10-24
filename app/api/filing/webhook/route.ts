import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendProactiveFilingUpdate } from "@/lib/ai/filing-notifications"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("signature")
    const timestamp = req.headers.get("timestamp")
    const clientId = process.env.TAXBANDITS_CLIENT_ID
    const clientSecret = process.env.TAXBANDITS_API_SECRET

    console.log("[v0] Webhook received")
    console.log("[v0] Headers - Signature:", signature?.substring(0, 20) + "...")
    console.log("[v0] Headers - Timestamp:", timestamp)
    console.log("[v0] ClientId configured:", !!clientId)
    console.log("[v0] ClientSecret configured:", !!clientSecret)

    if (!signature || !timestamp || !clientId || !clientSecret) {
      console.error("[v0] Missing required data:", {
        hasSignature: !!signature,
        hasTimestamp: !!timestamp,
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      })
      return NextResponse.json({ error: "Invalid webhook request" }, { status: 401 })
    }

    const body = await req.text()
    console.log("[v0] Webhook payload received, length:", body.length)

    // TaxBandits signature verification: HMAC-SHA256(ClientId + Timestamp, ClientSecret)
    const message = clientId + timestamp
    const expectedSignature = crypto.createHmac("sha256", clientSecret).update(message).digest("base64")

    console.log("[v0] Signature verification:")
    console.log("[v0] - Message:", message.substring(0, 50) + "...")
    console.log("[v0] - Expected:", expectedSignature.substring(0, 20) + "...")
    console.log("[v0] - Received:", signature.substring(0, 20) + "...")
    console.log("[v0] - Match:", signature === expectedSignature)

    if (signature !== expectedSignature) {
      console.error("[v0] Webhook signature mismatch!")
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { SubmissionId, FormType, Records } = payload

    console.log("[v0] Webhook verified successfully!")
    console.log("[v0] - SubmissionId:", SubmissionId)
    console.log("[v0] - FormType:", FormType)
    console.log("[v0] - Records count:", Records?.length || 0)

    // This ensures TaxBandits receives a 200 OK response quickly
    setImmediate(() => {
      processWebhookRecords(SubmissionId, Records).catch((error) => {
        console.error("[v0] Async webhook processing error:", error)
      })
    })

    return NextResponse.json({ success: true, message: "Webhook received" })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function processWebhookRecords(submissionId: string, records: any[]) {
  try {
    const supabase = createAdminClient()

    for (const record of records || []) {
      const { RecordId, Status, StatusCode, StatusTime, Errors } = record

      const { data: filing, error: findError } = await supabase
        .from("tax_filings")
        .select("*")
        .eq("submission_id", submissionId)
        .single()

      if (findError || !filing) {
        console.error("[v0] Filing not found:", submissionId)
        continue
      }

      const filingStatus = Status === "Accepted" ? "accepted" : Status === "Rejected" ? "rejected" : "processing"

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

      try {
        await sendProactiveFilingUpdate(filing.user_id, filing.id)
        console.log("[v0] AI notification sent to user:", filing.user_id)
      } catch (notificationError) {
        console.error("[v0] Failed to send notification:", notificationError)
      }

      console.log("[v0] Filing status updated successfully:", filing.id, "Status:", filingStatus)
    }
  } catch (error) {
    console.error("[v0] Error processing webhook records:", error)
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: "ok",
    message: "Taxu webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  })
}
