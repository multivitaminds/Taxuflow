import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
    }

    const formData = await request.json()

    console.log("[v0] Submitting Form 941 to TaxBandits:", formData)

    const taxbanditsResponse = await fetch(
      `${process.env.TAXBANDITS_API_URL || "https://testtaxapi.com/v2"}/Form941/Create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
        },
        body: JSON.stringify({
          ReturnHeader: {
            Business: {
              BusinessNm: formData.businessName,
              EIN: formData.ein,
              BusinessType: "ESTE",
            },
            TaxYr: formData.taxYear,
            Quarter: `Q${formData.quarter}`,
          },
          Form941: {
            NumberOfEmployees: Number.parseInt(formData.numberOfEmployees),
            WagesTipsAndOtherComp: Number.parseFloat(formData.wagesAndTips),
            FederalIncomeTaxWithheld: Number.parseFloat(formData.federalIncomeTax),
            TaxableSocialSecurityWages: Number.parseFloat(formData.taxableSSWages),
            TaxableMedicareWagesAndTips: Number.parseFloat(formData.taxableMedicareWages),
          },
        }),
      },
    )

    const result = await taxbanditsResponse.json()

    if (!taxbanditsResponse.ok) {
      throw new Error(result.message || "TaxBandits API error")
    }

    const { data: filing, error: filingError } = await supabase
      .from("tax_filings")
      .insert({
        user_id: user.id,
        form_type: "941",
        tax_year: Number.parseInt(formData.taxYear),
        quarter: Number.parseInt(formData.quarter),
        status: "submitted",
        submission_id: result.SubmissionId,
        form_data: formData,
        provider: "taxbandits",
      })
      .select()
      .single()

    if (filingError) {
      console.error("[v0] Error storing filing:", filingError)
    }

    return NextResponse.json({
      success: true,
      submissionId: result.SubmissionId,
      filingId: filing?.id,
      message: "Form 941 submitted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Form 941 submission error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
