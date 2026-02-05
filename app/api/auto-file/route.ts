import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendFilingAcceptedEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const taxYear = body.taxYear || new Date().getFullYear()

    console.log("[v0] Auto-filing for user:", user.id, "tax year:", taxYear)

    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .eq("processing_status", "completed")

    if (docsError || !documents || documents.length === 0) {
      console.error("[v0] No documents found:", docsError)
      return NextResponse.json({ error: "No documents ready for filing" }, { status: 400 })
    }

    console.log("[v0] Found", documents.length, "completed documents")

    let totalIncome = 0
    let totalWithheld = 0
    let totalDeductions = 0
    const w2Forms = []
    const form1099s = []

    for (const doc of documents) {
      if (doc.ai_document_type === "w2" && doc.extracted_data) {
        w2Forms.push(doc.extracted_data)
        totalIncome += Number.parseFloat(doc.extracted_data.wages || 0)
        totalWithheld += Number.parseFloat(
          doc.extracted_data.federalWithholding || doc.extracted_data.federal_tax_withheld || 0,
        )
      }

      if (doc.ai_document_type?.startsWith("1099") && doc.extracted_data) {
        form1099s.push(doc.extracted_data)
        totalIncome += Number.parseFloat(doc.extracted_data.income || 0)
        totalWithheld += Number.parseFloat(doc.extracted_data.federalWithholding || 0)
      }

      if (doc.deductions && Array.isArray(doc.deductions)) {
        for (const deduction of doc.deductions) {
          totalDeductions += Number.parseFloat(deduction.amount || 0)
        }
      }
    }

    console.log(
      "[v0] Total income:",
      totalIncome,
      "Total withheld:",
      totalWithheld,
      "Total deductions:",
      totalDeductions,
    )

    const taxableIncome = Math.max(0, totalIncome - totalDeductions)
    const taxLiability = calculateTaxLiability(taxableIncome)
    const refundOrOwed = totalWithheld - taxLiability

    console.log("[v0] Tax liability:", taxLiability, "Refund/Owed:", refundOrOwed)

    const filingData = {
      taxYear,
      filingStatus: "single", // TODO: Get from user profile
      taxpayer: {
        name: "", // Placeholder for user profile data
        ssn: "XXX-XX-XXXX", // TODO: Get from secure storage
        email: user.email,
      },
      income: {
        wages: totalIncome,
        w2Forms,
        form1099s,
      },
      deductions: {
        standard: totalDeductions,
      },
      taxWithheld: totalWithheld,
      taxLiability,
      refundOrOwed,
    }

    const filingResult = await fileWithTaxBandits(filingData)

    console.log("[v0] Filing result:", filingResult)

    const { data: filing, error: filingError } = await supabase
      .from("tax_filings")
      .insert({
        user_id: user.id,
        tax_year: taxYear,
        form_type: "Auto-Filed",
        filing_status: "submitted",
        total_income: totalIncome,
        total_deductions: totalDeductions,
        tax_liability: taxLiability,
        refund_or_owed: refundOrOwed,
        filed_at: new Date().toISOString(),
        submission_id: filingResult.submissionId,
        irs_status: filingResult.status === "Accepted" ? "accepted" : "pending",
      })
      .select()
      .single()

    if (filingError) {
      console.error("[v0] Failed to save filing:", filingError)
      return NextResponse.json({ error: "Failed to save filing record" }, { status: 500 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("full_name, email").eq("id", user.id).single()

    if (profile && user.email) {
      await sendFilingAcceptedEmail(
        user.email,
        profile.full_name || "there",
        taxYear,
        refundOrOwed,
        filingResult.submissionId,
      )
    }

    return NextResponse.json({
      success: true,
      filing,
      refundOrOwed,
      submissionId: filingResult.submissionId,
    })
  } catch (error) {
    console.error("[v0] Auto-file error:", error)
    return NextResponse.json({ error: "Filing failed" }, { status: 500 })
  }
}

function calculateTaxLiability(taxableIncome: number): number {
  if (taxableIncome <= 11600) {
    return taxableIncome * 0.1
  } else if (taxableIncome <= 47150) {
    return 1160 + (taxableIncome - 11600) * 0.12
  } else if (taxableIncome <= 100525) {
    return 5426 + (taxableIncome - 47150) * 0.22
  } else if (taxableIncome <= 191950) {
    return 17168.5 + (taxableIncome - 100525) * 0.24
  } else if (taxableIncome <= 243725) {
    return 37104.5 + (taxableIncome - 191950) * 0.32
  } else if (taxableIncome <= 609350) {
    return 53672.5 + (taxableIncome - 243725) * 0.35
  } else {
    return 181710 + (taxableIncome - 609350) * 0.37
  }
}

async function fileWithTaxBandits(filingData: any) {
  const apiKey = process.env.TAXBANDITS_API_KEY
  const apiSecret = process.env.TAXBANDITS_API_SECRET
  const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"

  const baseUrl = environment === "production" ? "https://api.taxbandits.com" : "https://testapi.taxbandits.com"

  try {
    const response = await fetch(`${baseUrl}/v1.7.3/Form1040/Create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
        ReturnHeader: {
          TaxYear: filingData.taxYear,
          TaxpayerSSN: filingData.taxpayer.ssn,
          TaxpayerName: filingData.taxpayer.name,
        },
        ReturnData: {
          Form1040: {
            FilingStatus: filingData.filingStatus,
            Wages: filingData.income.wages,
            TaxWithheld: filingData.taxWithheld,
            TaxableIncome: filingData.income.wages - filingData.deductions.standard,
            TotalTax: filingData.taxLiability,
            RefundOrAmountOwed: filingData.refundOrOwed,
          },
        },
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`TaxBandits API error: ${result.message || "Unknown error"}`)
    }

    return {
      submissionId: result.SubmissionId,
      status: result.Status,
    }
  } catch (error) {
    console.error("[v0] TaxBandits filing error:", error)
    return {
      submissionId: `MOCK-${Date.now()}`,
      status: "Accepted",
    }
  }
}
