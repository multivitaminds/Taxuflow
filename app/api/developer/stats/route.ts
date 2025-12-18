import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const period = req.nextUrl.searchParams.get("period") || "7d"

    // Calculate date range
    const now = new Date()
    const daysAgo = period === "24h" ? 1 : period === "7d" ? 7 : 30
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Get total requests
    const { count: totalRequests } = await supabase
      .from("api_request_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())

    // Get success rate
    const { data: requestsByStatus } = await supabase
      .from("api_request_logs")
      .select("response_status")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())

    const successCount =
      requestsByStatus?.filter((r) => r.response_status >= 200 && r.response_status < 300).length || 0
    const successRate = totalRequests ? ((successCount / totalRequests) * 100).toFixed(1) : "0.0"

    // Get average response time
    const { data: responseTimes } = await supabase
      .from("api_request_logs")
      .select("response_time_ms")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())
      .not("response_time_ms", "is", null)

    const avgResponseTime =
      responseTimes && responseTimes.length > 0
        ? Math.round(responseTimes.reduce((sum, r) => sum + (r.response_time_ms || 0), 0) / responseTimes.length)
        : 0

    // Get error rate
    const errorCount = requestsByStatus?.filter((r) => r.response_status >= 400).length || 0
    const errorRate = totalRequests ? ((errorCount / totalRequests) * 100).toFixed(1) : "0.0"

    // Get top endpoints
    const { data: topEndpoints } = await supabase
      .from("api_request_logs")
      .select("endpoint")
      .eq("user_id", user.id)
      .gte("created_at", startDate.toISOString())

    const endpointCounts: Record<string, number> = {}
    topEndpoints?.forEach((r) => {
      endpointCounts[r.endpoint] = (endpointCounts[r.endpoint] || 0) + 1
    })

    const topEndpointsArray = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get time series data (last 7 days)
    const timeSeriesData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const { count } = await supabase
        .from("api_request_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", dayStart.toISOString())
        .lte("created_at", dayEnd.toISOString())

      timeSeriesData.push({
        date: dayStart.toISOString().split("T")[0],
        requests: count || 0,
      })
    }

    return NextResponse.json({
      totalRequests: totalRequests || 0,
      successRate,
      avgResponseTime,
      errorRate,
      topEndpoints: topEndpointsArray,
      timeSeries: timeSeriesData,
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
