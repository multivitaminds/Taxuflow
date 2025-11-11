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
    await processWebhookRecords(SubmissionId, FormType, Records)

    console.log("[v0] ✅ Webhook processed successfully")
  } catch (error) {
    console.error("[v0] ❌ Error processing webhook:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
  }
}

async function processWebhookRecords(submissionId: string, formType: string, records: any[]) {
  try {
    const supabase = createAdminClient()

    const isW2 = submissionId.startsWith("W2-") || formType === "Form W-2" || formType === "W2"
    const is1099NEC = submissionId.startsWith("1099NEC-") || formType === "Form 1099-NEC" || formType === "1099-NEC"

    let tableName = "tax_filings" // default fallback
    if (isW2) {
      tableName = "w2_filings"
    } else if (is1099NEC) {
      tableName = "nec_1099_filings"
    }

    console.log("[v0] Using table:", tableName, "for form type:", formType)

    for (const record of records || []) {
      const { RecordId, Status, StatusCode, StatusTime, Errors } = record

      console.log("[v0] Processing record:", RecordId, "Status:", Status, "StatusCode:", StatusCode)

      // Find the filing by submission ID
      const { data: filing, error: findError } = await supabase
        .from(tableName)
        .select("*")
        .eq("submission_id", submissionId)
        .single()

      if (findError || !filing) {
        console.error("[v0] Filing not found for submission:", submissionId, findError)
        continue
      }

      const taxbanditsStatus = Status?.toLowerCase() || "pending"

      let refundAmount = null
      if (tableName === "w2_filings" && taxbanditsStatus === "accepted") {
        const wages = filing.wages || 0
        const federalWithheld = filing.federal_tax_withheld || 0
        const ssWithheld = filing.social_security_tax || 0
        const medicareWithheld = filing.medicare_tax || 0

        const totalWithheld = federalWithheld + ssWithheld + medicareWithheld

        const standardDeduction = 13850
        const taxableIncome = Math.max(0, wages - standardDeduction)
        const estimatedTaxLiability = taxableIncome * 0.1

        refundAmount = federalWithheld - estimatedTaxLiability

        console.log("[v0] Calculated refund:")
        console.log("[v0] - Wages:", wages)
        console.log("[v0] - Federal Withheld:", federalWithheld)
        console.log("[v0] - Estimated Tax:", estimatedTaxLiability)
        console.log("[v0] - Calculated Refund:", refundAmount)
      }

      const updateData: any = {
        taxbandits_status: taxbanditsStatus,
        irs_status: Status,
        rejection_reasons: Errors || null,
        updated_at: new Date().toISOString(),
      }

      if (taxbanditsStatus === "accepted") {
        updateData.accepted_at = StatusTime || new Date().toISOString()
        if (refundAmount !== null) {
          updateData.refund_amount = refundAmount
          updateData.refund_calculated_at = new Date().toISOString()
        }
      } else if (taxbanditsStatus === "rejected") {
        updateData.rejected_at = StatusTime || new Date().toISOString()
      }

      const { error: updateError } = await supabase.from(tableName).update(updateData).eq("id", filing.id)

      if (updateError) {
        console.error("[v0] Failed to update filing:", updateError)
        continue
      }

      console.log("[v0] ✅ Filing updated:", filing.id, "→", taxbanditsStatus)
      if (refundAmount !== null) {
        console.log("[v0] ✅ Refund saved to database:", refundAmount)
      }

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
