import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "today" // today, week, month

    // Get user's API keys
    const { data: keys } = await supabase.from("api_keys").select("id").eq("user_id", user.id)

    if (!keys || keys.length === 0) {
      return NextResponse.json({
        totalCalls: 0,
        successRate: 100,
        avgResponseTime: 0,
        recentActivity: [],
      })
    }

    const keyIds = keys.map((k) => k.id)

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (period === "today") {
      startDate.setHours(0, 0, 0, 0)
    } else if (period === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate.setDate(now.getDate() - 30)
    }

    // Fetch usage data
    const { data: usage, error: usageError } = await supabase
      .from("api_usage")
      .select("*")
      .in("api_key_id", keyIds)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(100)

    if (usageError) {
      console.error("[v0] Error fetching usage:", usageError)
      return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 })
    }

    // Calculate stats
    const totalCalls = usage.length
    const successfulCalls = usage.filter((u) => u.status_code >= 200 && u.status_code < 300).length
    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 100
    const avgResponseTime = totalCalls > 0 ? usage.reduce((sum, u) => sum + u.response_time_ms, 0) / totalCalls : 0

    // Recent activity (last 10)
    const recentActivity = usage.slice(0, 10).map((u) => ({
      endpoint: u.endpoint,
      method: u.method,
      status: u.status_code,
      duration: `${u.response_time_ms}ms`,
      time: new Date(u.created_at).toLocaleString(),
    }))

    return NextResponse.json({
      totalCalls,
      successRate: successRate.toFixed(2),
      avgResponseTime: Math.round(avgResponseTime),
      recentActivity,
    })
  } catch (error) {
    console.error("[v0] Error in usage stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
