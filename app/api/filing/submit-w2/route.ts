import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  console.log("[v0] ========================================")
  console.log("[v0] W-2 SUBMISSION REQUEST RECEIVED")
  console.log("[v0] ========================================")

  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (error) {
      console.error("[v0] Failed to create Supabase client:", error)
      return NextResponse.json({ success: false, error: "Authentication service unavailable" }, { status: 500 })
    }

    if (!supabase) {
      console.log("[v0] No Supabase client available - missing env vars")
      return NextResponse.json(
        { success: false, error: "Authentication not configured. Please check environment variables." },
        { status: 503 },
      )
    }

    let user
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        console.error("[v0] Auth error:", authError)
        return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
      }

      user = authUser
    } catch (error) {
      console.error("[v0] Exception during auth check:", error)
      return NextResponse.json({ success: false, error: "Authentication check failed" }, { status: 500 })
    }

    console.log("[v0] User authenticated:", user.id)

    let formData: any
    try {
      formData = await request.json()
    } catch (error) {
      console.error("[v0] Failed to parse request body:", error)
      return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 })
    }

    console.log("[v0] Form data received:")
    console.log("[v0] - Employer:", formData.employerName)
    console.log("[v0] - Employee:", `${formData.employeeFirstName} ${formData.employeeLastName}`)
    console.log("[v0] - Wages:", formData.wages)
    console.log("[v0] - Tax Year:", formData.taxYear)

    const requiredFields = {
      employerName: "Employer Name",
      employerEIN: "Employer EIN",
      employeeFirstName: "Employee First Name",
      employeeLastName: "Employee Last Name",
      employeeSSN: "Employee SSN",
      wages: "Wages",
      federalWithholding: "Federal Withholding",
    }

    const missingFields: string[] = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        missingFields.push(label)
      }
    }

    if (missingFields.length > 0) {
      console.error("[v0] Missing required fields:", missingFields)
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 },
      )
    }

    const hasTaxBanditsConfig = !!(
      process.env.TAXBANDITS_API_KEY &&
      process.env.TAXBANDITS_API_SECRET &&
      process.env.TAXBANDITS_CLIENT_ID
    )

    console.log("[v0] TaxBandits configured:", hasTaxBanditsConfig)

    const submissionId = `W2-${Date.now()}`

    try {
      const { data: filing, error: dbError } = await supabase
        .from("w2_filings")
        .insert({
          user_id: user.id,
          submission_id: submissionId,
          filing_type: formData.filingType || "original",
          tax_year: Number.parseInt(formData.taxYear) || new Date().getFullYear(),
          employer_name: formData.employerName,
          employer_ein: formData.employerEIN,
          employer_address: formData.employerAddress || "",
          employer_city: formData.employerCity || "",
          employer_state: formData.employerState || "",
          employer_zip: formData.employerZip || "",
          employee_first_name: formData.employeeFirstName,
          employee_last_name: formData.employeeLastName,
          employee_ssn_encrypted: "ENCRYPTED",
          wages: Number.parseFloat(formData.wages) || 0,
          federal_tax_withheld: Number.parseFloat(formData.federalWithholding) || 0,
          social_security_wages: Number.parseFloat(formData.socialSecurityWages) || 0,
          social_security_tax: Number.parseFloat(formData.socialSecurityWithholding) || 0,
          medicare_wages: Number.parseFloat(formData.medicareWages) || 0,
          medicare_tax: Number.parseFloat(formData.medicareWithholding) || 0,
          taxbandits_status: hasTaxBanditsConfig ? "pending" : "demo_mode",
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (dbError) {
        console.error("[v0] Database error:", dbError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to save W-2 form to database",
          },
          { status: 500 },
        )
      }

      console.log("[v0] W-2 saved to database:", filing?.id)
    } catch (dbError) {
      console.error("[v0] Exception saving to database:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save W-2 form",
        },
        { status: 500 },
      )
    }

    if (!hasTaxBanditsConfig) {
      console.log("[v0] ✅ W-2 saved successfully (Demo Mode)")
      return NextResponse.json({
        success: true,
        submissionId,
        message: "W-2 form saved successfully",
        status: "Saved (Demo Mode)",
        isDemoMode: true,
      })
    }

    console.log("[v0] ✅ W-2 saved, TaxBandits submission pending")
    return NextResponse.json({
      success: true,
      submissionId,
      message: "W-2 form saved successfully. E-filing will be processed in production.",
      status: "Pending E-filing",
    })
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] CRITICAL ERROR IN W-2 SUBMISSION")
    console.error("[v0] ========================================")
    console.error("[v0] Error:", error)
    console.error("[v0] Stack:", error?.stack)

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during submission",
        details: error?.message,
      },
      { status: 500 },
    )
  }
}
