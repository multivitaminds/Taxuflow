import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "7d" // 24h, 7d, 30d, 90d
    const groupBy = searchParams.get("groupBy") || "day" // hour, day, week

    // Calculate date range based on period
    let hoursAgo = 168 // 7 days default
    if (period === "24h") hoursAgo = 24
    else if (period === "30d") hoursAgo = 720
    else if (period === "90d") hoursAgo = 2160

    // Get user's API keys
    const { data: apiKeys, error: keysError } = await supabase.from("api_keys").select("id").eq("user_id", user.id)

    if (keysError || !apiKeys?.length) {
      return NextResponse.json(
        {
          summary: {
            totalRequests: 0,
            successRate: 0,
            avgResponseTime: 0,
            errorRate: 0,
          },
          timeSeries: [],
          topEndpoints: [],
          statusDistribution: [],
        },
        { status: 200 },
      )
    }

    const apiKeyIds = apiKeys.map((k) => k.id)

    // Get summary statistics
    const { data: summaryData, error: summaryError } = await supabase
      .from("api_request_logs")
      .select("status_code, response_time_ms")
      .in("api_key_id", apiKeyIds)
      .gte("created_at", new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString())

    let totalRequests = 0
    let successfulRequests = 0
    let totalResponseTime = 0
    let errorRequests = 0

    if (summaryData) {
      totalRequests = summaryData.length
      successfulRequests = summaryData.filter((r) => r.status_code >= 200 && r.status_code < 300).length
      errorRequests = summaryData.filter((r) => r.status_code >= 400).length
      totalResponseTime = summaryData.reduce((sum, r) => sum + (r.response_time_ms || 0), 0)
    }

    const summary = {
      totalRequests,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      avgResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      errorRate: totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0,
    }

    // Get time series data
    const timeSeriesQuery = `
      SELECT 
        date_trunc('${groupBy === "hour" ? "hour" : groupBy === "week" ? "week" : "day"}', created_at) as time_bucket,
        COUNT(*) as request_count,
        COUNT(*) FILTER (WHERE status_code >= 200 AND status_code < 300) as success_count,
        COUNT(*) FILTER (WHERE status_code >= 400) as error_count,
        AVG(response_time_ms) as avg_response_time
      FROM api_request_logs
      WHERE api_key_id = ANY($1)
        AND created_at >= NOW() - INTERVAL '${hoursAgo} hours'
      GROUP BY time_bucket
      ORDER BY time_bucket ASC
    `

    const { data: timeSeriesData, error: timeSeriesError } = await supabase.rpc("execute_sql", {
      query: timeSeriesQuery,
      params: [apiKeyIds],
    })

    // Get top endpoints
    const { data: endpointsData, error: endpointsError } = await supabase
      .from("api_request_logs")
      .select("endpoint, status_code")
      .in("api_key_id", apiKeyIds)
      .gte("created_at", new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString())

    const endpointStats: Record<string, { count: number; errors: number }> = {}
    if (endpointsData) {
      endpointsData.forEach((log) => {
        if (!endpointStats[log.endpoint]) {
          endpointStats[log.endpoint] = { count: 0, errors: 0 }
        }
        endpointStats[log.endpoint].count++
        if (log.status_code >= 400) {
          endpointStats[log.endpoint].errors++
        }
      })
    }

    const topEndpoints = Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        errorRate: (stats.errors / stats.count) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Get status code distribution
    const statusDistribution: Record<string, number> = {}
    if (summaryData) {
      summaryData.forEach((log) => {
        const statusGroup = `${Math.floor(log.status_code / 100)}xx`
        statusDistribution[statusGroup] = (statusDistribution[statusGroup] || 0) + 1
      })
    }

    const statusDistributionArray = Object.entries(statusDistribution).map(([status, count]) => ({
      status,
      count,
      percentage: (count / totalRequests) * 100,
    }))

    return NextResponse.json({
      summary,
      timeSeries: timeSeriesData || [],
      topEndpoints,
      statusDistribution: statusDistributionArray,
    })
  } catch (error) {
    console.error("[v0] Error fetching request analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
