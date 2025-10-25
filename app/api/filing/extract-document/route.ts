import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { fileId, userId } = await request.json()

    // Use AI to extract tax data from the document
    const { object } = await generateObject({
      model: "openai/gpt-4o",
      schema: {
        type: "object",
        properties: {
          documentType: { type: "string", enum: ["w2", "1099", "receipt", "other"] },
          taxYear: { type: "number" },
          employer: {
            type: "object",
            properties: {
              name: { type: "string" },
              ein: { type: "string" },
              address: { type: "string" },
            },
          },
          employee: {
            type: "object",
            properties: {
              name: { type: "string" },
              ssn: { type: "string" },
              address: { type: "string" },
            },
          },
          income: {
            type: "object",
            properties: {
              wages: { type: "number" },
              federalWithholding: { type: "number" },
              socialSecurityWages: { type: "number" },
              medicareWages: { type: "number" },
            },
          },
        },
        required: ["documentType", "taxYear"],
      },
      prompt: `Extract tax information from this document. The document is located at: ${fileId}. 
      Identify the document type (W-2, 1099, receipt, etc.) and extract all relevant tax information including:
      - Tax year
      - Employer/payer information (name, EIN, address)
      - Employee/recipient information (name, SSN, address)
      - Income amounts (wages, withholding, etc.)
      
      Return structured data that can be used for tax filing.`,
    })

    return NextResponse.json({
      success: true,
      data: object,
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
