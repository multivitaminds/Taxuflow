import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { classifyTaxDocument } from "@/lib/ai/universal-document-classifier"
import { extractTaxData } from "@/lib/ai/universal-extractor"
import { analyzeFilingRequirements } from "@/lib/ai/smart-filing-orchestrator"

export async function POST(request: NextRequest) {
  try {
    const { documentUrl, documentId, fileName } = await request.json()

    if (!documentUrl) {
      return NextResponse.json({ error: "Document URL is required" }, { status: 400 })
    }

    console.log("[v0] Starting intelligent document processing:", fileName)

    // Get user from Supabase
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Step 1: Classify the document
    console.log("[v0] Step 1: Classifying document...")
    const classification = await classifyTaxDocument(documentUrl, fileName)

    // Step 2: Extract data based on classification
    console.log("[v0] Step 2: Extracting data...")
    const extraction = await extractTaxData(documentUrl, classification.documentType, classification.taxYear)

    // Step 3: Get user profile and existing filings
    console.log("[v0] Step 3: Analyzing filing requirements...")
    const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

    const { data: existingFilings } = await supabase
      .from("tax_filings")
      .select("*")
      .eq("user_id", user.id)
      .eq("tax_year", classification.taxYear)

    const { data: uploadedDocuments } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .eq("tax_year", classification.taxYear)

    // Step 4: Analyze filing requirements
    const filingAnalysis = await analyzeFilingRequirements({
      documentType: classification.documentType,
      taxYear: classification.taxYear,
      extractedData: extraction.data,
      userProfile,
      existingFilings: existingFilings || [],
      uploadedDocuments: uploadedDocuments || [],
    })

    // Step 5: Save to database
    console.log("[v0] Step 4: Saving to database...")
    if (documentId) {
      await supabase
        .from("documents")
        .update({
          document_type: classification.documentType,
          ai_document_type: classification.documentType,
          tax_year: classification.taxYear,
          ai_confidence: classification.confidence,
          extracted_data: extraction.data,
          ai_description: classification.suggestedAction,
          ai_suggestions: {
            filingDecision: filingAnalysis,
            classification,
            extraction,
          },
          processed_at: new Date().toISOString(),
          processing_status: "completed",
        })
        .eq("id", documentId)
    }

    console.log("[v0] Document processing complete!")

    return NextResponse.json({
      success: true,
      classification,
      extraction,
      filingAnalysis,
      message: `Successfully processed ${classification.documentType} for tax year ${classification.taxYear}`,
    })
  } catch (error: any) {
    console.error("[v0] Error in intelligent document processing:", error)
    return NextResponse.json({ error: error.message || "Processing failed" }, { status: 500 })
  }
}
