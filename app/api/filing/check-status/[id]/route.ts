import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  // 1. Top-level try/catch to ensure we ALWAYS return JSON
  try {
    // 2. Safely await params
    const params = await props.params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Missing filing ID" }, { status: 400 })
    }

    // 3. Create Supabase client safely
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error("[v0] Failed to create Supabase client:", clientError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: clientError instanceof Error ? clientError.message : String(clientError),
        },
        { status: 500 },
      )
    }

    if (!supabase) {
      return NextResponse.json({ error: "Database configuration missing" }, { status: 500 })
    }

    // 4. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 5. Fetch filing
    let filing: any = null
    let tableName = ""

    const { data: w2Filing, error: w2Error } = await supabase
      .from("w2_filings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (w2Filing) {
      filing = w2Filing
      tableName = "w2_filings"
    } else {
      const { data: necFiling, error: necError } = await supabase
        .from("nec_1099_filings")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (necFiling) {
        filing = necFiling
        tableName = "nec_1099_filings"
      }
    }

    if (!filing) {
      return NextResponse.json({ error: "Filing not found", id: id }, { status: 404 })
    }

    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"
    const filingAge = Date.now() - new Date(filing.created_at).getTime()
    const fiveSeconds = 5 * 1000

    // 6. Sandbox Auto-Accept Logic
    if (environment === "sandbox" && filingAge > fiveSeconds && filing.taxbandits_status !== "accepted") {
      try {
        const adminSupabase = await createAdminClient()
        const updateData: any = {
          taxbandits_status: "accepted",
          irs_status: "Accepted",
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        if (tableName === "w2_filings") {
          const wages = Number(filing.wages || 0)
          const federalWithheld = Number(filing.federal_tax_withheld || 0)
          const standardDeduction = 13850
          const taxableIncome = Math.max(0, wages - standardDeduction)
          const estimatedTaxLiability = taxableIncome * 0.1
          const refundAmount = federalWithheld - estimatedTaxLiability

          updateData.refund_amount = refundAmount
          updateData.refund_calculated_at = new Date().toISOString()
        }

        const { error: updateError } = await adminSupabase.from(tableName).update(updateData).eq("id", filing.id)

        if (updateError) {
          console.error("[v0] Admin update failed:", updateError)
          throw new Error(`Database update failed: ${updateError.message}`)
        }

        return NextResponse.json({
          success: true,
          status: "accepted",
          message: "Filing accepted (sandbox mode - auto-accepted after 5 seconds)",
          refund_amount: updateData.refund_amount || null,
        })
      } catch (adminError) {
        console.error("[v0] Failed to create admin client or update filing:", adminError)

        const errorMessage = adminError instanceof Error ? adminError.message : "Unknown admin error"
        const isCredentialError = errorMessage.includes("Missing Supabase admin credentials")

        return NextResponse.json({
          success: true,
          status: "pending",
          message: isCredentialError
            ? "Filing pending (Sandbox auto-accept requires SUPABASE_SERVICE_ROLE_KEY)"
            : "Filing pending (sandbox mode - auto-accept failed)",
          error: errorMessage,
        })
      }
    }

    if (!filing.submission_id) {
      return NextResponse.json(
        {
          error: "No submission ID found",
          message: "This filing has not been submitted to the IRS e-file provider yet",
        },
        { status: 400 },
      )
    }

    // 7. Production Logic (Dynamic Import for Crypto)
    if (environment === "production") {
      const apiKey = process.env.TAXBANDITS_API_KEY
      const apiSecret = process.env.TAXBANDITS_API_SECRET

      if (!apiKey || !apiSecret) {
        return NextResponse.json({ error: "E-file provider credentials not configured" }, { status: 500 })
      }

      // Dynamically require crypto to avoid top-level import issues
      const crypto = require("crypto")

      const timestamp = Date.now().toString()
      const message = apiKey + timestamp
      const hmac = crypto.createHmac("sha256", apiSecret)
      hmac.update(message)
      const signature = hmac.digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")

      const baseUrl = "https://api.taxbandits.com"
      const formType = tableName === "w2_filings" ? "FormW2" : "Form1099NEC"
      const statusUrl = `${baseUrl}/v1/${formType}/Status?submissionId=${filing.submission_id}`

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
        return NextResponse.json(
          {
            error: "E-file provider API error",
            message: "Received invalid response from e-file provider",
            details: textResponse.substring(0, 200),
          },
          { status: 502 },
        )
      }

      if (!response.ok) {
        return NextResponse.json(
          {
            error: "Failed to check status with e-file provider",
            details: data,
          },
          { status: response.status },
        )
      }

      const records = data.Records || []
      if (records.length === 0) {
        return NextResponse.json({ error: "No records found in provider response" }, { status: 404 })
      }

      const record = records[0]
      const status = record.Status?.toLowerCase() || "pending"
      const statusCode = record.StatusCode
      const statusTime = record.StatusTime
      const errors = record.Errors || null

      const normalizedStatus = status.toLowerCase()

      try {
        const adminSupabase = await createAdminClient()
        const updateData: any = {
          taxbandits_status: normalizedStatus,
          irs_status: normalizedStatus,
          rejection_reasons: errors,
          updated_at: new Date().toISOString(),
        }

        if (normalizedStatus === "accepted" || normalizedStatus === "success") {
          updateData.accepted_at = statusTime || new Date().toISOString()

          if (tableName === "w2_filings") {
            const wages = Number(filing.wages || 0)
            const federalWithheld = Number(filing.federal_tax_withheld || 0)
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

        await adminSupabase.from(tableName).update(updateData).eq("id", filing.id)
      } catch (adminError) {
        console.error("[v0] Failed to update filing status:", adminError)
      }

      return NextResponse.json({
        success: true,
        status: normalizedStatus,
        statusCode: statusCode,
        statusTime: statusTime,
        errors: errors,
        message: `Status updated to: ${normalizedStatus}`,
      })
    }

    return NextResponse.json({
      success: true,
      status: "pending",
      message: `Filing will be auto-accepted in ${Math.ceil((fiveSeconds - filingAge) / 1000)} seconds (sandbox mode)`,
    })
  } catch (error) {
    console.error("[v0] CRITICAL ERROR in check-status:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
