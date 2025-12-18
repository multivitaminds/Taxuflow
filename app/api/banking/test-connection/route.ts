import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const [accountsResult, transactionsResult] = await Promise.all([
      supabase.from("bank_accounts").select("id", { count: "exact", head: true }),
      supabase.from("bank_transactions").select("id", { count: "exact", head: true }),
    ])

    if (accountsResult.error) {
      return NextResponse.json({ error: accountsResult.error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      accounts: accountsResult.count || 0,
      transactions: transactionsResult.count || 0,
      message: "Banking dashboard database connection successful",
    })
  } catch (error) {
    console.log("[v0] Banking test error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
