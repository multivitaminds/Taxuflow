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

    console.log("[v0] Submitting W-2 to TaxBandits:", formData)

    const taxbanditsResponse = await fetch(
      `${process.env.TAXBANDITS_API_URL || "https://testtaxapi.com/v2"}/FormW2/Create`,
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
          },
          FormW2: {
            EmployeeInfo: {
              FirstNm: formData.employeeFirstName,
              LastNm: formData.employeeLastName,
              SSN: formData.employeeSSN,
            },
            WagesAndCompensation: {
              WagesTipsAndOtherComp: Number.parseFloat(formData.wages),
              FederalIncomeTaxWithheld: Number.parseFloat(formData.federalWithholding),
              SocialSecurityWages: Number.parseFloat(formData.socialSecurityWages),
              SocialSecurityTaxWithheld: Number.parseFloat(formData.socialSecurityWithholding),
              MedicareWagesAndTips: Number.parseFloat(formData.medicareWages),
              MedicareTaxWithheld: Number.parseFloat(formData.medicareWithholding),
            },
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
        form_type: "W-2",
        tax_year: Number.parseInt(formData.taxYear),
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
      message: "W-2 submitted successfully",
    })
  } catch (error: any) {
    console.error("[v0] W-2 submission error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
