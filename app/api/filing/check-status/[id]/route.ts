import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import crypto from "crypto"

function base64UrlEncode(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] Checking filing status for ID:", id)

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    // Try to find the filing in w2_filings first
    let filing: any = null
    let tableName = ""

    const { data: w2Filing, error: w2Error } = await supabase
      .from("w2_filings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] W-2 filing lookup:", { found: !!w2Filing, error: w2Error?.message })

    if (w2Filing) {
      filing = w2Filing
      tableName = "w2_filings"
    } else {
      // Try nec_1099_filings
      const { data: necFiling, error: necError } = await supabase
        .from("nec_1099_filings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      console.log("[v0] 1099-NEC filing lookup:", { found: !!necFiling, error: necError?.message })

      if (necFiling) {
        filing = necFiling
        tableName = "nec_1099_filings"
      }
    }

    if (!filing) {
      console.log("[v0] Filing not found for ID:", id)
      return NextResponse.json({ error: "Filing not found", id: id }, { status: 404 })
    }

    console.log("[v0] Filing found:", { id: filing.id, table: tableName, submissionId: filing.submission_id })

    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"
    const filingAge = Date.now() - new Date(filing.created_at).getTime()
    const fiveSeconds = 5 * 1000

    // In sandbox mode, auto-accept after 5 seconds regardless of submission_id
    if (environment === "sandbox" && filingAge > fiveSeconds && filing.taxbandits_status !== "accepted") {
      console.log("[v0] SANDBOX MODE: Auto-accepting filing after 5 seconds")

      const adminSupabase = createAdminClient()
      const updateData: any = {
        taxbandits_status: "accepted",
        irs_status: "Accepted",
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Calculate refund for W-2 filings
      if (tableName === "w2_filings") {
        const wages = filing.wages || 0
        const federalWithheld = filing.federal_tax_withheld || 0
        const standardDeduction = 13850
        const taxableIncome = Math.max(0, wages - standardDeduction)
        const estimatedTaxLiability = taxableIncome * 0.1
        const refundAmount = federalWithheld - estimatedTaxLiability

        updateData.refund_amount = refundAmount
        updateData.refund_calculated_at = new Date().toISOString()

        console.log("[v0] Calculated refund:", refundAmount)
      }

      await adminSupabase.from(tableName).update(updateData).eq("id", filing.id)

      console.log("[v0] ✅ Filing auto-accepted in sandbox mode")

      return NextResponse.json({
        success: true,
        status: "accepted",
        message: "Filing accepted (sandbox mode - auto-accepted after 5 seconds)",
        refund_amount: updateData.refund_amount || null,
      })
    }

    // If not in sandbox or not old enough yet, check if there's a submission_id
    if (!filing.submission_id) {
      console.log("[v0] No submission ID found for filing:", filing.id)

      return NextResponse.json(
        {
          error: "No submission ID found",
          message: "This filing has not been submitted to the IRS e-file provider yet",
        },
        { status: 400 },
      )
    }

    if (environment === "production") {
      // Get provider credentials
      const apiKey = process.env.TAXBANDITS_API_KEY
      const apiSecret = process.env.TAXBANDITS_API_SECRET

      if (!apiKey || !apiSecret) {
        return NextResponse.json({ error: "E-file provider credentials not configured" }, { status: 500 })
      }

      console.log("[v0] PRODUCTION MODE: Calling TaxBandits API")

      // Generate provider auth token
      const timestamp = Date.now().toString()
      const message = apiKey + timestamp
      const hmac = crypto.createHmac("sha256", apiSecret)
      hmac.update(message)
      const signature = base64UrlEncode(hmac.digest())

      // Call provider API to get filing status
      const baseUrl = "https://api.taxbandits.com"
      const formType = tableName === "w2_filings" ? "FormW2" : "Form1099NEC"
      const statusUrl = `${baseUrl}/v1/${formType}/Status?submissionId=${filing.submission_id}`

      console.log("[v0] Calling provider status API:", statusUrl)

      const response = await fetch(statusUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
          "X-Timestamp": timestamp,
          "X-Signature": signature,
        },
      })

      let data: any
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const textResponse = await response.text()
        console.error("[v0] Provider returned non-JSON response:", textResponse)
        return NextResponse.json(
          {
            error: "E-file provider API error",
            message: "Received invalid response from e-file provider",
            details: textResponse.substring(0, 200),
          },
          { status: 502 },
        )
      }

      console.log("[v0] Provider status response:", JSON.stringify(data, null, 2))

      if (!response.ok) {
        console.error("[v0] Provider API error:", data)
        return NextResponse.json(
          {
            error: "Failed to check status with e-file provider",
            details: data,
          },
          { status: response.status },
        )
      }

      // Extract status from response
      const records = data.Records || []
      if (records.length === 0) {
        return NextResponse.json({ error: "No records found in provider response" }, { status: 404 })
      }

      const record = records[0]
      const status = record.Status?.toLowerCase() || "pending"
      const statusCode = record.StatusCode
      const statusTime = record.StatusTime
      const errors = record.Errors || null

      console.log("[v0] Status from provider:", status, "StatusCode:", statusCode)

      const normalizedStatus = status.toLowerCase()
      console.log("[v0] Normalized status:", normalizedStatus)

      // Update the filing in the database
      const adminSupabase = createAdminClient()
      const updateData: any = {
        taxbandits_status: normalizedStatus,
        irs_status: normalizedStatus,
        rejection_reasons: errors,
        updated_at: new Date().toISOString(),
      }

      if (normalizedStatus === "accepted" || normalizedStatus === "success") {
        updateData.accepted_at = statusTime || new Date().toISOString()

        // Calculate refund for W-2 filings
        if (tableName === "w2_filings") {
          const wages = filing.wages || 0
          const federalWithheld = filing.federal_tax_withheld || 0
          const standardDeduction = 13850
          const taxableIncome = Math.max(0, wages - standardDeduction)
          const estimatedTaxLiability = taxableIncome * 0.1
          const refundAmount = federalWithheld - estimatedTaxLiability

          updateData.refund_amount = refundAmount
          updateData.refund_calculated_at = new Date().toISOString()
        }
      } else if (normalizedStatus === "rejected" || normalizedStatus === "failed") {
        updateData.rejected_at = statusTime || new Date().toISOString()
      }

      console.log("[v0] Updating filing with data:", updateData)

      const { error: updateError } = await adminSupabase.from(tableName).update(updateData).eq("id", filing.id)

      if (updateError) {
        console.error("[v0] Failed to update filing:", updateError)
        return NextResponse.json({ error: "Failed to update filing in database" }, { status: 500 })
      }

      console.log("[v0] Filing status updated successfully:", normalizedStatus)

      return NextResponse.json({
        success: true,
        status: normalizedStatus,
        statusCode: statusCode,
        statusTime: statusTime,
        errors: errors,
        message: `Status updated to: ${normalizedStatus}`,
      })
    }

    console.log("[v0] SANDBOX MODE: Filing not old enough yet, returning pending status")
    return NextResponse.json({
      success: true,
      status: "pending",
      message: `Filing will be auto-accepted in ${Math.ceil((fiveSeconds - filingAge) / 1000)} seconds (sandbox mode)`,
    })
  } catch (error) {
    console.error("[v0] Error checking filing status:", error)
    return NextResponse.json(
      {
        error: "Failed to check filing status",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
