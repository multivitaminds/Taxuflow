import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function getTaxBanditsAccessToken(): Promise<string> {
  console.log("[v0] Server env check:", {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  const clientId = process.env.TAXBANDITS_CLIENT_ID
  const clientSecret = process.env.TAXBANDITS_API_SECRET

  if (!clientId || !clientSecret) {
    console.log("[v0] TaxBandits credentials not configured, using demo mode")
    throw new Error(
      "TaxBandits credentials not configured. Please add TAXBANDITS_CLIENT_ID and TAXBANDITS_API_SECRET environment variables.",
    )
  }

  const environment = process.env.TAXBANDITS_ENVIRONMENT || "sandbox"

  const oauthUrl =
    environment === "production"
      ? "https://oauth.expressauth.net/v2/tbsauth"
      : "https://testoauth.expressauth.net/v2/tbsauth"

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientId,
    sub: clientId,
    aud: "TaxBanditsAPI",
    iat: now,
    exp: now + 300, // 5 minutes expiration
  }

  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url")
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")

  // Create signature
  const crypto = await import("crypto")
  const signature = crypto
    .createHmac("sha256", clientSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url")

  const jws = `${encodedHeader}.${encodedPayload}.${signature}`

  console.log("[v0] Requesting TaxBandits access token...")

  const response = await fetch(oauthUrl, {
    method: "GET",
    headers: {
      Authentication: jws,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("[v0] TaxBandits authentication failed:", error)
    throw new Error(`Failed to authenticate with TaxBandits: ${error.StatusMessage || "Unknown error"}`)
  }

  const result = await response.json()
  console.log("[v0] TaxBandits authentication successful")
  return result.AccessToken
}

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

    const accessToken = await getTaxBanditsAccessToken()

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

        const taxbanditsResponse = await fetch("https://testapi.taxbandits.com/v1.7.3/Form/W2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(w2Payload),
        })

        if (!taxbanditsResponse.ok) {
          const error = await taxbanditsResponse.json()
          console.error("[v0] TaxBandits W-2 submission failed:", error)
          throw new Error(
            `TaxBandits W-2 submission failed: ${error.StatusMessage || error.Errors?.[0]?.Message || "Unknown error"}`,
          )
        }

        const taxbanditsData = await taxbanditsResponse.json()
        console.log("[v0] W-2 submitted successfully:", taxbanditsData.SubmissionId)

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
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload1099),
        })

        if (!taxbanditsResponse.ok) {
          const error = await taxbanditsResponse.json()
          console.error("[v0] TaxBandits 1099-NEC submission failed:", error)
          throw new Error(
            `TaxBandits 1099-NEC submission failed: ${error.StatusMessage || error.Errors?.[0]?.Message || "Unknown error"}`,
          )
        }

        const taxbanditsData = await taxbanditsResponse.json()
        console.log("[v0] 1099-NEC submitted successfully:", taxbanditsData.SubmissionId)

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
