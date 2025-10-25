import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      throw new Error("Database not available")
    }

    // Check if QuickBooks is connected
    const { data: connection } = await supabase.from("qbo_connections").select("*").eq("user_id", userId).maybeSingle()

    // Get transaction count
    const { count: transactionCount } = await supabase
      .from("qbo_transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    // Get categorized count
    const { count: categorizedCount } = await supabase
      .from("qbo_transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .not("tax_category", "is", null)

    return NextResponse.json({
      connected: !!connection,
      lastSync: connection?.last_sync_at || null,
      transactionCount: transactionCount || 0,
      categorizedCount: categorizedCount || 0,
    })
  } catch (error) {
    console.error("[v0] QuickBooks sync status error:", error)
    return NextResponse.json(
      {
        connected: false,
        lastSync: null,
        transactionCount: 0,
        categorizedCount: 0,
      },
      { status: 200 },
    )
  }
}
