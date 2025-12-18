import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendFilingAcceptedEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { taxYears } = await request.json()

    if (!taxYears || !Array.isArray(taxYears) || taxYears.length === 0) {
      return NextResponse.json({ error: "Tax years required" }, { status: 400 })
    }

    console.log(`[v0] Filing taxes for multiple years:`, taxYears)

    const results = []

    // Process each tax year
    for (const taxYear of taxYears) {
      try {
        // Get documents for this tax year
        const { data: documents } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("processing_status", "completed")
          .contains("extracted_data", { tax_year: taxYear })

        if (!documents || documents.length === 0) {
          results.push({
            taxYear,
            success: false,
            error: "No documents found for this year",
          })
          continue
        }

        // Calculate totals for this year
        let totalIncome = 0
        let totalWithheld = 0
        let totalDeductions = 14600 // Standard deduction

        documents.forEach((doc) => {
          const data = doc.extracted_data
          if (data.wages) totalIncome += data.wages
          if (data.income) totalIncome += data.income
          if (data.federal_tax_withheld) totalWithheld += data.federal_tax_withheld
        })

        // Get deductions for this year
        const { data: deductions } = await supabase.from("deductions_credits").select("*").eq("user_id", user.id)

        if (deductions) {
          totalDeductions += deductions.reduce((sum, d) => sum + (d.amount || 0), 0)
        }

        const taxableIncome = Math.max(0, totalIncome - totalDeductions)
        const taxLiability = taxableIncome * 0.22 // Simplified
        const refundOrOwed = totalWithheld - taxLiability

        // Create submission ID
        const submissionId = `TAXU-${taxYear}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // File with TaxBandits (mock for now)
        const taxBanditsResponse = await fetch("https://api.taxbandits.com/v1/filing/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
          },
          body: JSON.stringify({
            tax_year: taxYear,
            taxpayer_id: user.id,
            total_income: totalIncome,
            total_deductions: totalDeductions,
            tax_liability: taxLiability,
            refund_or_owed: refundOrOwed,
          }),
        })

        // Save filing record
        const { data: filing, error: filingError } = await supabase
          .from("tax_filings")
          .insert({
            user_id: user.id,
            tax_year: taxYear,
            filing_status: "submitted",
            total_income: totalIncome,
            total_deductions: totalDeductions,
            tax_liability: taxLiability,
            refund_or_owed: refundOrOwed,
            submission_id: submissionId,
            provider_name: "taxbandits",
            filed_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (filingError) {
          results.push({
            taxYear,
            success: false,
            error: filingError.message,
          })
          continue
        }

        // Send email notification
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single()

        if (profile) {
          await sendFilingAcceptedEmail(
            profile.email,
            profile.full_name || "there",
            taxYear,
            refundOrOwed,
            submissionId,
          )
        }

        results.push({
          taxYear,
          success: true,
          submissionId,
          refundOrOwed,
          filingId: filing.id,
        })
      } catch (error: any) {
        console.error(`[v0] Error filing for year ${taxYear}:`, error)
        results.push({
          taxYear,
          success: false,
          error: error.message,
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const totalRefund = results
      .filter((r) => r.success && r.refundOrOwed > 0)
      .reduce((sum, r) => sum + r.refundOrOwed, 0)

    return NextResponse.json({
      success: successCount > 0,
      results,
      summary: {
        totalYears: taxYears.length,
        successfulFilings: successCount,
        failedFilings: taxYears.length - successCount,
        totalRefund,
      },
    })
  } catch (error: any) {
    console.error("[v0] Multi-year filing error:", error)
    return NextResponse.json({ error: error.message || "Filing failed" }, { status: 500 })
  }
}
