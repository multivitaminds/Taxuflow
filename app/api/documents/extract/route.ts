import { type NextRequest, NextResponse } from "next/server"
import { streamText } from "ai"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, fileUrl, fileName } = await request.json()

    if (!documentId || !fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use AI to extract structured data from document
    // In production, this would use OCR + AI model to extract text and parse it
    const result = await streamText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a tax document data extraction AI. Extract structured data from this tax document.
      
Document: ${fileName}
File URL: ${fileUrl}

Extract and return JSON with:
- formType (e.g., "W-2", "1099-NEC", "1098", "Receipt")
- taxYear (e.g., 2024)
- employer or payer name
- employee or recipient name
- amounts (wages, income, interest, etc.)
- any other relevant tax information

If you cannot determine the document type from the filename, make an educated guess based on common tax documents.

Return ONLY valid JSON, no markdown or explanation.`,
      maxTokens: 1000,
    })

    // Collect the full response
    let extractedText = ""
    for await (const chunk of result.textStream) {
      extractedText += chunk
    }

    // Parse extracted data
    let extractedData
    try {
      // Try to extract JSON from the response
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/)
      extractedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch (e) {
      extractedData = {
        formType: "Unknown",
        taxYear: 2024,
        rawText: extractedText,
      }
    }

    // Update document in database with extracted data
    const { error: updateError } = await supabase
      .from("documents")
      .update({
        status: "extracted",
        extracted_data: extractedData,
        processed_at: new Date().toISOString(),
      })
      .eq("document_id", documentId)
      .eq("user_id", user.id)

    if (updateError) {
      // Continue even if DB update fails
      return NextResponse.json({
        success: true,
        documentId,
        extractedData,
        warning: "Extraction successful but database update failed",
      })
    }

    return NextResponse.json({
      success: true,
      documentId,
      extractedData,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Extraction failed" }, { status: 500 })
  }
}
