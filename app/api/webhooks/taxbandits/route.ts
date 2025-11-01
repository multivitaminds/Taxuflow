import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendFilingAcceptedEmail, sendFilingRejectedEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] TaxBandits webhook received:", body)

    // Verify webhook signature
    const signature = request.headers.get("x-taxbandits-signature")
    const webhookSecret = process.env.TAXBANDITS_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      console.error("[v0] Missing webhook signature or secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Verify signature properly
    // For now, just check if it exists

    const supabase = await createClient()

    // Update filing status based on webhook event
    const { submission_id, status, rejection_reasons } = body

    const { data: filing, error: filingError } = await supabase
      .from("tax_filings")
      .select("*, user_profiles!inner(email, full_name)")
      .eq("submission_id", submission_id)
      .single()

    if (filingError || !filing) {
      console.error("[v0] Filing not found:", submission_id)
      return NextResponse.json({ error: "Filing not found" }, { status: 404 })
    }

    // Update filing status
    const updates: any = {
      irs_status: status,
      updated_at: new Date().toISOString(),
    }

    if (status === "accepted") {
      updates.accepted_at = new Date().toISOString()
      updates.filing_status = "accepted"

      // Send acceptance email
      await sendFilingAcceptedEmail(
        filing.user_profiles.email,
        filing.user_profiles.full_name || "there",
        filing.tax_year,
        filing.refund_or_owed,
        submission_id,
      )
    } else if (status === "rejected") {
      updates.rejected_at = new Date().toISOString()
      updates.filing_status = "rejected"
      updates.rejection_reasons = rejection_reasons || []

      // Send rejection email
      await sendFilingRejectedEmail(
        filing.user_profiles.email,
        filing.user_profiles.full_name || "there",
        filing.tax_year,
        rejection_reasons || ["Unknown error"],
        submission_id,
      )
    }

    const { error: updateError } = await supabase.from("tax_filings").update(updates).eq("submission_id", submission_id)

    if (updateError) {
      console.error("[v0] Error updating filing:", updateError)
      return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }

    console.log("[v0] Filing status updated and email sent:", submission_id, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
