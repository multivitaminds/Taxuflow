import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendFilingAcceptedEmail, sendFilingRejectedEmail } from "@/lib/email"
import crypto from "crypto"

function verifyTaxBanditsSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(payload)
  const expectedSignature = hmac.digest("hex")

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawBody = JSON.stringify(body)

    console.log("[v0] TaxBandits webhook received:", JSON.stringify(body, null, 2))

    const signature = request.headers.get("x-taxbandits-signature")
    const webhookSecret = process.env.TAXBANDITS_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      console.error("[v0] Missing webhook signature or secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!verifyTaxBanditsSignature(rawBody, signature, webhookSecret)) {
      console.error("[v0] Invalid webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log("[v0] Webhook signature verified successfully")

    const supabase = createAdminClient()

    const { submission_id, SubmissionId, status, Status, rejection_reasons, Errors, FormType } = body

    const submissionId = submission_id || SubmissionId
    const filingStatus = (status || Status || "").toLowerCase()
    const rejectionReasons = rejection_reasons || Errors || []
    const formType = FormType || ""

    console.log("[v0] Parsed webhook data:", { submissionId, filingStatus, formType })

    if (!submissionId) {
      console.error("[v0] No submission ID in webhook")
      return NextResponse.json({ error: "No submission ID" }, { status: 400 })
    }

    let filing: any = null
    let tableName = ""

    if (formType.includes("W2") || formType.includes("W-2") || !formType) {
      const { data: w2Filing } = await supabase
        .from("w2_filings")
        .select("*, user_profiles!inner(email, full_name)")
        .eq("submission_id", submissionId)
        .single()

      if (w2Filing) {
        filing = w2Filing
        tableName = "w2_filings"
        console.log("[v0] Found W-2 filing")
      }
    }

    if (!filing && (formType.includes("1099") || !formType)) {
      const { data: necFiling } = await supabase
        .from("nec_1099_filings")
        .select("*, user_profiles!inner(email, full_name)")
        .eq("submission_id", submissionId)
        .single()

      if (necFiling) {
        filing = necFiling
        tableName = "nec_1099_filings"
        console.log("[v0] Found 1099-NEC filing")
      }
    }

    if (!filing) {
      console.error("[v0] Filing not found for submission ID:", submissionId)
      return NextResponse.json({ error: "Filing not found" }, { status: 404 })
    }

    console.log("[v0] Updating filing in table:", tableName)

    const updates: any = {
      irs_status: filingStatus,
      taxbandits_status: filingStatus,
      updated_at: new Date().toISOString(),
    }

    if (filingStatus === "accepted") {
      updates.accepted_at = new Date().toISOString()

      if (tableName === "w2_filings" && !filing.refund_amount) {
        const wages = filing.wages || 0
        const federalWithheld = filing.federal_tax_withheld || 0
        const standardDeduction = 13850
        const taxableIncome = Math.max(0, wages - standardDeduction)
        const estimatedTaxLiability = taxableIncome * 0.1
        const refundAmount = federalWithheld - estimatedTaxLiability

        updates.refund_amount = refundAmount
        updates.estimated_refund = refundAmount
        updates.refund_calculated_at = new Date().toISOString()
      }

      await sendFilingAcceptedEmail(
        filing.user_profiles.email,
        filing.user_profiles.full_name || "there",
        filing.tax_year,
        filing.refund_amount || filing.estimated_refund || 0,
        submissionId,
      )
    } else if (filingStatus === "rejected") {
      updates.rejected_at = new Date().toISOString()
      updates.rejection_reasons = rejectionReasons

      await sendFilingRejectedEmail(
        filing.user_profiles.email,
        filing.user_profiles.full_name || "there",
        filing.tax_year,
        rejectionReasons.length > 0 ? rejectionReasons : ["Unknown error"],
        submissionId,
      )
    }

    const { error: updateError } = await supabase.from(tableName).update(updates).eq("submission_id", submissionId)

    if (updateError) {
      console.error("[v0] Error updating filing:", updateError)
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }

    console.log("[v0] Filing status updated successfully to:", filingStatus)

    return NextResponse.json({ success: true, status: filingStatus })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
