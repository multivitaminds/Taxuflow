import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"

function base64UrlEncode(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export async function GET(req: NextRequest) {
  try {
    // Verify this is a valid cron request (Vercel sets this header)
    const cronSecret = req.headers.get("authorization")
    if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log("[v0] Unauthorized cron request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] [CRON] Starting scheduled filing status check...")

    const supabase = createAdminClient()

    const apiKey = process.env.TAXBANDITS_API_KEY
    const apiSecret = process.env.TAXBANDITS_API_SECRET
    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"

    if (!apiKey || !apiSecret) {
      console.error("[v0] [CRON] TaxBandits credentials not configured")
      return NextResponse.json({ error: "TaxBandits credentials not configured" }, { status: 500 })
    }

    // Find all pending W-2 filings (last 24 hours only)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: pendingW2Filings } = await supabase
      .from("w2_filings")
      .select("*")
      .in("taxbandits_status", ["pending", "submitted"])
      .not("submission_id", "is", null)
      .gte("created_at", oneDayAgo)
      .order("submitted_at", { ascending: false })
      .limit(100)

    // Find all pending 1099-NEC filings (last 24 hours only)
    const { data: pending1099Filings } = await supabase
      .from("nec_1099_filings")
      .select("*")
      .in("taxbandits_status", ["pending", "submitted"])
      .not("submission_id", "is", null)
      .gte("created_at", oneDayAgo)
      .order("submitted_at", { ascending: false })
      .limit(100)

    const allPendingFilings = [
      ...(pendingW2Filings || []).map((f) => ({ ...f, table: "w2_filings", formType: "FormW2" })),
      ...(pending1099Filings || []).map((f) => ({ ...f, table: "nec_1099_filings", formType: "Form1099NEC" })),
    ]

    console.log(`[v0] [CRON] Found ${allPendingFilings.length} pending filings to check`)

    if (allPendingFilings.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending filings to check",
        checked: 0,
      })
    }

    const baseUrl = environment === "production" ? "https://api.taxbandits.com" : "https://testsandbox.taxbandits.com"

    // Check all filings in parallel
    const statusChecks = allPendingFilings.map(async (filing) => {
      try {
        const timestamp = Date.now().toString()
        const message = apiKey + timestamp
        const hmac = crypto.createHmac("sha256", apiSecret)
        hmac.update(message)
        const signature = base64UrlEncode(hmac.digest())

        const statusUrl = `${baseUrl}/v1/${filing.formType}/Status?submissionId=${filing.submission_id}`

        const response = await fetch(statusUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
            "X-Timestamp": timestamp,
            "X-Signature": signature,
          },
        })

        if (!response.ok) {
          console.error(`[v0] [CRON] Failed to check status for ${filing.submission_id}:`, response.status)
          return { submission_id: filing.submission_id, updated: false }
        }

        const data = await response.json()
        const records = data.Records || []

        if (records.length === 0) {
          return { submission_id: filing.submission_id, updated: false }
        }

        const record = records[0]
        const status = record.Status?.toLowerCase() || "pending"

        if (status !== filing.taxbandits_status && status !== "pending") {
          const updateData: any = {
            taxbandits_status: status,
            irs_status: record.Status,
            rejection_reasons: record.Errors || null,
            updated_at: new Date().toISOString(),
          }

          if (status === "accepted") {
            updateData.accepted_at = record.StatusTime || new Date().toISOString()

            if (filing.table === "w2_filings" && !filing.refund_amount) {
              const wages = filing.wages || 0
              const federalWithheld = filing.federal_tax_withheld || 0
              const standardDeduction = 13850
              const taxableIncome = Math.max(0, wages - standardDeduction)
              const estimatedTaxLiability = taxableIncome * 0.1
              const refundAmount = federalWithheld - estimatedTaxLiability

              updateData.refund_amount = refundAmount
              updateData.estimated_refund = refundAmount
              updateData.refund_calculated_at = new Date().toISOString()
            }
          } else if (status === "rejected") {
            updateData.rejected_at = record.StatusTime || new Date().toISOString()
          }

          await supabase.from(filing.table).update(updateData).eq("id", filing.id)

          console.log(`[v0] [CRON] ✅ Updated ${filing.submission_id} to ${status}`)
          return { submission_id: filing.submission_id, new_status: status, updated: true }
        }

        return { submission_id: filing.submission_id, updated: false }
      } catch (error) {
        console.error(`[v0] [CRON] Error checking ${filing.submission_id}:`, error)
        return { submission_id: filing.submission_id, updated: false, error: String(error) }
      }
    })

    const results = await Promise.all(statusChecks)
    const updatedCount = results.filter((r) => r.updated).length

    console.log(`[v0] [CRON] ✅ Checked ${allPendingFilings.length} filings, updated ${updatedCount}`)

    return NextResponse.json({
      success: true,
      message: `Checked ${allPendingFilings.length} pending filings`,
      checked: allPendingFilings.length,
      updated: updatedCount,
      results: results.filter((r) => r.updated),
    })
  } catch (error) {
    console.error("[v0] [CRON] Error in scheduled status check:", error)
    return NextResponse.json(
      {
        error: "Failed to check filing status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
