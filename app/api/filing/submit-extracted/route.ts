import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createHmac } from "crypto"

function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

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

  const encodedHeader = base64ToBase64Url(Buffer.from(JSON.stringify(header)).toString("base64"))
  const encodedPayload = base64ToBase64Url(Buffer.from(JSON.stringify(payload)).toString("base64"))

  const signatureBase64 = createHmac("sha256", clientSecret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")

  const signature = base64ToBase64Url(signatureBase64)

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
    console.log("[v0] POST /api/filing/submit-extracted - Request received")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[v0] Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      )
    }

    const { userId, documents } = body

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      console.error("[v0] Invalid documents array")
      return NextResponse.json(
        {
          success: false,
          error: "No documents provided",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Submitting extracted documents, count:", documents?.length)
    console.log(
      "[v0] Document types:",
      documents?.map((d: any) => d.documentType),
    )

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Authentication failed:", authError)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    let accessToken
    try {
      accessToken = await getTaxBanditsAccessToken()
    } catch (tokenError) {
      console.error("[v0] Failed to get TaxBandits access token:", tokenError)
      return NextResponse.json(
        {
          success: false,
          error: tokenError instanceof Error ? tokenError.message : "Failed to authenticate with TaxBandits",
        },
        { status: 500 },
      )
    }

    const filings = []

    for (const doc of documents) {
      try {
        const { documentType, taxYear, employer, employee, payer, recipient, income, isTemplateData } = doc

        console.log("[v0] Processing document type:", documentType)
        console.log("[v0] Full document data:", JSON.stringify(doc, null, 2))

        if (isTemplateData === true) {
          throw new Error(
            "This document contains template or demonstration data and cannot be filed. Please upload a real tax document with actual taxpayer information.",
          )
        }

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
          console.log("[v0] Processing 1099-NEC form...")
          console.log("[v0] Payer data:", JSON.stringify(payer, null, 2))
          console.log("[v0] Recipient data:", JSON.stringify(recipient, null, 2))
          console.log("[v0] Income data:", JSON.stringify(income, null, 2))

          const recipientFirstName = recipient?.firstName || recipient?.name?.split(" ")[0] || ""
          const recipientLastName = recipient?.lastName || recipient?.name?.split(" ").slice(1).join(" ") || ""

          const recipientTIN =
            recipient?.ssn?.replace(/[^0-9]/g, "") ||
            recipient?.ein?.replace(/[^0-9]/g, "") ||
            recipient?.tin?.replace(/[^0-9]/g, "") ||
            ""

          if (!recipientTIN || recipientTIN.length < 9) {
            throw new Error(
              "Invalid or missing recipient TIN (SSN/EIN). The document may contain masked or template data. Please upload a document with real taxpayer information.",
            )
          }

          const originalTIN = recipient?.ssn || recipient?.ein || recipient?.tin || ""

          if (originalTIN.includes("X") || originalTIN.includes("*")) {
            throw new Error(
              "The recipient TIN appears to be masked (e.g., XXX-XX-1234). Please upload a document with the complete, unmasked TIN for filing.",
            )
          }

          const addressParts = recipient?.address?.split(",") || []
          const recipientStreet = addressParts[0]?.trim() || recipient?.street || ""
          const recipientCity = recipient?.city || addressParts[1]?.trim() || ""
          const recipientState = recipient?.state || ""
          const recipientZip = recipient?.zipCode || recipient?.zip || recipient?.address?.match(/\d{5}/)?.[0] || ""

          const payerAddressParts = payer?.address?.split(",") || []
          const payerStreet = payerAddressParts[0]?.trim() || payer?.street || ""
          const payerCity = payer?.city || payerAddressParts[1]?.trim() || ""
          const payerState = payer?.state || ""
          const payerZip = payer?.zipCode || payer?.zip || payer?.address?.match(/\d{5}/)?.[0] || ""

          console.log("[v0] Parsed recipient name:", { recipientFirstName, recipientLastName })
          console.log("[v0] Parsed recipient TIN:", recipientTIN ? "***" + recipientTIN.slice(-4) : "MISSING")
          console.log("[v0] Parsed recipient address:", {
            recipientStreet,
            recipientCity,
            recipientState,
            recipientZip,
          })

          if (!payer?.name || !payer?.ein) {
            throw new Error("Payer name and EIN are required")
          }

          if (!recipientFirstName || !recipientLastName) {
            throw new Error("Recipient first and last name are required")
          }

          const nonemployeeCompensation = Number.parseFloat(
            income?.nonemployeeCompensation || income?.nonemployee_compensation || income?.compensation || "0",
          )

          const federalTaxWithheld = Number.parseFloat(
            income?.federalTaxWithheld || income?.federal_tax_withheld || income?.federalWithholding || "0",
          )

          console.log("[v0] Parsed amounts:", { nonemployeeCompensation, federalTaxWithheld })

          const payload1099 = {
            SubmissionManifest: {
              TaxYear: taxYear || new Date().getFullYear() - 1,
              IsFederalFiling: true,
              IsStateFiling: true,
            },
            ReturnHeader: {
              Business: {
                BusinessNm: payer.name,
                EIN: payer.ein.replace(/[^0-9]/g, ""),
                BusinessType: "Corporation",
              },
            },
            Form1099NEC: [
              {
                SequenceNum: 1,
                Recipient: {
                  TIN: recipientTIN,
                  FirstNm: recipientFirstName,
                  LastNm: recipientLastName,
                  Address: {
                    AddressLine1: recipientStreet,
                    City: recipientCity,
                    State: recipientState,
                    ZipCode: recipientZip,
                  },
                },
                NonemployeeCompensation: nonemployeeCompensation,
                FederalIncomeTaxWithheld: federalTaxWithheld,
              },
            ],
          }

          console.log("[v0] 1099-NEC payload prepared:", JSON.stringify(payload1099, null, 2))

          const taxbanditsResponse = await fetch("https://testapi.taxbandits.com/v1.7.3/Form/1099NEC", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload1099),
          })

          console.log("[v0] TaxBandits response status:", taxbanditsResponse.status)

          if (!taxbanditsResponse.ok) {
            const errorText = await taxbanditsResponse.text()
            console.error("[v0] TaxBandits 1099-NEC submission failed:", errorText)

            let errorMessage = "Unknown error"
            try {
              const errorJson = JSON.parse(errorText)
              errorMessage = errorJson.StatusMessage || errorJson.Errors?.[0]?.Message || errorText
            } catch {
              errorMessage = errorText
            }

            throw new Error(`TaxBandits 1099-NEC submission failed: ${errorMessage}`)
          }

          const taxbanditsData = await taxbanditsResponse.json()
          console.log("[v0] 1099-NEC submitted successfully:", taxbanditsData.SubmissionId)

          const { data: filing, error: insertError } = await supabase
            .from("nec_1099_filings")
            .insert({
              user_id: user.id,
              submission_id: taxbanditsData.SubmissionId,
              tax_year: taxYear || new Date().getFullYear() - 1,
              filing_type: "original",
              irs_status: "pending",
              taxbandits_status: "Created",
              payer_name: payer.name,
              payer_ein: payer.ein,
              payer_address: payer.address,
              payer_city: payerCity,
              payer_state: payerState,
              payer_zip: payerZip,
              recipient_first_name: recipientFirstName,
              recipient_last_name: recipientLastName,
              recipient_address: recipient.address,
              recipient_city: recipientCity,
              recipient_state: recipientState,
              recipient_zip: recipientZip,
              recipient_email: recipient?.email,
              nonemployee_compensation: nonemployeeCompensation,
              federal_tax_withheld: federalTaxWithheld,
              submitted_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (insertError) {
            console.error("[v0] Failed to save 1099-NEC filing to database:", insertError)
            console.error("[v0] Insert error details:", JSON.stringify(insertError, null, 2))
            throw new Error(`Failed to save filing: ${insertError.message}`)
          }

          console.log("[v0] 1099-NEC filing saved to database:", filing.id)

          filings.push(filing)
        }
      } catch (docError) {
        console.error("[v0] Error processing document:", docError)
        console.error("[v0] Error stack:", docError instanceof Error ? docError.stack : "No stack trace")
        return NextResponse.json(
          {
            success: false,
            error: docError instanceof Error ? docError.message : "Failed to process document",
            details: docError instanceof Error ? docError.stack : undefined,
          },
          { status: 500 },
        )
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
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit filing",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
