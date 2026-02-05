import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DEVELOPER_USAGE_PRICING, calculateEstimatedMonthlyCost } from "@/lib/subscription-plans"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get date range from query params (default to current month)
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("start") || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const endDate = searchParams.get("end") || new Date().toISOString()

    // Get API usage from api_key_usage table
    const { data: apiUsage, error: apiError } = await supabase
      .from("api_key_usage")
      .select(`
        id,
        api_key_id,
        endpoint,
        method,
        response_time_ms,
        status_code,
        created_at
      `)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false })

    if (apiError) {
      console.error("[v0] Error fetching API usage:", apiError)
    }

    // Get filing counts from tax_filings table
    const { data: filings, error: filingsError } = await supabase
      .from("tax_filings")
      .select("id, form_type, filing_status, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)

    if (filingsError) {
      console.error("[v0] Error fetching filings:", filingsError)
    }

    // Get W-2 filings count
    const { data: w2Filings, error: w2Error } = await supabase
      .from("w2_filings")
      .select("id, irs_status, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)

    if (w2Error) {
      console.error("[v0] Error fetching W-2 filings:", w2Error)
    }

    // Get 1099 filings count
    const { data: necFilings, error: necError } = await supabase
      .from("nec_1099_filings")
      .select("id, irs_status, created_at")
      .eq("user_id", user.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)

    if (necError) {
      console.error("[v0] Error fetching 1099 filings:", necError)
    }

    // Calculate usage metrics
    const readCalls = apiUsage?.filter(u => u.method === "GET").length || 0
    const writeCalls = apiUsage?.filter(u => ["POST", "PUT", "DELETE", "PATCH"].includes(u.method)).length || 0
    const federalFilings = filings?.filter(f => f.form_type?.includes("federal")).length || 0
    const stateFilings = filings?.filter(f => f.form_type?.includes("state")).length || 0
    const w2Count = w2Filings?.length || 0
    const nec1099Count = necFilings?.length || 0

    // Calculate estimated costs based on usage
    const estimatedCost = calculateEstimatedMonthlyCost({
      federalFilings,
      stateFilings,
      w2Filings: w2Count,
      form1099Filings: nec1099Count,
      activeBusinesses: 1, // Placeholder
      identityVerifications: 0,
      einValidations: 0,
      apiReadCalls: readCalls,
      apiWriteCalls: writeCalls,
    })

    // Get daily usage breakdown
    const dailyUsage: Record<string, { reads: number; writes: number; filings: number }> = {}
    
    apiUsage?.forEach(u => {
      const date = new Date(u.created_at).toISOString().split("T")[0]
      if (!dailyUsage[date]) {
        dailyUsage[date] = { reads: 0, writes: 0, filings: 0 }
      }
      if (u.method === "GET") {
        dailyUsage[date].reads++
      } else {
        dailyUsage[date].writes++
      }
    })

    filings?.forEach(f => {
      const date = new Date(f.created_at).toISOString().split("T")[0]
      if (!dailyUsage[date]) {
        dailyUsage[date] = { reads: 0, writes: 0, filings: 0 }
      }
      dailyUsage[date].filings++
    })

    // Get endpoint breakdown
    const endpointBreakdown: Record<string, number> = {}
    apiUsage?.forEach(u => {
      const endpoint = u.endpoint?.split("?")[0] || "unknown"
      endpointBreakdown[endpoint] = (endpointBreakdown[endpoint] || 0) + 1
    })

    // Get response time metrics
    const responseTimes = apiUsage?.map(u => u.response_time_ms).filter(Boolean) || []
    const avgResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0
    const p95ResponseTime = responseTimes.length > 0
      ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)]
      : 0

    // Get error rate
    const errorCalls = apiUsage?.filter(u => u.status_code >= 400).length || 0
    const errorRate = apiUsage?.length ? ((errorCalls / apiUsage.length) * 100).toFixed(2) : "0.00"

    return NextResponse.json({
      period: {
        start: startDate,
        end: endDate,
      },
      summary: {
        totalApiCalls: (apiUsage?.length || 0),
        readCalls,
        writeCalls,
        federalFilings,
        stateFilings,
        w2Filings: w2Count,
        form1099Filings: nec1099Count,
        estimatedCost,
      },
      performance: {
        avgResponseTime,
        p95ResponseTime,
        errorRate: `${errorRate}%`,
        uptime: "99.99%", // Placeholder
      },
      dailyUsage: Object.entries(dailyUsage).map(([date, data]) => ({
        date,
        ...data,
      })).sort((a, b) => a.date.localeCompare(b.date)),
      endpointBreakdown: Object.entries(endpointBreakdown)
        .map(([endpoint, count]) => ({ endpoint, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      pricing: DEVELOPER_USAGE_PRICING,
    })
  } catch (error) {
    console.error("[v0] Usage API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Track a usage event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { eventType, metadata } = body

    // Log the usage event
    const { error } = await supabase
      .from("api_request_logs")
      .insert({
        user_id: user.id,
        method: "POST",
        endpoint: `/api/usage/${eventType}`,
        request_body: metadata,
        response_status: 200,
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error("[v0] Error logging usage event:", error)
      return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Usage tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
