import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Fetching extracted document data for auto-population...")

    const { data: w2Data, error: w2Error } = await supabase
      .from("w2_data")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    const { data: taxData, error: taxError } = await supabase
      .from("tax_data")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    const { data: taxDocs, error: docsError } = await supabase
      .from("tax_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    console.log("[v0] Found W-2 records:", w2Data?.length || 0)
    console.log("[v0] Found 1099 records:", taxData?.length || 0)
    console.log("[v0] Found tax documents:", taxDocs?.length || 0)

    const w2Income = w2Data?.reduce((sum, w2) => sum + (Number.parseFloat(w2.wages) || 0), 0) || 0
    const selfEmploymentIncome =
      taxData?.reduce((sum, tax) => sum + (Number.parseFloat(tax.income_amount) || 0), 0) || 0

    let interestIncome = 0
    let dividendIncome = 0

    taxDocs?.forEach((doc) => {
      if (doc.document_subtype === "1099-INT") {
        interestIncome += Number.parseFloat(doc.extracted_data?.interest_income || 0)
      } else if (doc.document_subtype === "1099-DIV") {
        dividendIncome += Number.parseFloat(doc.extracted_data?.dividend_income || 0)
      }
    })

    const mostRecentDoc = taxDocs?.[0]
    const filingStatus = mostRecentDoc?.filing_status || "single"
    const taxpayerName = mostRecentDoc?.taxpayer_name || ""
    const spouseName = mostRecentDoc?.spouse_name || ""

    const autoPopulatedData = {
      // Personal info from documents
      filingStatus: filingStatus === "married_joint" ? "married" : filingStatus,
      taxpayerName,
      spouseName,

      // Income from extracted data
      w2Income: Math.round(w2Income),
      selfEmploymentIncome: Math.round(selfEmploymentIncome),
      interestIncome: Math.round(interestIncome),
      dividendIncome: Math.round(dividendIncome),

      // Metadata
      documentsProcessed: (w2Data?.length || 0) + (taxData?.length || 0) + (taxDocs?.length || 0),
      lastUpdated: new Date().toISOString(),
    }

    console.log("[v0] Auto-populated data:", autoPopulatedData)

    return NextResponse.json({
      success: true,
      data: autoPopulatedData,
      sources: {
        w2Count: w2Data?.length || 0,
        form1099Count: taxData?.length || 0,
        totalDocuments: taxDocs?.length || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching auto-populate data:", error)
    return NextResponse.json(
      { error: "Failed to fetch document data", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
