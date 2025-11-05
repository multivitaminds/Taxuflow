import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"
import { encrypt } from "@/lib/crypto"

export async function POST(request: Request) {
  try {
    console.log("[v0] W-2 submission request received")

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

    console.log("[v0] Submitting W-2 to TaxBandits:", {
      employer: formData.employerName,
      employee: `${formData.employeeFirstName} ${formData.employeeLastName}`,
      wages: formData.wages,
      taxYear: formData.taxYear,
    })

    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"
    const authUrl =
      environment === "production"
        ? "https://api.taxbandits.com/v1.7.3/tbsauth"
        : "https://testapi.taxbandits.com/v1.7.3/tbsauth"

    console.log("[v0] Authenticating with TaxBandits...")

    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ApiKey: process.env.TAXBANDITS_API_KEY,
        ApiSecret: process.env.TAXBANDITS_API_SECRET,
      }),
    })

    if (!authResponse.ok) {
      const authError = await authResponse.text()
      console.error("[v0] TaxBandits auth failed:", authError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with TaxBandits. Please check your API credentials.",
        },
        { status: 500 },
      )
    }

    const authResult = await authResponse.json()
    const accessToken = authResult.AccessToken

    if (!accessToken) {
      console.error("[v0] No access token in response:", authResult)
      return NextResponse.json(
        {
          success: false,
          error: "No access token received from TaxBandits",
        },
        { status: 500 },
      )
    }

    console.log("[v0] TaxBandits authentication successful, submitting W-2...")

    const apiUrl =
      environment === "production" ? "https://api.taxbandits.com/v1.7.3" : "https://testapi.taxbandits.com/v1.7.3"

    const taxbanditsPayload = {
      ReturnHeader: {
        Business: {
          BusinessNm: formData.employerName,
          EIN: formData.employerEIN,
          BusinessType: "ESTE",
        },
        TaxYr: formData.taxYear,
      },
      FormW2: {
        EmployeeInfo: {
          FirstNm: formData.employeeFirstName,
          MiddleInitial: formData.employeeMiddleInitial || "",
          LastNm: formData.employeeLastName,
          SSN: formData.employeeSSN,
          Address: {
            Address1: formData.employeeAddress,
            City: formData.employeeCity,
            State: formData.employeeState,
            ZipCd: formData.employeeZip,
          },
        },
        WagesAndCompensation: {
          WagesTipsAndOtherComp: Number.parseFloat(formData.wages) || 0,
          FederalIncomeTaxWithheld: Number.parseFloat(formData.federalWithholding) || 0,
          SocialSecurityWages: Number.parseFloat(formData.socialSecurityWages) || 0,
          SocialSecurityTaxWithheld: Number.parseFloat(formData.socialSecurityWithholding) || 0,
          MedicareWagesAndTips: Number.parseFloat(formData.medicareWages) || 0,
          MedicareTaxWithheld: Number.parseFloat(formData.medicareWithholding) || 0,
        },
      },
    }

    console.log("[v0] Sending W-2 to TaxBandits API...")

    const taxbanditsResponse = await fetch(`${apiUrl}/Form/W2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taxbanditsPayload),
    })

    const responseText = await taxbanditsResponse.text()
    console.log("[v0] TaxBandits response status:", taxbanditsResponse.status)
    console.log("[v0] TaxBandits response body:", responseText)

    let result: any
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("[v0] Failed to parse TaxBandits response as JSON:", responseText)
      return NextResponse.json(
        {
          success: false,
          error: `TaxBandits API returned invalid response: ${responseText.substring(0, 200)}`,
        },
        { status: 500 },
      )
    }

    if (!taxbanditsResponse.ok) {
      console.error("[v0] TaxBandits submission failed:", result)
      return NextResponse.json(
        {
          success: false,
          error: result.StatusMessage || result.message || "TaxBandits API error",
          details: result,
        },
        { status: 500 },
      )
    }

    console.log("[v0] TaxBandits submission successful:", result)

    let encryptedSSN: string
    let encryptedEIN: string

    try {
      encryptedSSN = encrypt(formData.employeeSSN)
      encryptedEIN = encrypt(formData.employerEIN)
    } catch (encryptError) {
      console.error("[v0] Encryption error:", encryptError)
      // If encryption fails, store without sensitive data
      encryptedSSN = "ENCRYPTED_ERROR"
      encryptedEIN = "ENCRYPTED_ERROR"
    }

    const sanitizedFormData = {
      ...formData,
      employeeSSN: encryptedSSN,
      employerEIN: encryptedEIN,
    }

    const { data: filing, error: filingError } = await supabase
      .from("tax_filings")
      .insert({
        user_id: user.id,
        form_type: "W-2",
        tax_year: Number.parseInt(formData.taxYear),
        status: "submitted",
        submission_id: result.SubmissionId || result.submissionId || `W2-${Date.now()}`,
        form_data: sanitizedFormData,
        provider: "taxbandits",
      })
      .select()
      .single()

    if (filingError) {
      console.error("[v0] Error storing filing:", filingError)
      // Don't fail the request if database save fails - the IRS submission succeeded
    }

    console.log("[v0] W-2 filing saved to database:", filing?.id)

    return NextResponse.json({
      success: true,
      submissionId: result.SubmissionId || result.submissionId || `W2-${Date.now()}`,
      filingId: filing?.id,
      message: "W-2 submitted successfully to IRS via TaxBandits",
      status: result.Status || "Submitted",
    })
  } catch (error: any) {
    console.error("[v0] W-2 submission error:", error)
    console.error("[v0] Error stack:", error.stack)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
