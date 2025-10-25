import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taxYear, contractors } = body

    const taxbanditsResponse = await fetch("https://testapi.taxbandits.com/v1.7.3/Form1099NEC/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
      },
      body: JSON.stringify({
        SubmissionManifest: {
          TaxYear: taxYear,
          IsFederalFiling: true,
          IsStateFiling: false,
        },
        ReturnHeader: {
          Business: {
            BusinessNm: "Your Business Name",
            EIN: "XX-XXXXXXX",
            BusinessType: "Corporation",
            IsEIN: true,
            Email: "business@example.com",
            ContactNm: "Contact Name",
            Phone: "1234567890",
            USAddress: {
              Address1: "123 Business St",
              City: "San Francisco",
              State: "CA",
              ZipCd: "94102",
            },
          },
        },
        ReturnData: contractors.map((contractor: any) => ({
          SequenceId: Math.random().toString(36).substring(7),
          Recipient: {
            RecipientId: Math.random().toString(36).substring(7),
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
      }),
    })

    const taxbanditsData = await taxbanditsResponse.json()

    if (!taxbanditsData.SubmissionId) {
      throw new Error("Failed to submit to TaxBandits")
    }

    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Database not available")
    }

    const { data: filing, error } = await supabase
      .from("tax_filings")
      .insert({
        user_id: userId,
        tax_year: taxYear,
        filing_status: "single",
        provider_name: "taxbandits",
        submission_id: taxbanditsData.SubmissionId,
        provider_response: taxbanditsData,
        irs_status: "pending",
        filed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

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
