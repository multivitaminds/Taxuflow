import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkDemoMode } from "@/lib/demo-mode"
import { encrypt } from "@/lib/crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting 1099-NEC submission")

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

    const body = await request.json()
    const { userId, taxYear, contractors } = body

    console.log("[v0] Received submission for user:", userId, "contractors:", contractors.length)

    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Database not available")
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Failed to fetch user profile:", profileError)
      throw new Error("User profile not found. Please complete your business information in settings.")
    }

    console.log("[v0] User profile loaded:", profile.email)

    const encryptedContractors = contractors.map((contractor: any) => ({
      ...contractor,
      ssn: contractor.ssn ? encrypt(contractor.ssn) : null,
      ein: contractor.ein ? encrypt(contractor.ein) : null,
    }))

    const taxbanditsPayload = {
      SubmissionManifest: {
        TaxYear: taxYear,
        IsFederalFiling: true,
        IsStateFiling: false,
      },
      ReturnHeader: {
        Business: {
          BusinessNm: profile.business_name || `${profile.first_name} ${profile.last_name}`,
          EIN: profile.ein || "XX-XXXXXXX",
          BusinessType: profile.business_type || "Individual",
          IsEIN: !!profile.ein,
          Email: profile.email,
          ContactNm: `${profile.first_name} ${profile.last_name}`,
          Phone: profile.phone || "0000000000",
          USAddress: {
            Address1: profile.address || "123 Main St",
            City: profile.city || "San Francisco",
            State: profile.state || "CA",
            ZipCd: profile.zip_code || "94102",
          },
        },
      },
      ReturnData: contractors.map((contractor: any, index: number) => ({
        SequenceId: `${Date.now()}-${index}`,
        Recipient: {
          RecipientId: `RCP-${Date.now()}-${index}`,
          RecipientNm: `${contractor.firstName} ${contractor.lastName}`,
          IsForeign: false,
          TINType: contractor.ein ? "EIN" : "SSN",
          TIN: contractor.ein || contractor.ssn,
          Email: contractor.email || "",
          USAddress: {
            Address1: contractor.address.street,
            City: contractor.address.city,
            State: contractor.address.state,
            ZipCd: contractor.address.zipCode,
          },
        },
        NECFormData: {
          B1NonemployeeCompensation: contractor.compensation,
        },
      })),
    }

    console.log("[v0] Submitting to TaxBandits API...")

    const taxbanditsResponse = await fetch("https://testapi.taxbandits.com/v1.7.3/Form1099NEC/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
      },
      body: JSON.stringify(taxbanditsPayload),
    })

    console.log("[v0] TaxBandits response status:", taxbanditsResponse.status)

    if (!taxbanditsResponse.ok) {
      const errorText = await taxbanditsResponse.text()
      console.error("[v0] TaxBandits API error:", errorText)
      throw new Error(`TaxBandits API error: ${taxbanditsResponse.status} - ${errorText}`)
    }

    const taxbanditsData = await taxbanditsResponse.json()
    console.log("[v0] TaxBandits response:", JSON.stringify(taxbanditsData, null, 2))

    if (!taxbanditsData.SubmissionId && !taxbanditsData.Errors) {
      console.error("[v0] Invalid TaxBandits response:", taxbanditsData)
      throw new Error("Invalid response from TaxBandits API")
    }

    if (taxbanditsData.Errors && taxbanditsData.Errors.length > 0) {
      const errorMessages = taxbanditsData.Errors.map((e: any) => e.Message || e.Name).join(", ")
      console.error("[v0] TaxBandits validation errors:", errorMessages)
      throw new Error(`TaxBandits validation failed: ${errorMessages}`)
    }

    const { data: filing, error: filingError } = await supabase
      .from("tax_filings")
      .insert({
        user_id: userId,
        tax_year: taxYear,
        filing_status: "single",
        provider_name: "taxbandits",
        submission_id: taxbanditsData.SubmissionId,
        provider_response: taxbanditsData,
        form_data: { contractors: encryptedContractors },
        irs_status: "pending",
        filed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (filingError) {
      console.error("[v0] Database error:", filingError)
      throw new Error(`Failed to save filing: ${filingError.message}`)
    }

    console.log("[v0] Filing saved successfully:", filing.id)

    return NextResponse.json({
      success: true,
      submissionId: taxbanditsData.SubmissionId,
      filingId: filing.id,
    })
  } catch (error) {
    console.error("[v0] 1099-NEC submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit filing",
      },
      { status: 500 },
    )
  }
}
