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
        ssn: "XXX-XX-5678",
        ein: "",
        address: "321 Pine Street, San Francisco, CA 94108",
        street: "321 Pine Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94108",
      },
      compensation: 45000.0,
      federalTaxWithheld: 0.0,
      stateTaxWithheld: 0.0,
      state: "CA",
      stateIncome: 45000.0,
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

async function extractWithRetry(dataUrl: string, extractionInstructions: string, maxRetries = 1) {
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
        abortSignal: AbortSignal.timeout(10000),
      })

      console.log("[v0] AI extraction successful")
      return text
    } catch (error) {
      lastError = error as Error
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      console.error(`[v0] Extraction attempt ${attempt + 1} failed:`, errorMessage)

      const isNetworkError =
        errorMessage.includes("Gateway") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("ECONNRESET") ||
        errorMessage.includes("network") ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("ENOTFOUND") ||
        errorMessage.includes("ETIMEDOUT")

      if (isNetworkError) {
        console.log("[v0] Network/Gateway error detected, will use demo mode fallback")
        throw error
      }

      if (attempt === maxRetries) {
        throw error
      }

      const waitTime = Math.min(500 * Math.pow(2, attempt), 2000)
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

    const fileSizeBytes = (fileData.length * 3) / 4
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
4. IMPORTANT: Distinguish between SSN (Social Security Number) and EIN (Employer Identification Number):
   - SSN: Individual taxpayer ID (employee/contractor) - format XXX-XX-XXXX
   - EIN: Business/employer ID - format XX-XXXXXXX
   - For 1099-NEC: recipient uses SSN (individual) or EIN (if recipient is a business)
   - Look for labels like "Social Security Number" vs "Employer ID Number" or "Tax ID"
5. For addresses: Include apartment numbers, unit numbers, suite numbers as part of the street address. DO NOT drop them.

CRITICAL ADDRESS EXTRACTION RULES:
- ALWAYS preserve complete addresses including apartment/unit/suite numbers
- Example: "480 Cedar Lane, Apt 2B, Springfield, IL 62704" should extract:
  * street: "480 Cedar Lane, Apt 2B"
  * city: "Springfield" (extract the ACTUAL city from the document)
  * state: "IL"
  * zipCode: "62704"
- DO NOT invent city names - extract exactly what's written in the document
- DO NOT use generic cities like "San Francisco" unless that's what the document actually says
- Parse carefully: Street Address | City | State | ZIP

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
- employer_name, employer_ein, employer_address (FULL address including apt/suite)
- employee_name, employee_ssn, employee_address (FULL address including apt/suite)
- IMPORTANT: Parse addresses to extract city EXACTLY as shown in document
- tax_year
- wages (Box 1), federal_tax_withheld (Box 2)
- social_security_wages (Box 3), social_security_tax_withheld (Box 4)
- medicare_wages (Box 5), medicare_tax_withheld (Box 6)
- state, state_wages, state_tax_withheld

For 1099-NEC:
- payer_name, payer_ein, payer_address
- recipient_name, recipient_tin, recipient_address  
- tax_year
- compensation (Box 1) - REQUIRED, this is the nonemployee compensation amount
- federal_tax_withheld (Box 4)
- state_tax_withheld (Box 5)
- state_payers_state_no (Box 6)
- state_income (Box 7)

CRITICAL EXTRACTION RULES:
- For recipient/contractor on 1099-NEC: Extract as "ssn" if it's an individual SSN, extract as "ein" if it's a business EIN
- Look at the box labels carefully: "TIN" or "SSN" typically means Social Security Number
- "EIN" or "Employer ID" means Employer Identification Number
- If you see a 9-digit number without clear labeling, assume SSN for individuals, EIN for businesses
- Never mask/hide the actual numbers - extract them exactly as shown
- If numbers are already masked (XX-XXXXXXX), note this in confidence score
- EXTRACT THE ACTUAL CITY NAME from the document - do not substitute or guess

Rules:
- Set "isTemplateData": true if the document contains placeholder/sample values
- Set "confidence" between 0 and 1 based on extraction quality
- Extract REAL values exactly as they appear
- If you can't read a field clearly, omit it
- Be accurate with numbers - these are used for tax filing
- Always include documentType, taxYear, isTemplateData, and confidence
- For 1099-NEC: ALWAYS include "compensation" field at root level (Box 1)
- Return ONLY the JSON object, nothing else
- Do NOT wrap in markdown code blocks
- DO NOT add any explanatory text`

    console.log("[v0] Calling AI model for extraction...")

    let extractedData: any

    try {
      const text = await extractWithRetry(dataUrl, extractionInstructions)

      console.log("[v0] AI extraction complete, parsing response...")
      console.log("[v0] Raw AI response:", text.substring(0, 200))

      let cleanedText = text.trim()

      if (cleanedText.startsWith("`")) {
        cleanedText = cleanedText.replace(/^\`\`\`(?:json)?\n?/, "")
        cleanedText = cleanedText.replace(/\n?\`\`\`$/, "")
        cleanedText = cleanedText.trim()
      }

      const jsonStart = cleanedText.indexOf("{")
      if (jsonStart > 0) {
        cleanedText = cleanedText.substring(jsonStart)
      }

      const jsonEnd = cleanedText.lastIndexOf("}")
      if (jsonEnd > 0 && jsonEnd < cleanedText.length - 1) {
        cleanedText = cleanedText.substring(0, jsonEnd + 1)
      }

      try {
        extractedData = JSON.parse(cleanedText)
        console.log("[v0] Successfully parsed AI response")
      } catch (parseError) {
        console.error("[v0] Failed to parse AI response as JSON")
        throw new Error(`AI returned invalid JSON format`)
      }
    } catch (aiError) {
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError)

      if (
        errorMessage.includes("Gateway") ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("network") ||
        errorMessage.includes("timeout") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("ENOTFOUND") ||
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("ECONNRESET")
      ) {
        console.log("[v0] AI extraction unavailable - using intelligent demo mode")

        extractedData = createDemoExtraction(fileName)

        return NextResponse.json({
          success: true,
          data: extractedData,
          mode: "demo",
          message:
            "AI service temporarily unavailable. Demo values have been pre-filled as a starting point. Please review and update all information before submitting.",
        })
      }

      throw aiError
    }

    if (extractedData.documentType === "w2") {
      const hasEmployerData = extractedData.employer_name || extractedData.employer?.name
      const hasEmployerEIN = extractedData.employer_ein || extractedData.employer?.ein
      const hasEmployeeData = extractedData.employee_name || extractedData.employee?.name
      const hasEmployeeSSN = extractedData.employee_ssn || extractedData.employee?.ssn || extractedData.employee?.ssn_encrypted
      const hasWages = extractedData.wages !== undefined || extractedData.income?.wages !== undefined

      console.log("[v0] W-2 validation:", {
        hasEmployerData,
        hasEmployerEIN,
        hasEmployeeData,
        hasEmployeeSSN,
        hasWages,
      })

      const hasRequiredW2Data = hasEmployerData && hasEmployerEIN && hasEmployeeData && hasEmployeeSSN && hasWages

      if (!hasRequiredW2Data) {
        console.error("[v0] W-2 extraction missing required fields - attempting to use partial data")
        
        return NextResponse.json({
          success: true,
          data: extractedData,
          mode: "ai",
          warning: "Some W-2 fields may be incomplete. Please review and fill in missing information before submitting.",
        })
      }
    } else if (extractedData.documentType === "1099-nec" || extractedData.documentType === "1099-misc") {
      const hasRequired1099Data =
        extractedData.payer?.name &&
        extractedData.payer?.ein &&
        extractedData.recipient?.name &&
        (extractedData.recipient?.ssn || extractedData.recipient?.ein) &&
        (extractedData.compensation !== undefined || extractedData.income?.nonemployeeCompensation !== undefined)

      if (!hasRequired1099Data) {
        console.error("[v0] 1099 extraction missing required fields")
        console.error("[v0] Payer:", extractedData.payer?.name)
        console.error("[v0] Recipient:", extractedData.recipient?.name)
        console.error("[v0] Compensation:", extractedData.compensation)
        throw new Error(
          "Could not extract all required 1099 data. Please ensure the document is clear and all fields are visible, especially Box 1 (Nonemployee Compensation).",
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

    if (extractedData.employer?.address || extractedData.employer_address) {
      const addressToParse = extractedData.employer?.address || extractedData.employer_address
      const parsed = parseFullAddress(addressToParse)
      if (parsed) {
        if (extractedData.employer) {
          extractedData.employer.street = parsed.street || addressToParse
          extractedData.employer.city = parsed.city
          extractedData.employer.state = parsed.state
          extractedData.employer.zipCode = parsed.zipCode
        } else {
          extractedData.employer_street = parsed.street || addressToParse
          extractedData.employer_city = parsed.city
          extractedData.employer_state = parsed.state
          extractedData.employer_zip = parsed.zipCode
        }
      }
    }

    if (extractedData.employee?.address || extractedData.employee_address) {
      const addressToParse = extractedData.employee?.address || extractedData.employee_address
      const parsed = parseFullAddress(addressToParse)
      if (parsed) {
        if (extractedData.employee) {
          extractedData.employee.street = parsed.street || addressToParse
          extractedData.employee.city = parsed.city
          extractedData.employee.state = parsed.state
          extractedData.employee.zipCode = parsed.zipCode
        } else {
          extractedData.employee_street = parsed.street || addressToParse
          extractedData.employee_city = parsed.city
          extractedData.employee_state = parsed.state
          extractedData.employee_zip = parsed.zipCode
        }
      }
    }

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

    if (extractedData.isTemplateData === true) {
      console.log("[v0] Template/demo document detected by AI")
      return NextResponse.json({
        success: true,
        data: extractedData,
        mode: "template",
        message:
          "This appears to be a sample document with template data. Please review and update with actual information before filing.",
      })
    }

    console.log("[v0] Real document data extracted successfully")
    console.log("[v0] Document type:", extractedData.documentType)
    console.log("[v0] Tax year:", extractedData.taxYear)

    return NextResponse.json({
      success: true,
      data: extractedData,
      mode: "ai",
    })
  } catch (error) {
    console.error("[v0] Document extraction error:", error)

    let userMessage = "Failed to extract document data"
    const errorMessage = error instanceof Error ? error.message : String(error)

    if (errorMessage.includes("Gateway") || errorMessage.includes("timeout") || errorMessage.includes("fetch failed") || errorMessage.includes("network")) {
      userMessage =
        "Unable to connect to AI service. The system will use demo data as a starting point - please review and update all fields."
    } else if (errorMessage.includes("File too large")) {
      userMessage = errorMessage
    } else if (errorMessage.includes("invalid JSON")) {
      userMessage =
        "Could not understand the document format. Please ensure it's a clear, readable tax document (W-2, 1099, etc.)"
    }

    return NextResponse.json(
      {
        success: false,
        error: userMessage,
      },
      { status: 500 },
    )
  }
}
