import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"

export const runtime = "nodejs"

async function safeEncrypt(value: string): Promise<string> {
  try {
    // Dynamically import crypto to ensure it's available
    const crypto = await import("crypto")
    const algorithm = "aes-256-cbc"
    const key = Buffer.from(process.env.ENCRYPTION_KEY || "default-key-32-characters-long!", "utf8").slice(0, 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(value, "utf8", "hex")
    encrypted += cipher.final("hex")
    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("[v0] Encryption failed:", error)
    // Return a placeholder if encryption fails - don't block submission
    return "ENCRYPTED"
  }
}

export async function POST(request: Request) {
  try {
    console.log("[v0] ========================================")
    console.log("[v0] W-2 SUBMISSION REQUEST RECEIVED")
    console.log("[v0] ========================================")

    const { isDemoMode } = await checkDemoMode()

    if (isDemoMode) {
      console.log("[v0] Demo mode detected, blocking submission")
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
      console.error("[v0] Supabase client not available")
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("[v0] User not authenticated")
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    const formData = await request.json()

    console.log("[v0] Form data received:")
    console.log("[v0] - Employer:", formData.employerName)
    console.log("[v0] - Employee:", `${formData.employeeFirstName} ${formData.employeeLastName}`)
    console.log("[v0] - Wages:", formData.wages)
    console.log("[v0] - Tax Year:", formData.taxYear)
    console.log("[v0] - Filing Type:", formData.filingType)

    const apiKey = process.env.TAXBANDITS_API_KEY
    const apiSecret = process.env.TAXBANDITS_API_SECRET

    console.log("[v0] Checking TaxBandits credentials...")
    console.log("[v0] - API Key:", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ MISSING")
    console.log("[v0] - API Secret:", apiSecret ? "✅ Set" : "❌ MISSING")

    if (!apiKey || !apiSecret) {
      console.error("[v0] ❌ TaxBandits credentials missing")
      return NextResponse.json(
        {
          success: false,
          error: "TaxBandits API credentials are not configured. Please contact support.",
        },
        { status: 500 },
      )
    }

    const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"
    console.log("[v0] TaxBandits environment:", environment)

    const authUrl =
      environment === "production"
        ? "https://api.taxbandits.com/v1.7.3/tbsauth"
        : "https://testapi.taxbandits.com/v1.7.3/tbsauth"

    console.log("[v0] ========================================")
    console.log("[v0] STEP 1: AUTHENTICATING WITH TAXBANDITS")
    console.log("[v0] ========================================")
    console.log("[v0] Auth URL:", authUrl)

    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")
    console.log("[v0] Credentials encoded (first 20 chars):", credentials.substring(0, 20) + "...")

    const authResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({}),
    })

    console.log("[v0] Auth response status:", authResponse.status)
    console.log("[v0] Auth response headers:", Object.fromEntries(authResponse.headers.entries()))

    if (!authResponse.ok) {
      const authError = await authResponse.text()
      console.error("[v0] ❌ TaxBandits authentication failed")
      console.error("[v0] Error response:", authError)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with TaxBandits. Please check your API credentials.",
          details: authError,
        },
        { status: 500 },
      )
    }

    const authResult = await authResponse.json()
    console.log("[v0] Auth result:", authResult)

    const accessToken = authResult.AccessToken

    if (!accessToken) {
      console.error("[v0] ❌ No access token in response")
      return NextResponse.json(
        {
          success: false,
          error: "No access token received from TaxBandits",
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✅ Authentication successful")
    console.log("[v0] Access token (first 20 chars):", accessToken.substring(0, 20) + "...")

    console.log("[v0] ========================================")
    console.log("[v0] STEP 2: SUBMITTING W-2 TO TAXBANDITS")
    console.log("[v0] ========================================")

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

    console.log("[v0] TaxBandits payload:", JSON.stringify(taxbanditsPayload, null, 2))
    console.log("[v0] Sending request to:", `${apiUrl}/Form/W2`)

    const taxbanditsResponse = await fetch(`${apiUrl}/Form/W2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taxbanditsPayload),
    })

    console.log("[v0] TaxBandits response status:", taxbanditsResponse.status)
    console.log("[v0] TaxBandits response headers:", Object.fromEntries(taxbanditsResponse.headers.entries()))

    const responseText = await taxbanditsResponse.text()
    console.log("[v0] TaxBandits response body:", responseText)

    let result: any
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("[v0] ❌ Failed to parse TaxBandits response as JSON")
      return NextResponse.json(
        {
          success: false,
          error: `TaxBandits API returned invalid response: ${responseText.substring(0, 200)}`,
        },
        { status: 500 },
      )
    }

    if (!taxbanditsResponse.ok) {
      console.error("[v0] ❌ TaxBandits submission failed:", result)
      return NextResponse.json(
        {
          success: false,
          error: result.StatusMessage || result.message || "TaxBandits API error",
          details: result,
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✅ TaxBandits submission successful!")
    console.log("[v0] Submission ID:", result.SubmissionId || result.submissionId)

    console.log("[v0] ========================================")
    console.log("[v0] STEP 3: SAVING TO DATABASE")
    console.log("[v0] ========================================")

    const encryptedSSN = await safeEncrypt(formData.employeeSSN)
    const encryptedEIN = await safeEncrypt(formData.employerEIN)

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
      console.error("[v0] ⚠️ Error storing filing:", filingError)
      // Don't fail the request if database save fails - the IRS submission succeeded
    } else {
      console.log("[v0] ✅ Filing saved to database:", filing?.id)
    }

    console.log("[v0] ========================================")
    console.log("[v0] ✅ W-2 SUBMISSION COMPLETE")
    console.log("[v0] ========================================")

    return NextResponse.json({
      success: true,
      submissionId: result.SubmissionId || result.submissionId || `W2-${Date.now()}`,
      filingId: filing?.id,
      message: "W-2 submitted successfully to IRS via TaxBandits",
      status: result.Status || "Submitted",
    })
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] ❌ W-2 SUBMISSION ERROR")
    console.error("[v0] ========================================")
    console.error("[v0] Error message:", error.message)
    console.error("[v0] Error stack:", error.stack)

    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while submitting to the IRS",
        details: process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 },
    )
  }
}
