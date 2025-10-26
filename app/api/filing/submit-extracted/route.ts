import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, documents } = await request.json()

    console.log("[v0] Submitting extracted documents to TaxBandits...")

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const filings = []

    for (const doc of documents) {
      const { documentType, taxYear, employer, employee, income } = doc

      if (documentType === "w2") {
        const w2Payload = {
          SubmissionManifest: {
            TaxYear: taxYear || new Date().getFullYear() - 1,
            IsFederalFiling: true,
            IsStateFiling: true,
          },
          ReturnHeader: {
            Business: {
              BusinessNm: employer?.name,
              EIN: employer?.ein?.replace(/-/g, ""),
              BusinessType: "Corporation",
            },
          },
          FormW2: [
            {
              SequenceNum: 1,
              Employee: {
                SSN: employee?.ssn?.replace(/-/g, ""),
                FirstNm: employee?.name?.split(" ")[0],
                LastNm: employee?.name?.split(" ").slice(1).join(" "),
                Address: {
                  AddressLine1: employee?.address?.split(",")[0],
                  City: employee?.address?.split(",")[1]?.trim(),
                  State: income?.state || "CA",
                  ZipCode: employee?.address?.match(/\d{5}/)?.[0] || "00000",
                },
              },
              Wages: income?.wages || 0,
              FederalIncomeTaxWithheld: income?.federalWithholding || 0,
              SocialSecurityWages: income?.socialSecurityWages || 0,
              SocialSecurityTaxWithheld: income?.socialSecurityTax || 0,
              MedicareWages: income?.medicareWages || 0,
              MedicareTaxWithheld: income?.medicareTax || 0,
              StateWages: income?.stateWages || 0,
              StateIncomeTax: income?.stateTax || 0,
            },
          ],
        }

        // Submit to TaxBandits API
        const taxbanditsResponse = await fetch("https://testapi.taxbandits.com/v1.7.3/Form/W2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
          },
          body: JSON.stringify(w2Payload),
        })

        const taxbanditsData = await taxbanditsResponse.json()

        const { data: filing } = await supabase
          .from("tax_filings")
          .insert({
            user_id: user.id,
            form_type: "W-2",
            tax_year: taxYear || new Date().getFullYear() - 1,
            filing_status: "single",
            provider_name: "taxbandits",
            submission_id: taxbanditsData.SubmissionId,
            irs_status: "pending",
            filed_at: new Date().toISOString(),
          })
          .select()
          .single()

        filings.push(filing)
      } else if (documentType === "1099-nec") {
        const { payer, recipient, income: income1099 } = doc

        const payload1099 = {
          SubmissionManifest: {
            TaxYear: taxYear || new Date().getFullYear() - 1,
            IsFederalFiling: true,
            IsStateFiling: true,
          },
          ReturnHeader: {
            Business: {
              BusinessNm: payer?.name,
              EIN: payer?.ein?.replace(/-/g, ""),
              BusinessType: "Corporation",
            },
          },
          Form1099NEC: [
            {
              SequenceNum: 1,
              Recipient: {
                TIN: recipient?.tin?.replace(/-/g, ""),
                FirstNm: recipient?.name?.split(" ")[0],
                LastNm: recipient?.name?.split(" ").slice(1).join(" "),
                Address: {
                  AddressLine1: recipient?.address?.split(",")[0],
                  City: recipient?.address?.split(",")[1]?.trim(),
                  State: income1099?.state || "CA",
                  ZipCode: recipient?.address?.match(/\d{5}/)?.[0] || "00000",
                },
              },
              NonemployeeCompensation: income1099?.nonemployee_compensation || 0,
              FederalIncomeTaxWithheld: income1099?.federal_tax_withheld || 0,
            },
          ],
        }

        const taxbanditsResponse = await fetch("https://testapi.taxbandits.com/v1.7.3/Form/1099NEC", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TAXBANDITS_API_KEY}`,
          },
          body: JSON.stringify(payload1099),
        })

        const taxbanditsData = await taxbanditsResponse.json()

        const { data: filing } = await supabase
          .from("tax_filings")
          .insert({
            user_id: user.id,
            form_type: "1099-NEC",
            tax_year: taxYear || new Date().getFullYear() - 1,
            filing_status: "single",
            provider_name: "taxbandits",
            submission_id: taxbanditsData.SubmissionId,
            irs_status: "pending",
            filed_at: new Date().toISOString(),
          })
          .select()
          .single()

        filings.push(filing)
      }
    }

    console.log("[v0] Successfully submitted", filings.length, "filings to TaxBandits")

    return NextResponse.json({
      success: true,
      filings,
      message: `Successfully filed ${filings.length} tax form(s)`,
    })
  } catch (error) {
    console.error("[v0] Extracted filing submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit filing",
      },
      { status: 500 },
    )
  }
}
