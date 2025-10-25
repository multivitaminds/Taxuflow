import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Database not available")
    }

    // Get categorized transactions
    const { data: transactions } = await supabase
      .from("qbo_transactions")
      .select("*")
      .eq("user_id", userId)
      .not("tax_category", "is", null)

    if (!transactions || transactions.length === 0) {
      throw new Error("No categorized transactions found")
    }

    // Calculate totals
    const businessIncome = transactions
      .filter((t) => t.tax_category === "business_income")
      .reduce((sum, t) => sum + t.amount, 0)

    const businessExpenses = transactions
      .filter((t) => t.tax_category === "business_expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Create filing record
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
      businessIncome,
      businessExpenses,
    })
  } catch (error) {
    console.error("[v0] QuickBooks filing submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit filing",
      },
      { status: 500 },
    )
  }
}
