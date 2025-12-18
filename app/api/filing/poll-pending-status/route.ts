import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"

function base64UrlEncode(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export async function GET(req: NextRequest) {
  try {
    console.log("[v0] Starting automatic status polling for pending filings...")

    let supabase
    try {
      supabase = await createAdminClient()
    } catch (error) {
      console.error("[v0] Failed to create admin client:", error)
      return NextResponse.json(
        {
          error: "Configuration Error",
          message: "Missing SUPABASE_SERVICE_ROLE_KEY. Please configure it in Vercel settings.",
        },
        { status: 500 },
      )
    }

    // Get TaxBandits credentials
    const apiKey = process.env.TAXBANDITS_API_KEY
    const apiSecret = process.env.TAXBANDITS_API_SECRET
    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "TaxBandits credentials not configured" }, { status: 500 })
    }

    // Find all pending W-2 filings
    const { data: pendingW2Filings } = await supabase
      .from("w2_filings")
      .select("*")
      .in("taxbandits_status", ["pending", "submitted"])
      .not("submission_id", "is", null)
      .order("submitted_at", { ascending: false })
      .limit(50)

    // Find all pending 1099-NEC filings
    const { data: pending1099Filings } = await supabase
      .from("nec_1099_filings")
      .select("*")
      .in("taxbandits_status", ["pending", "submitted"])
      .not("submission_id", "is", null)
      .order("submitted_at", { ascending: false })
      .limit(50)

    const allPendingFilings = [
      ...(pendingW2Filings || []).map((f) => ({ ...f, table: "w2_filings", formType: "FormW2" })),
      ...(pending1099Filings || []).map((f) => ({ ...f, table: "nec_1099_filings", formType: "Form1099NEC" })),
    ]

    console.log(`[v0] Found ${allPendingFilings.length} pending filings to check`)

    const results = []
    const baseUrl = environment === "production" ? "https://api.taxbandits.com" : "https://testsandbox.taxbandits.com"

    const statusChecks = allPendingFilings.map(async (filing) => {
      try {
        console.log(`[v0] Checking status for ${filing.table} submission:`, filing.submission_id)

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
          console.error(`[v0] Failed to check status for ${filing.submission_id}:`, response.status)
          return {
            submission_id: filing.submission_id,
            error: `HTTP ${response.status}`,
            updated: false,
          }
        }

        const data = await response.json()
        const records = data.Records || []

        if (records.length === 0) {
          console.log(`[v0] No records found for ${filing.submission_id}`)
          return {
            submission_id: filing.submission_id,
            status: "pending",
            updated: false,
            reason: "No records found",
          }
        }

        const record = records[0]
        const status = record.Status?.toLowerCase() || "pending"
        const statusTime = record.StatusTime
        const errors = record.Errors || null

        console.log(`[v0] Status from TaxBandits for ${filing.submission_id}:`, status)

        if (status !== filing.taxbandits_status && status !== "pending") {
          const updateData: any = {
            taxbandits_status: status,
            irs_status: record.Status,
            rejection_reasons: errors,
            updated_at: new Date().toISOString(),
          }

          if (status === "accepted") {
            updateData.accepted_at = statusTime || new Date().toISOString()

            // Calculate refund for W-2 filings
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
            updateData.rejected_at = statusTime || new Date().toISOString()
          }

          const { error: updateError } = await supabase.from(filing.table).update(updateData).eq("id", filing.id)

          if (updateError) {
            console.error(`[v0] Failed to update ${filing.submission_id}:`, updateError)
            return {
              submission_id: filing.submission_id,
              error: updateError.message,
              updated: false,
            }
          }

          console.log(`[v0] Updated ${filing.submission_id} to status: ${status}`)
          return {
            submission_id: filing.submission_id,
            old_status: filing.taxbandits_status,
            new_status: status,
            updated: true,
          }
        }

        return {
          submission_id: filing.submission_id,
          status: status,
          updated: false,
          reason: "No change in status",
        }
      } catch (error) {
        console.error(`[v0] Error checking filing ${filing.submission_id}:`, error)
        return {
          submission_id: filing.submission_id,
          error: error instanceof Error ? error.message : "Unknown error",
          updated: false,
        }
      }
    })

    const checkResults = await Promise.all(statusChecks)
    results.push(...checkResults)

    return NextResponse.json({
      success: true,
      message: `Checked ${allPendingFilings.length} pending filings in parallel`,
      results,
      processing_time_ms: Date.now() - Number.parseInt(req.headers.get("x-start-time") || Date.now().toString()),
    })
  } catch (error) {
    console.error("[v0] Error in status polling:", error)
    return NextResponse.json(
      {
        error: "Failed to poll status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
