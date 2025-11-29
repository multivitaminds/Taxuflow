import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, props: { params: { id: string } }) {
  const startTime = Date.now()
  console.log("[v0] check-status: API called at", new Date().toISOString())

  try {
    const params = props.params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Missing filing ID" }, { status: 400 })
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] check-status: Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch filing
    let filing: any = null
    let tableName = ""

    const { data: w2Filing } = await supabase
      .from("w2_filings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (w2Filing) {
      filing = w2Filing
      tableName = "w2_filings"
    } else {
      const { data: necFiling } = await supabase
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
      console.log("[v0] check-status: Filing not found:", id)
      return NextResponse.json({ error: "Filing not found" }, { status: 404 })
    }

    // Check if already accepted
    const taxbanditsStatus = filing.taxbandits_status?.toLowerCase()
    const irsStatus = filing.irs_status?.toLowerCase()
    const currentStatus = taxbanditsStatus || irsStatus || "pending"

    console.log(`[v0] check-status: Current DB Status - TaxBandits: ${taxbanditsStatus}, IRS: ${irsStatus}`)

    if (currentStatus === "accepted" || currentStatus === "success") {
      console.log("[v0] check-status: Already accepted, returning success")
      return NextResponse.json({
        success: true,
        status: "accepted",
        message: "Filing accepted",
        refund_amount: filing.refund_amount || null,
        debug: {
          db_status: currentStatus,
          source: "database",
        },
      })
    }

    // Sandbox Auto-Accept Logic
    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"

    // Calculate filing age safely
    let filingAge = 0
    if (filing.created_at) {
      const createdTime = new Date(filing.created_at).getTime()
      if (!isNaN(createdTime)) {
        filingAge = Date.now() - createdTime
      } else {
        console.warn("[v0] check-status: Invalid created_at date:", filing.created_at)
        // If date is invalid, assume it's old enough to process
        filingAge = 999999
      }
    }

    const fiveSeconds = 5 * 1000
    const shouldAutoAccept = environment === "sandbox" && filingAge > fiveSeconds

    console.log("[v0] check-status: Auto-accept check:", {
      environment,
      filingAge,
      threshold: fiveSeconds,
      shouldAutoAccept,
    })

    if (shouldAutoAccept) {
      console.log("[v0] check-status: Attempting sandbox auto-accept")

      const updateData: any = {
        taxbandits_status: "Accepted",
        irs_status: "Accepted",
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (tableName === "w2_filings") {
        const wages = Number(filing.wages) || 0
        const federalWithheld = Number(filing.federal_tax_withheld) || 0
        // Simple refund calculation for demo
        const standardDeduction = 13850
        const taxableIncome = Math.max(0, wages - standardDeduction)
        const estimatedTaxLiability = taxableIncome * 0.1
        const refundAmount = federalWithheld - estimatedTaxLiability

        updateData.refund_amount = Math.round(refundAmount * 100) / 100
        updateData.refund_calculated_at = new Date().toISOString()
      }

      console.log("[v0] check-status: Updating database with user-scoped client...", updateData)

      const { data: updatedRows, error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", filing.id)
        .eq("user_id", user.id) // Ensure we only update user's own filing
        .select()

      if (updateError) {
        console.error("[v0] check-status: Database update failed:", updateError)
        return NextResponse.json(
          {
            success: false,
            status: "pending",
            message: "Failed to update filing status",
            error: updateError.message,
          },
          { status: 500 },
        )
      }

      if (!updatedRows || updatedRows.length === 0) {
        console.error("[v0] check-status: Update returned 0 rows! The filing ID might not exist or has been deleted.")
        return NextResponse.json(
          {
            success: false,
            status: "pending",
            message: "Filing not found or access denied",
          },
          { status: 404 },
        )
      }

      console.log("[v0] check-status: Database updated successfully! Rows affected:", updatedRows.length)

      return NextResponse.json({
        success: true,
        status: "accepted",
        message: "Filing accepted (sandbox auto-accepted)",
        refund_amount: updateData.refund_amount || null,
        debug: {
          source: "auto-accept",
          processing_time: Date.now() - startTime,
          db_updated: true,
        },
      })
    }

    const secondsRemaining = Math.max(0, Math.ceil((fiveSeconds - filingAge) / 1000))

    return NextResponse.json({
      success: true,
      status: "pending",
      message: `Sandbox mode: will auto-accept in ${secondsRemaining} seconds`,
      secondsRemaining,
      debug: {
        environment,
        filing_age: filingAge,
      },
    })
  } catch (error) {
    console.error("[v0] check-status: CRITICAL ERROR:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
