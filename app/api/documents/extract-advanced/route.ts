import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { getExtractionModelWithFallback } from "@/lib/ai-config"

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName, mimeType } = await request.json()

    if (!fileData) {
      return NextResponse.json({ success: false, error: "No file data provided" }, { status: 400 })
    }

    const dataUrl = `data:${mimeType};base64,${fileData}`

    // Determine document type from filename
    const isW9 = fileName.toLowerCase().includes("w9") || fileName.toLowerCase().includes("w-9")
    const isContract = fileName.toLowerCase().includes("contract") || fileName.toLowerCase().includes("agreement")

    let extractionInstructions = ""
    let documentType = "document"

    if (isW9) {
      documentType = "w9"
      extractionInstructions = `You are an expert at extracting data from W-9 tax forms.

Extract ALL information from this W-9 form:

Required Fields:
- name: Legal name (individual or business)
- businessName: Business name/DBA (if different from name)
- taxClassification: Individual/Sole Proprietor, C Corp, S Corp, Partnership, Trust/Estate, LLC, or Other
- address: Complete street address including apartment/suite
- city: City name
- state: State abbreviation
- zipCode: ZIP code
- tin: Taxpayer Identification Number (SSN or EIN) - format XX-XXXXXXX or XXX-XX-XXXX
- accountNumbers: Any account numbers listed (optional)

IMPORTANT:
- Preserve complete addresses with apartment/suite numbers
- Extract TIN exactly as shown (may be masked: XXX-XX-XXXX)
- Tax classification is usually checked in boxes 1-7
- Return confidence score between 0 and 1

Return ONLY a JSON object with these fields. No markdown, no explanations.`
    } else if (isContract) {
      documentType = "contract"
      extractionInstructions = `You are an expert contract analyst specializing in tax implications.

Analyze this contract and extract:

1. Key Contract Terms:
   - Parties involved (names and roles)
   - Effective date and term length
   - Payment terms and amounts
   - Termination clauses
   - Key obligations

2. Tax Implications:
   - Is this an independent contractor agreement? (1099 vs W-2 classification risk)
   - Are there payment withholding requirements?
   - Any tax indemnification clauses?
   - State tax nexus created?
   - Sales tax responsibilities?

3. Risk Indicators:
   - Employment misclassification risks
   - Missing tax documentation requirements
   - Unclear payment terms
   - Jurisdiction/venue issues

Return JSON with structure:
{
  "documentType": "contract",
  "confidence": 0.95,
  "keyTerms": [{"name": "...", "value": "..."}],
  "taxImplications": ["implication 1", "implication 2"],
  "riskIndicators": ["risk 1", "risk 2"],
  "parties": [{"name": "...", "role": "..."}],
  "effectiveDate": "YYYY-MM-DD",
  "paymentTerms": "description"
}

No markdown, just JSON.`
    } else {
      // Generic document extraction
      extractionInstructions = `Extract key information from this document.

Return JSON with:
{
  "documentType": "type of document",
  "confidence": 0.95,
  "summary": "brief summary",
  "extractedFields": {"field": "value"}
}

No markdown, just JSON.`
    }

    console.log(`[Document Intelligence] Processing ${documentType}: ${fileName}`)

    // Get AI model configuration
    const [primaryModel] = getExtractionModelWithFallback()

    const { text } = await generateText({
      model: primaryModel.modelId,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: extractionInstructions },
            { type: "image", image: dataUrl },
          ],
        },
      ],
      maxTokens: primaryModel.maxTokens,
    })

    // Parse AI response
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "")
        .trim()
    }

    const extractedData = JSON.parse(cleanedText)
    extractedData.documentType = documentType

    // For contracts, also return analysis
    const response: any = {
      success: true,
      documentType,
      data: extractedData,
    }

    if (documentType === "contract") {
      response.analysis = {
        keyTerms: extractedData.keyTerms || [],
        taxImplications: extractedData.taxImplications || [],
        riskIndicators: extractedData.riskIndicators || [],
      }
    }

    console.log(`[Document Intelligence] Successfully processed ${documentType}`)

    return NextResponse.json(response)
  } catch (error) {
    console.error("[Document Intelligence Error]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process document",
      },
      { status: 500 },
    )
  }
}
