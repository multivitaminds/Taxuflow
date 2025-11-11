import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { parseFullAddress } from "@/lib/address-parser"

function createDemoExtraction(fileName: string): any {
  const isW2 = fileName.toLowerCase().includes("w2") || fileName.toLowerCase().includes("w-2")
  const is1099 = fileName.toLowerCase().includes("1099")

  if (isW2) {
    return {
      documentType: "w2",
      taxYear: 2024,
      isTemplateData: true,
      confidence: 0.85,
      employer: {
        name: "Demo Company Inc",
        ein: "12-3456789",
        address: "123 Business Park Dr, San Francisco, CA 94105",
        street: "123 Business Park Dr",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
      },
      employee: {
        name: "John Doe",
        ssn: "XXX-XX-1234",
        address: "456 Oak Avenue, San Francisco, CA 94102",
        street: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
      },
      income: {
        wages: 75000.0,
        federalWithholding: 8500.0,
        socialSecurityWages: 75000.0,
        socialSecurityTax: 4650.0,
        medicareWages: 75000.0,
        medicareTax: 1087.5,
        stateWages: 75000.0,
        stateTax: 3750.0,
        state: "CA",
      },
    }
  } else if (is1099) {
    return {
      documentType: "1099-nec",
      taxYear: 2024,
      isTemplateData: true,
      confidence: 0.85,
      payer: {
        name: "Demo Client LLC",
        ein: "98-7654321",
        address: "789 Market Street, San Francisco, CA 94103",
        street: "789 Market Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
      },
      recipient: {
        name: "Jane Smith",
        tin: "XXX-XX-5678",
        address: "321 Pine Street, San Francisco, CA 94108",
        street: "321 Pine Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94108",
      },
      income: {
        nonemployeeCompensation: 45000.0,
        federalWithholding: 0.0,
        stateTax: 0.0,
        state: "CA",
      },
    }
  }

  // Default receipt
  return {
    documentType: "receipt",
    taxYear: 2024,
    isTemplateData: true,
    confidence: 0.8,
    merchant: {
      name: "Demo Office Supplies",
      address: "555 Supply Way, San Francisco, CA 94104",
    },
    transaction: {
      date: new Date().toISOString().split("T")[0],
      amount: 156.78,
      category: "Office Supplies",
      items: ["Paper", "Pens", "Folders"],
    },
  }
}

async function extractWithRetry(dataUrl: string, extractionInstructions: string, maxRetries = 2) {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[v0] Extraction attempt ${attempt + 1}/${maxRetries + 1}`)

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
        abortSignal: AbortSignal.timeout(30000), // 30 second timeout
      })

      return text
    } catch (error) {
      lastError = error as Error
      console.error(`[v0] Extraction attempt ${attempt + 1} failed:`, error)

      const errorMessage = error instanceof Error ? error.message : String(error)
      const isRetryable =
        errorMessage.includes("Gateway") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("network") ||
        errorMessage.includes("fetch failed")

      if (!isRetryable || attempt === maxRetries) {
        throw error
      }

      const waitTime = Math.min(1000 * Math.pow(2, attempt), 5000)
      console.log(`[v0] Waiting ${waitTime}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError || new Error("Extraction failed after retries")
}

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName, mimeType, userId } = await request.json()

    console.log("[v0] Extracting data from document:", fileName)
    console.log("[v0] File type:", mimeType)

    if (!fileData) {
      throw new Error("No file data provided")
    }

    const fileSizeBytes = (fileData.length * 3) / 4 // Approximate base64 to bytes
    const fileSizeMB = fileSizeBytes / (1024 * 1024)
    console.log(`[v0] File size: ${fileSizeMB.toFixed(2)} MB`)

    if (fileSizeMB > 10) {
      throw new Error("File too large. Maximum size is 10MB. Please compress or split the document.")
    }

    const dataUrl = `data:${mimeType};base64,${fileData}`

    const extractionInstructions = `You are an expert tax document analyst with OCR capabilities.

Analyze this tax document image/PDF and extract ALL relevant information.

CRITICAL INSTRUCTIONS:
1. If the document contains PLACEHOLDER/TEMPLATE data (like "John Doe", "Test Company", "123-45-6789", "Sample Corp", etc.), you MUST set "isTemplateData": true in your response
2. If the document appears to be a real tax document with actual taxpayer information, set "isTemplateData": false
3. Extract the actual values you see, but flag if they appear to be examples/templates

Identify the document type:
- "w2" for W-2 Wage and Tax Statement
- "1099-nec" for 1099-NEC (Nonemployee Compensation)
- "1099-misc" for 1099-MISC (Miscellaneous Income)
- "1099-int" for 1099-INT (Interest Income)
- "1099-div" for 1099-DIV (Dividends and Distributions)
- "1099-g" for 1099-G (Government Payments/Unemployment Compensation)
- "1099-r" for 1099-R (Retirement Distributions)
- "1099-k" for 1099-K (Payment Card and Third Party Network Transactions)
- "receipt" for expense receipts
- "other" if it doesn't match any of the above

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

For 1099-G (Government Payments):
- payer_name, payer_ein, payer_address (often a state agency like "Department of Labor")
- recipient_name, recipient_tin, recipient_address
- tax_year
- unemployment_compensation (Box 1)
- state_local_income_tax_refunds (Box 2)
- federal_tax_withheld (Box 4)
- state, state_tax_withheld

For receipts:
- merchant_name, date, amount, category, items

CRITICAL: You MUST respond with ONLY valid JSON. No explanations, no apologies, no text before or after the JSON.

Return this exact JSON structure:
{
  "documentType": "w2",
  "taxYear": 2024,
  "isTemplateData": false,
  "confidence": 0.95,
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
- Set "isTemplateData": true if the document contains placeholder/sample values like "John Doe", "Jane Smith", "Test Company", "Sample Corp", "123-45-6789", "00-0000000", etc.
- Set "confidence" between 0 and 1 based on how confident you are in the extraction quality
- Extract REAL values from the document exactly as they appear
- If you can't read a field clearly, omit it from the JSON
- Be accurate with numbers - these are used for tax filing
- Always include documentType, taxYear, isTemplateData, and confidence
- Return ONLY the JSON object, nothing else
- Do NOT wrap in markdown code blocks
- Do NOT add any explanatory text`

    console.log("[v0] Calling AI model for extraction...")

    let extractedData: any

    try {
      const text = await extractWithRetry(dataUrl, extractionInstructions)

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

      try {
        extractedData = JSON.parse(cleanedText)
      } catch (parseError) {
        console.error("[v0] Failed to parse AI response as JSON:", cleanedText)
        throw new Error(`AI returned invalid JSON. Response: ${cleanedText.substring(0, 100)}...`)
      }
    } catch (aiError) {
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError)

      if (
        errorMessage.includes("Gateway") ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("network")
      ) {
        console.log("[v0] AI service unavailable, using demo extraction mode")

        extractedData = createDemoExtraction(fileName)

        // Return demo data with a clear warning
        return NextResponse.json({
          success: true,
          data: extractedData,
          warning: "demo_mode",
          message:
            "AI extraction service is temporarily unavailable. Demo data has been provided as a starting point. Please verify and update all information before filing.",
        })
      }

      // Re-throw if it's not a network issue
      throw aiError
    }

    // Validate that we have the minimum required data for the document type
    if (extractedData.documentType === "w2") {
      const hasRequiredW2Data =
        extractedData.employer?.name &&
        extractedData.employer?.ein &&
        extractedData.employee?.name &&
        extractedData.employee?.ssn &&
        extractedData.income?.wages !== undefined

      if (!hasRequiredW2Data) {
        console.error("[v0] W-2 extraction missing required fields")
        throw new Error(
          "Could not extract all required W-2 data. Please ensure the document is clear and all fields are visible.",
        )
      }
    } else if (extractedData.documentType === "1099-nec" || extractedData.documentType === "1099-misc") {
      const hasRequired1099Data =
        extractedData.payer?.name &&
        extractedData.payer?.ein &&
        extractedData.recipient?.name &&
        extractedData.recipient?.tin

      if (!hasRequired1099Data) {
        console.error("[v0] 1099 extraction missing required fields")
        throw new Error(
          "Could not extract all required 1099 data. Please ensure the document is clear and all fields are visible.",
        )
      }
    } else if (
      extractedData.documentType === "1099-g" ||
      extractedData.documentType === "1099-int" ||
      extractedData.documentType === "1099-div" ||
      extractedData.documentType === "1099-r" ||
      extractedData.documentType === "1099-k"
    ) {
      const hasRequired1099Data = extractedData.payer?.name && extractedData.recipient?.name

      if (!hasRequired1099Data) {
        console.error("[v0] 1099 extraction missing required fields")
        throw new Error(
          "Could not extract all required 1099 data. Please ensure the document is clear and all fields are visible.",
        )
      }
    }

    // Parse addresses for better structure
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

    // Check if AI flagged this as template data
    if (extractedData.isTemplateData === true) {
      console.log("[v0] AI detected template/placeholder data in document")
      return NextResponse.json({
        success: true,
        data: extractedData,
        warning: "template_data_detected",
        message:
          "This appears to be a sample/demo document. The extracted data can be used as a starting point, but please verify and update with your actual information.",
      })
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

    let userMessage = "Failed to extract document data"
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes("Gateway") || errorMessage.includes("timeout") || errorMessage.includes("fetch failed")) {
      userMessage =
        "The AI service is temporarily unavailable. Please try again in a moment or contact support if the issue persists."
    } else if (errorMessage.includes("File too large")) {
      userMessage = errorMessage
    } else if (errorMessage.includes("invalid JSON")) {
      userMessage =
        "Could not understand the document format. Please ensure it's a valid tax document (W-2, 1099, etc.)"
    } else if (errorMessage.includes("placeholder data")) {
      userMessage = "Could not extract real data from the document. Please ensure the image is clear and readable."
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
        technicalDetails: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
