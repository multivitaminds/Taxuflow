import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, documents } = await request.json()

    // Aggregate data from all documents
    const totalWages = documents.reduce((sum: number, doc: any) => sum + (doc.income?.wages || 0), 0)

    const totalWithholding = documents.reduce((sum: number, doc: any) => sum + (doc.income?.federalWithholding || 0), 0)

    // Create a filing record
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Database not available")
    }

    const { data: filing, error } = await supabase
      .from("tax_filings")
      .insert({
        user_id: userId,
        tax_year: new Date().getFullYear() - 1,
        filing_status: "single",
        provider_name: "taxbandits",
        irs_status: "pending",
        filed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      filingId: filing.id,
      totalWages,
      totalWithholding,
    })
  } catch (error) {
    console.error("[v0] Extracted filing submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit filing",
      },
      { status: 500 },
    )
  }
}
