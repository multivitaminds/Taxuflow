import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendProactiveFilingUpdate } from "@/lib/ai/filing-notifications"
import crypto from "crypto"

// Webhook handler for TaxBandits status updates
export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-taxbandits-signature")
    const webhookSecret = process.env.EFILE_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      console.error("[v0] Missing webhook signature or secret")
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const body = await req.text()
    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")

    if (signature !== expectedSignature) {
      console.error("[v0] Webhook signature mismatch")
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { SubmissionId, StatusCode, IRSStatus, StateStatus, Errors } = payload

    console.log("[v0] Webhook received for submission:", SubmissionId, "Status:", StatusCode)

    const supabase = createAdminClient()

    const { data: filing, error: findError } = await supabase
      .from("tax_filings")
      .select("*")
      .eq("submission_id", SubmissionId)
      .single()

    if (findError || !filing) {
      console.error("[v0] Filing not found:", SubmissionId)
      return NextResponse.json({ error: "Filing not found" }, { status: 404 })
    }

    const status = StatusCode === 200 ? "accepted" : StatusCode >= 400 ? "rejected" : "processing"

    // Update filing status
    const { error: updateError } = await supabase
      .from("tax_filings")
      .update({
        filing_status: status,
        irs_status: IRSStatus,
        state_status: StateStatus,
        rejection_reasons: Errors,
        accepted_at: status === "accepted" ? new Date().toISOString() : filing.accepted_at,
        rejected_at: status === "rejected" ? new Date().toISOString() : filing.rejected_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", filing.id)

    if (updateError) {
      console.error("[v0] Failed to update filing:", updateError)
      return NextResponse.json({ error: "Failed to update filing" }, { status: 500 })
    }

    try {
      await sendProactiveFilingUpdate(filing.user_id, filing.id)
      console.log("[v0] AI notification sent to user:", filing.user_id)
    } catch (notificationError) {
      console.error("[v0] Failed to send notification:", notificationError)
      // Don't fail the webhook if notification fails
    }

    console.log("[v0] Filing status updated successfully:", filing.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(req: NextRequest) {
  // TaxBandits may send a GET request to verify the webhook URL is accessible
  return NextResponse.json({
    status: "ok",
    message: "Taxu webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  })
}
