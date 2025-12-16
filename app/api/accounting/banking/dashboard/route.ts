import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

    const [accountsResult, transactionsResult] = await Promise.all([
      supabase.from("bank_accounts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase
        .from("bank_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(50),
    ])

    if (accountsResult.error) {
      console.log("[v0] Banking dashboard error:", accountsResult.error)
      return NextResponse.json({ error: accountsResult.error.message }, { status: 500 })
    }

    const totalBalance = (accountsResult.data || []).reduce((sum, account) => {
      return sum + (Number(account.balance) || 0)
    }, 0)

    return NextResponse.json({
      success: true,
      accounts: accountsResult.data || [],
      transactions: transactionsResult.data || [],
      totalBalance,
      accountCount: accountsResult.data?.length || 0,
      transactionCount: transactionsResult.data?.length || 0,
    })
  } catch (error) {
    console.log("[v0] Banking dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
