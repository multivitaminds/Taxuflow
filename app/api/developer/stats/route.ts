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
    const period = searchParams.get("period") || "30d" // 24h, 7d, 30d

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (period === "24h") {
      startDate.setHours(now.getHours() - 24)
    } else if (period === "7d") {
      startDate.setDate(now.getDate() - 7)
    } else if (period === "30d") {
      startDate.setDate(now.getDate() - 30)
    }

    // Get user's API keys
    const { data: keys } = await supabase.from("api_keys").select("id").eq("user_id", user.id)

    if (!keys || keys.length === 0) {
      return NextResponse.json({
        totalRequests: 0,
        successRate: 100,
        avgResponseTime: 0,
        errorRate: 0,
        requestsByEndpoint: [],
        requestsOverTime: [],
        topEndpoints: [],
      })
    }

    const keyIds = keys.map((k) => k.id)

    // Fetch API request logs
    const { data: logs, error: logsError } = await supabase
      .from("api_request_logs")
      .select("*")
      .in("api_key_id", keyIds)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })

    if (logsError) {
      console.error("[v0] Error fetching request logs:", logsError)
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }

    // Calculate statistics
    const totalRequests = logs.length
    const successfulRequests = logs.filter((l) => l.status_code >= 200 && l.status_code < 300).length
    const errorRequests = logs.filter((l) => l.status_code >= 400).length
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100
    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0
    const avgResponseTime =
      totalRequests > 0 ? logs.reduce((sum, l) => sum + (l.response_time_ms || 0), 0) / totalRequests : 0

    // Group by endpoint
    const endpointStats = logs.reduce(
      (acc, log) => {
        const endpoint = log.endpoint
        if (!acc[endpoint]) {
          acc[endpoint] = { count: 0, totalTime: 0, errors: 0 }
        }
        acc[endpoint].count++
        acc[endpoint].totalTime += log.response_time_ms || 0
        if (log.status_code >= 400) acc[endpoint].errors++
        return acc
      },
      {} as Record<string, { count: number; totalTime: number; errors: number }>,
    )

    const topEndpoints = Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        requests: stats.count,
        avgResponseTime: Math.round(stats.totalTime / stats.count),
        errorRate: ((stats.errors / stats.count) * 100).toFixed(1),
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5)

    // Group by date for time series
    const requestsByDate = logs.reduce(
      (acc, log) => {
        const date = new Date(log.created_at).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const requestsOverTime = Object.entries(requestsByDate)
      .map(([date, count]) => ({ date, requests: count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      totalRequests,
      successRate: Number.parseFloat(successRate.toFixed(2)),
      avgResponseTime: Math.round(avgResponseTime),
      errorRate: Number.parseFloat(errorRate.toFixed(2)),
      topEndpoints,
      requestsOverTime,
    })
  } catch (error) {
    console.error("[v0] Error in developer stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
