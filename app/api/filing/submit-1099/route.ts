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
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Failed to fetch user profile:", profileError)
      throw new Error("User profile not found. Please complete your business information in settings.")
    }

    console.log("[v0] User profile loaded:", profile.email)

    const filings = []

    for (const contractor of contractors) {
      const submissionId = `1099NEC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      const { data: filing, error: filingError } = await supabase
        .from("nec_1099_filings")
        .insert({
          user_id: userId,
          tax_year: taxYear,
          submission_id: submissionId,

          // Payer information
          payer_name: profile.full_name || "Business Name",
          payer_ein: "XX-XXXXXXX", // TODO: Get from profile
          payer_address: "",
          payer_city: "",
          payer_state: "",
          payer_zip: "",

          // Recipient information
          recipient_first_name: contractor.firstName,
          recipient_middle_initial: contractor.middleInitial || null,
          recipient_last_name: contractor.lastName,
          recipient_ssn_encrypted: contractor.ssn ? encrypt(contractor.ssn) : null,
          recipient_ein_encrypted: contractor.ein ? encrypt(contractor.ein) : null,
          recipient_address: contractor.address.street,
          recipient_city: contractor.address.city,
          recipient_state: contractor.address.state,
          recipient_zip: contractor.address.zipCode,
          recipient_email: contractor.email || null,

          // Form data
          nonemployee_compensation: contractor.compensation,
          federal_tax_withheld: 0,

          // Status
          irs_status: "pending",
          taxbandits_status: "Pending",
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (filingError) {
        console.error("[v0] Database error saving 1099-NEC:", filingError)
        throw new Error(`Failed to save filing: ${filingError.message}`)
      }

      console.log("[v0] 1099-NEC filing saved:", filing.id, "Submission ID:", submissionId)
      filings.push(filing)
    }

    // TODO: In production, integrate with TaxBandits API
    console.log("[v0] 1099-NEC filings saved successfully. TaxBandits submission pending.")

    return NextResponse.json({
      success: true,
      submissionIds: filings.map((f) => f.submission_id),
      filingIds: filings.map((f) => f.id),
      message: `Successfully filed ${filings.length} 1099-NEC form(s). E-filing will be processed in production.`,
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
