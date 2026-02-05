import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"
import { encrypt } from "@/lib/crypto"

export async function POST(request: Request) {
  try {
    const { isDemoMode } = await checkDemoMode()

    if (isDemoMode) {
      return NextResponse.json(
        {
          success: false,
          error: "Filing is not available in demo mode. Please create a free account to file tax forms.",
          isDemoMode: true,
        },
        { status: 403 },
      )
    }

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

    const encryptedEIN = encrypt(formData.ein)

    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"
    const apiUrl =
      environment === "production" ? "https://api.taxbandits.com/v1.7.3" : "https://testsandbox.taxbandits.com/v1.7.3"

    const taxbanditsResponse = await fetch(`${apiUrl}/Form941/Create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
      },
      body: JSON.stringify({
        ReturnHeader: {
          Business: {
            BusinessNm: formData.businessName,
            EIN: formData.ein, // TaxBandits needs plain text
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
    })

    const result = await taxbanditsResponse.json()

    if (!taxbanditsResponse.ok) {
      throw new Error(result.message || "TaxBandits API error")
    }

    const sanitizedFormData = {
      ...formData,
      ein: encryptedEIN,
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
        form_data: sanitizedFormData,
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
