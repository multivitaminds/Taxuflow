import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { fileData, fileName, mimeType, documentType } = await request.json()

    if (!fileData) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataUrl = `data:${mimeType};base64,${fileData}`

    console.log(`[GPT-4o-mini] Extracting ${documentType || "document"}: ${fileName}`)

    // Define comprehensive extraction schema based on document type
    const w2Schema = z.object({
      documentType: z.literal("w2"),
      confidence: z.number().min(0).max(100),
      taxYear: z.number(),
      employer: z.object({
        name: z.string(),
        ein: z.string(),
        address: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        }),
      }),
      employee: z.object({
        name: z.string(),
        ssn: z.string().optional(),
        address: z.object({
          street: z.string(),
          city: z.string(),
          state: z.string(),
          zip: z.string(),
        }),
      }),
      income: z.object({
        wages: z.number(),
        federalWithholding: z.number(),
        socialSecurityWages: z.number(),
        socialSecurityTax: z.number(),
        medicareWages: z.number(),
        medicareTax: z.number(),
        stateWages: z.number().optional(),
        stateTax: z.number().optional(),
      }),
      flags: z
        .object({
          isRetirement: z.boolean().optional(),
          isStatutoryEmployee: z.boolean().optional(),
          hasThirdPartySickPay: z.boolean().optional(),
        })
        .optional(),
    })

    const extract1099Schema = z.object({
      documentType: z.enum(["1099-nec", "1099-misc", "1099-int", "1099-div"]),
      confidence: z.number().min(0).max(100),
      taxYear: z.number(),
      payer: z.object({
        name: z.string(),
        tin: z.string(),
        address: z.string(),
      }),
      recipient: z.object({
        name: z.string(),
        tin: z.string().optional(),
        address: z.string(),
      }),
      amounts: z.object({
        nonemployeeCompensation: z.number().optional(),
        rents: z.number().optional(),
        royalties: z.number().optional(),
        interestIncome: z.number().optional(),
        dividends: z.number().optional(),
        federalTaxWithheld: z.number().optional(),
        stateTaxWithheld: z.number().optional(),
      }),
    })

    const schema = documentType === "w2" ? w2Schema : extract1099Schema

    const { object: extractedData } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema,
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
              text: `You are an expert tax document analyst. Extract ALL information from this ${documentType || "tax"} form with perfect accuracy.

CRITICAL REQUIREMENTS:
1. Extract every visible field, even if partially obscured
2. Use OCR best practices for handwritten text
3. Validate all numbers and amounts
4. Preserve exact formatting for EIN/SSN/TIN
5. Parse addresses into structured components
6. Identify document type with high confidence
7. Flag any anomalies or inconsistencies

Return structured data matching the schema exactly. Do not guess - if a field is unclear, mark confidence appropriately.`,
            },
          ],
        },
      ],
      temperature: 0, // Maximum precision for data extraction
    })

    console.log(`[GPT-4o-mini] Extraction complete - Confidence: ${extractedData.confidence}%`)

    return NextResponse.json({
      success: true,
      data: extractedData,
      model: "gpt-4o-mini",
      processingTime: Date.now(),
    })
  } catch (error) {
    console.error("[GPT Extraction Error]", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Extraction failed",
      },
      { status: 500 },
    )
  }
}
