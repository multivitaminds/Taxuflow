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
    const period = searchParams.get("period") || "30d" // 7d, 30d, 90d

    // Calculate date range
    let daysAgo = 30
    if (period === "7d") daysAgo = 7
    else if (period === "90d") daysAgo = 90

    // Get documentation page views
    const { data: pageViewsData, error: pageViewsError } = await supabase
      .from("documentation_page_views")
      .select("page_path, page_title, search_query, time_on_page_seconds, referrer, created_at")
      .gte("created_at", new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString())

    if (pageViewsError) {
      console.error("[v0] Error fetching documentation views:", pageViewsError)
      return NextResponse.json({ error: "Failed to fetch documentation analytics" }, { status: 500 })
    }

    const totalViews = pageViewsData?.length || 0

    // Top pages
    const pageStats: Record<
      string,
      {
        path: string
        title: string
        views: number
        avgTimeOnPage: number
        totalTime: number
      }
    > = {}

    if (pageViewsData) {
      pageViewsData.forEach((view) => {
        if (!pageStats[view.page_path]) {
          pageStats[view.page_path] = {
            path: view.page_path,
            title: view.page_title,
            views: 0,
            avgTimeOnPage: 0,
            totalTime: 0,
          }
        }
        pageStats[view.page_path].views++
        pageStats[view.page_path].totalTime += view.time_on_page_seconds || 0
      })

      // Calculate averages
      Object.values(pageStats).forEach((stat) => {
        stat.avgTimeOnPage = stat.totalTime / stat.views
      })
    }

    const topPages = Object.values(pageStats)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
      .map(({ totalTime, ...rest }) => rest)

    // Search queries
    const searchQueries: Record<string, number> = {}
    if (pageViewsData) {
      pageViewsData.forEach((view) => {
        if (view.search_query) {
          searchQueries[view.search_query] = (searchQueries[view.search_query] || 0) + 1
        }
      })
    }

    const topSearches = Object.entries(searchQueries)
      .map(([query, count]) => ({
        query,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Referrer analysis
    const referrerStats: Record<string, number> = {}
    if (pageViewsData) {
      pageViewsData.forEach((view) => {
        if (view.referrer) {
          try {
            const url = new URL(view.referrer)
            const domain = url.hostname
            referrerStats[domain] = (referrerStats[domain] || 0) + 1
          } catch {
            referrerStats["direct"] = (referrerStats["direct"] || 0) + 1
          }
        } else {
          referrerStats["direct"] = (referrerStats["direct"] || 0) + 1
        }
      })
    }

    const topReferrers = Object.entries(referrerStats)
      .map(([referrer, views]) => ({
        referrer,
        views,
        percentage: (views / totalViews) * 100,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Time series data (views over time)
    const timeSeriesData: Record<string, number> = {}
    if (pageViewsData) {
      pageViewsData.forEach((view) => {
        const date = new Date(view.created_at).toISOString().split("T")[0]
        timeSeriesData[date] = (timeSeriesData[date] || 0) + 1
      })
    }

    const timeSeries = Object.entries(timeSeriesData)
      .map(([date, views]) => ({
        date,
        views,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Get documentation feedback
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("documentation_feedback")
      .select("rating, feedback_type, page_path")
      .gte("created_at", new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString())

    let avgRating = 0
    const feedbackByType: Record<string, number> = {
      positive: 0,
      suggestion: 0,
      issue: 0,
    }

    if (feedbackData) {
      const totalRatings = feedbackData.filter((f) => f.rating).length
      const sumRatings = feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0)
      avgRating = totalRatings > 0 ? sumRatings / totalRatings : 0

      feedbackData.forEach((feedback) => {
        if (feedback.feedback_type) {
          feedbackByType[feedback.feedback_type] = (feedbackByType[feedback.feedback_type] || 0) + 1
        }
      })
    }

    const feedbackBreakdown = Object.entries(feedbackByType).map(([type, count]) => ({
      type,
      count,
    }))

    return NextResponse.json({
      summary: {
        totalViews,
        totalPages: Object.keys(pageStats).length,
        totalSearches: Object.keys(searchQueries).length,
        avgRating,
        period,
      },
      topPages,
      topSearches,
      topReferrers,
      timeSeries,
      feedbackBreakdown,
    })
  } catch (error) {
    console.error("[v0] Error fetching documentation analytics:", error)
    return NextResponse.json({ error: "Failed to fetch documentation analytics" }, { status: 500 })
  }
}
