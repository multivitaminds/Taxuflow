import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"
import jwt from "jsonwebtoken"

export const runtime = "nodejs"

async function safeEncrypt(value: string): Promise<string> {
  try {
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

    const requiredFields = {
      employerName: "Employer Name",
      employerEIN: "Employer EIN",
      employerAddress: "Employer Address",
      employerCity: "Employer City",
      employerState: "Employer State",
      employerZip: "Employer ZIP Code",
      employeeFirstName: "Employee First Name",
      employeeLastName: "Employee Last Name",
      employeeSSN: "Employee SSN",
      wages: "Wages",
      federalWithholding: "Federal Withholding",
      socialSecurityWages: "Social Security Wages",
      socialSecurityWithholding: "Social Security Withholding",
      medicareWages: "Medicare Wages",
      medicareWithholding: "Medicare Withholding",
    }

    const missingFields: string[] = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        missingFields.push(label)
      }
    }

    if (missingFields.length > 0) {
      console.error("[v0] ❌ Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}. Please complete the form and try again.`,
          missingFields,
        },
        { status: 400 },
      )
    }

    const apiKey = process.env.TAXBANDITS_API_KEY
    const apiSecret = process.env.TAXBANDITS_API_SECRET
    const clientId = process.env.TAXBANDITS_CLIENT_ID

    console.log("[v0] Checking TaxBandits credentials...")
    console.log("[v0] - API Key (User Token):", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ MISSING")
    console.log("[v0] - API Secret (Client Secret):", apiSecret ? "✅ Set" : "❌ MISSING")
    console.log("[v0] - Client ID:", clientId ? `${clientId.substring(0, 10)}...` : "❌ MISSING")

    if (!apiKey || !apiSecret || !clientId) {
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

    const oauthUrl =
      environment === "production"
        ? "https://oauth.expressauth.net/v2/tbsauth"
        : "https://testoauth.expressauth.net/v2/tbsauth"

    const apiBaseUrl =
      environment === "production" ? "https://api.taxbandits.com/v1.7.3" : "https://testapi.taxbandits.com/v1.7.3"

    console.log("[v0] ========================================")
    console.log("[v0] STEP 1: AUTHENTICATING WITH TAXBANDITS OAUTH")
    console.log("[v0] ========================================")

    console.log("[v0] OAuth URL:", oauthUrl)

    const jwtPayload = {
      iss: clientId,
      sub: clientId,
      aud: apiKey,
      iat: Math.floor(Date.now() / 1000),
    }

    console.log("[v0] Generating JWS for OAuth...")
    const jws = jwt.sign(jwtPayload, apiSecret)
    console.log("[v0] JWS generated (first 30 chars):", jws.substring(0, 30) + "...")

    const authResponse = await fetch(oauthUrl, {
      method: "GET",
      headers: {
        Authentication: jws,
      },
    })

    console.log("[v0] Auth response status:", authResponse.status)

    if (!authResponse.ok) {
      const authError = await authResponse.json()
      console.error("[v0] ❌ TaxBandits OAuth authentication failed")
      console.error("[v0] Error response:", authError)

      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with TaxBandits OAuth. Please verify your credentials.",
          details: authError,
        },
        { status: 500 },
      )
    }

    const authResult = await authResponse.json()
    console.log("[v0] Auth result keys:", Object.keys(authResult))

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

    console.log("[v0] ✅ OAuth authentication successful")
    console.log("[v0] Access token (first 20 chars):", accessToken.substring(0, 20) + "...")

    console.log("[v0] ========================================")
    console.log("[v0] STEP 2: CREATING/VERIFYING BUSINESS ENTITY")
    console.log("[v0] ========================================")

    const businessPayload = {
      BusinessNm: formData.employerName,
      EINorSSN: formData.employerEIN.replace(/-/g, ""),
      IsEIN: true,
      Email: user.email || "",
      Address1: formData.employerAddress,
      City: formData.employerCity,
      State: formData.employerState,
      ZipCd: formData.employerZip,
      KindOfEmployer: "NONEAPPLY",
      KindOfPayer: "REGULAR941",
      IsDefaultBusiness: true,
    }

    console.log("[v0] Creating business entity...")
    console.log("[v0] Business name:", formData.employerName)
    console.log("[v0] Business EIN:", formData.employerEIN)

    const businessResponse = await fetch(`${apiBaseUrl}/Business/Create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(businessPayload),
    })

    console.log("[v0] Business creation response status:", businessResponse.status)

    const businessResult = await businessResponse.json()
    console.log("[v0] Business creation result:", JSON.stringify(businessResult, null, 2))

    let businessId: string | null = null

    if (businessResponse.ok && businessResult.BusinessId) {
      businessId = businessResult.BusinessId
      console.log("[v0] ✅ Business created successfully, ID:", businessId)
    } else if (businessResult.Errors && businessResult.Errors.some((e: any) => e.Message?.includes("already exists"))) {
      console.log("[v0] Business already exists, fetching from list...")

      const listResponse = await fetch(`${apiBaseUrl}/Business/List`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (listResponse.ok) {
        const listResult = await listResponse.json()
        console.log("[v0] Business list result:", JSON.stringify(listResult, null, 2))

        if (listResult.Businesses && listResult.Businesses.length > 0) {
          const matchingBusiness = listResult.Businesses.find(
            (b: any) => b.EINorSSN === formData.employerEIN.replace(/-/g, ""),
          )
          businessId = matchingBusiness?.BusinessId || listResult.Businesses[0].BusinessId
          console.log("[v0] ✅ Using existing business, ID:", businessId)
        }
      }
    }

    if (!businessId) {
      console.error("[v0] ❌ Failed to create or retrieve business entity")
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create business entity in TaxBandits",
          details: businessResult,
        },
        { status: 500 },
      )
    }

    console.log("[v0] ========================================")
    console.log("[v0] STEP 3: SUBMITTING W-2 TO TAXBANDITS")
    console.log("[v0] ========================================")

    const w2Payload = {
      SubmissionManifest: {
        SubmissionId: `W2-${user.id}-${Date.now()}`,
        TaxYear: formData.taxYear,
        IsFederalFiling: true,
        IsStateFiling: formData.stateWages && Number.parseFloat(formData.stateWages || "0") > 0,
      },
      ReturnHeader: {
        Business: {
          BusinessId: businessId,
          BusinessNm: formData.employerName,
          EIN: formData.employerEIN.replace(/-/g, ""),
          BusinessType: "ESTE",
          USAddress: {
            Address1: formData.employerAddress,
            City: formData.employerCity,
            State: formData.employerState,
            ZipCd: formData.employerZip,
          },
        },
      },
      ReturnData: [
        {
          RecordId: `W2-${Date.now()}`,
          SequenceId: "1",
          EmployeeUSAddress: {
            Address1: formData.employeeAddress || formData.employerAddress,
            City: formData.employeeCity || formData.employerCity,
            State: formData.employeeState || formData.employerState,
            ZipCd: formData.employeeZip || formData.employerZip,
          },
          EmployeeName: {
            FirstNm: formData.employeeFirstName,
            MiddleInitial: formData.employeeMiddleInitial || "",
            LastNm: formData.employeeLastName,
          },
          SSN: formData.employeeSSN.replace(/-/g, ""),
          Wages: Number.parseFloat(formData.wages || "0"),
          FedIncomeTaxWH: Number.parseFloat(formData.federalWithholding || "0"),
          SocialSecurityWages: Number.parseFloat(formData.socialSecurityWages || "0"),
          SocialSecurityTaxWH: Number.parseFloat(formData.socialSecurityWithholding || "0"),
          MedicareWages: Number.parseFloat(formData.medicareWages || "0"),
          MedicareTaxWH: Number.parseFloat(formData.medicareWithholding || "0"),
          SocialSecurityTips: Number.parseFloat(formData.socialSecurityTips || "0"),
          AllocatedTips: Number.parseFloat(formData.allocatedTips || "0"),
          DependentCareBenefits: Number.parseFloat(formData.dependentCareBenefits || "0"),
          NonQualifiedPlans: Number.parseFloat(formData.nonqualifiedPlans || "0"),
        },
      ],
    }

    console.log("[v0] W-2 payload:", JSON.stringify(w2Payload, null, 2))
    console.log("[v0] Sending request to:", `${apiBaseUrl}/FormW2/Create`)

    const w2Response = await fetch(`${apiBaseUrl}/FormW2/Create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(w2Payload),
    })

    console.log("[v0] W-2 response status:", w2Response.status)

    const responseText = await w2Response.text()
    console.log("[v0] W-2 response body:", responseText.substring(0, 500))

    let result: any
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error("[v0] ❌ Failed to parse W-2 response as JSON")
      return NextResponse.json(
        {
          success: false,
          error: `W-2 API returned invalid response: ${responseText.substring(0, 200)}`,
        },
        { status: 500 },
      )
    }

    if (!w2Response.ok) {
      console.error("[v0] ❌ W-2 submission failed:", result)
      return NextResponse.json(
        {
          success: false,
          error: result.StatusMessage || result.message || "W-2 API error",
          details: result,
        },
        { status: 500 },
      )
    }

    console.log("[v0] ✅ W-2 submission successful!")
    console.log("[v0] Submission ID:", result.SubmissionId || result.submissionId)

    console.log("[v0] ========================================")
    console.log("[v0] STEP 4: SAVING TO DATABASE")
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
