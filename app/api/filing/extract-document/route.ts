import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName, mimeType, userId } = await request.json()

    console.log("[v0] Extracting data from document:", fileName)

    if (!fileData) {
      throw new Error("No file data provided")
    }

    // Convert base64 to Uint8Array
    const uint8Array = Uint8Array.from(Buffer.from(fileData, "base64"))

    const prompt = `You are an expert tax document analyst with OCR capabilities.

Analyze this tax document image/PDF and extract ALL relevant information.

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

Return ONLY valid JSON with this structure:
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

IMPORTANT:
- Extract REAL values from the document, not placeholders
- If you can't read a field clearly, omit it
- Be accurate with numbers - these are used for tax filing
- Always include taxYear

Return ONLY valid JSON, no markdown.`

    console.log("[v0] Calling AI model for extraction...")

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "file",
              data: uint8Array,
              mimeType: mimeType || "application/pdf",
            },
          ],
        },
      ],
      maxTokens: 2000,
    })

    console.log("[v0] AI extraction complete, parsing response...")

    // Clean up the response
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "")
      cleanedText = cleanedText.replace(/\n?```$/, "")
      cleanedText = cleanedText.trim()
    }

    const extractedData = JSON.parse(cleanedText)

    console.log("[v0] Extracted document type:", extractedData.documentType)
    console.log("[v0] Extracted tax year:", extractedData.taxYear)

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
      },
      { status: 500 },
    )
  }
}
