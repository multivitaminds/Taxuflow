import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { parseFullAddress } from "@/lib/address-parser"

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName, mimeType, userId } = await request.json()

    console.log("[v0] Extracting data from document:", fileName)
    console.log("[v0] File type:", mimeType)

    if (!fileData) {
      throw new Error("No file data provided")
    }

    const dataUrl = `data:${mimeType};base64,${fileData}`

    const extractionInstructions = `You are an expert tax document analyst with OCR capabilities.

Analyze this tax document image/PDF and extract ALL relevant information.

IMPORTANT: This may be a demo, sample, or test document. Extract the data regardless of whether it says "DEMO", "SAMPLE", or "NOT A VALID TAX DOCUMENT". Your job is to extract the visible data accurately.

Identify the document type:
- "w2" for W-2 Wage and Tax Statement
- "1099-nec" for 1099-NEC (Nonemployee Compensation)
- "1099-misc" for 1099-MISC
- "1099-int" for 1099-INT (Interest Income)
- "1099-div" for 1099-DIV (Dividends)
- "receipt" for expense receipts
- "other" if it doesn't match

Extract ALL visible data from the document:

For W-2:
- employer_name, employer_ein, employer_address
- employee_name, employee_ssn, employee_address
- tax_year
- wages (Box 1), federal_tax_withheld (Box 2)
- social_security_wages (Box 3), social_security_tax_withheld (Box 4)
- medicare_wages (Box 5), medicare_tax_withheld (Box 6)
- state, state_wages, state_tax_withheld

For 1099-NEC:
- payer_name, payer_ein, payer_address
- recipient_name, recipient_tin, recipient_address
- tax_year
- nonemployee_compensation (Box 1)
- federal_tax_withheld (Box 4)
- state, state_tax_withheld

For 1099-MISC:
- payer_name, payer_ein, payer_address
- recipient_name, recipient_tin, recipient_address
- tax_year
- rents (Box 1), royalties (Box 2), other_income (Box 3)
- federal_tax_withheld (Box 4)

For receipts:
- merchant_name, date, amount, category, items

CRITICAL: You MUST respond with ONLY valid JSON. No explanations, no apologies, no text before or after the JSON.

Return this exact JSON structure:
{
  "documentType": "w2",
  "taxYear": 2024,
  "employer": {
    "name": "Company Name",
    "ein": "12-3456789",
    "address": "123 Main St, City, ST 12345"
  },
  "employee": {
    "name": "John Doe",
    "ssn": "XXX-XX-1234",
    "address": "456 Oak Ave, City, ST 12345"
  },
  "income": {
    "wages": 75000.00,
    "federalWithholding": 8500.00,
    "socialSecurityWages": 75000.00,
    "socialSecurityTax": 4650.00,
    "medicareWages": 75000.00,
    "medicareTax": 1087.50,
    "stateWages": 75000.00,
    "stateTax": 3750.00,
    "state": "CA"
  }
}

Rules:
- Extract REAL values from the document, not placeholders
- If you can't read a field clearly, omit it from the JSON
- Be accurate with numbers - these are used for tax filing
- Always include documentType and taxYear
- Return ONLY the JSON object, nothing else
- Do NOT wrap in markdown code blocks
- Do NOT add any explanatory text`

    console.log("[v0] Calling AI model for extraction...")

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: dataUrl,
            },
            {
              type: "text",
              text: extractionInstructions,
            },
          ],
        },
      ],
      maxTokens: 2000,
    })

    console.log("[v0] AI extraction complete, parsing response...")
    console.log("[v0] Raw AI response:", text.substring(0, 200))

    let cleanedText = text.trim()

    // Remove markdown code blocks
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "")
      cleanedText = cleanedText.replace(/\n?```$/, "")
      cleanedText = cleanedText.trim()
    }

    // Remove any leading text before the JSON object
    const jsonStart = cleanedText.indexOf("{")
    if (jsonStart > 0) {
      cleanedText = cleanedText.substring(jsonStart)
    }

    // Remove any trailing text after the JSON object
    const jsonEnd = cleanedText.lastIndexOf("}")
    if (jsonEnd > 0 && jsonEnd < cleanedText.length - 1) {
      cleanedText = cleanedText.substring(0, jsonEnd + 1)
    }

    let extractedData
    try {
      extractedData = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("[v0] Failed to parse AI response as JSON:", cleanedText)
      throw new Error(`AI returned invalid JSON. Response: ${cleanedText.substring(0, 100)}...`)
    }

    if (extractedData.employer && extractedData.employee && extractedData.income) {
      // Check if the data looks like placeholder/template data
      const hasRealData =
        extractedData.employer.name &&
        extractedData.employer.name !== "Company Name" &&
        extractedData.employee.name &&
        extractedData.employee.name !== "John Doe" &&
        extractedData.income.wages > 0

      if (!hasRealData) {
        console.error("[v0] AI returned template/placeholder data instead of extracting real values")
        throw new Error("Could not extract real data from document. Please ensure the document is clear and readable.")
      }
    }

    if (extractedData.employer?.address) {
      const parsed = parseFullAddress(extractedData.employer.address)
      if (parsed) {
        extractedData.employer.street = parsed.street || extractedData.employer.address
        extractedData.employer.city = parsed.city
        extractedData.employer.state = parsed.state
        extractedData.employer.zipCode = parsed.zipCode
      }
    }

    if (extractedData.employee?.address) {
      const parsed = parseFullAddress(extractedData.employee.address)
      if (parsed) {
        extractedData.employee.street = parsed.street || extractedData.employee.address
        extractedData.employee.city = parsed.city
        extractedData.employee.state = parsed.state
        extractedData.employee.zipCode = parsed.zipCode
      }
    }

    // Also handle payer/recipient for 1099 forms
    if (extractedData.payer?.address) {
      const parsed = parseFullAddress(extractedData.payer.address)
      if (parsed) {
        extractedData.payer.street = parsed.street || extractedData.payer.address
        extractedData.payer.city = parsed.city
        extractedData.payer.state = parsed.state
        extractedData.payer.zipCode = parsed.zipCode
      }
    }

    if (extractedData.recipient?.address) {
      const parsed = parseFullAddress(extractedData.recipient.address)
      if (parsed) {
        extractedData.recipient.street = parsed.street || extractedData.recipient.address
        extractedData.recipient.city = parsed.city
        extractedData.recipient.state = parsed.state
        extractedData.recipient.zipCode = parsed.zipCode
      }
    }

    console.log("[v0] Extracted document type:", extractedData.documentType)
    console.log("[v0] Extracted tax year:", extractedData.taxYear)
    console.log("[v0] Extracted employer:", extractedData.employer?.name)
    console.log("[v0] Extracted employee:", extractedData.employee?.name)
    console.log("[v0] Extracted wages:", extractedData.income?.wages)

    return NextResponse.json({
      success: true,
      data: extractedData,
    })
  } catch (error) {
    console.error("[v0] Document extraction error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to extract document data",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
