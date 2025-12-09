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
    const period = searchParams.get("period") || "30d" // 7d, 30d, 90d, all

    // Calculate date range
    let daysAgo = 30
    if (period === "7d") daysAgo = 7
    else if (period === "90d") daysAgo = 90
    else if (period === "all") daysAgo = 365 * 10 // 10 years

    // Get SDK downloads summary
    const { data: downloadData, error: downloadError } = await supabase
      .from("sdk_downloads")
      .select("sdk_name, version_number, download_source, created_at")
      .gte("created_at", new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString())

    if (downloadError) {
      console.error("[v0] Error fetching SDK downloads:", downloadError)
      return NextResponse.json({ error: "Failed to fetch SDK downloads" }, { status: 500 })
    }

    // Calculate statistics
    const totalDownloads = downloadData?.length || 0

    // Group by SDK
    const sdkStats: Record<
      string,
      {
        name: string
        downloads: number
        latestVersion: string
        sources: Record<string, number>
      }
    > = {}

    if (downloadData) {
      downloadData.forEach((download) => {
        if (!sdkStats[download.sdk_name]) {
          sdkStats[download.sdk_name] = {
            name: download.sdk_name,
            downloads: 0,
            latestVersion: download.version_number,
            sources: {},
          }
        }
        sdkStats[download.sdk_name].downloads++
        sdkStats[download.sdk_name].sources[download.download_source] =
          (sdkStats[download.sdk_name].sources[download.download_source] || 0) + 1
      })
    }

    const sdkBreakdown = Object.values(sdkStats).sort((a, b) => b.downloads - a.downloads)

    // Group by source (npm, pypi, rubygems, etc.)
    const sourceStats: Record<string, number> = {}
    if (downloadData) {
      downloadData.forEach((download) => {
        sourceStats[download.download_source] = (sourceStats[download.download_source] || 0) + 1
      })
    }

    const sourceBreakdown = Object.entries(sourceStats)
      .map(([source, downloads]) => ({
        source,
        downloads,
        percentage: (downloads / totalDownloads) * 100,
      }))
      .sort((a, b) => b.downloads - a.downloads)

    // Time series data (downloads over time)
    const timeSeriesData: Record<string, number> = {}
    if (downloadData) {
      downloadData.forEach((download) => {
        const date = new Date(download.created_at).toISOString().split("T")[0]
        timeSeriesData[date] = (timeSeriesData[date] || 0) + 1
      })
    }

    const timeSeries = Object.entries(timeSeriesData)
      .map(([date, downloads]) => ({
        date,
        downloads,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Most popular versions
    const versionStats: Record<string, number> = {}
    if (downloadData) {
      downloadData.forEach((download) => {
        const key = `${download.sdk_name}@${download.version_number}`
        versionStats[key] = (versionStats[key] || 0) + 1
      })
    }

    const topVersions = Object.entries(versionStats)
      .map(([version, downloads]) => ({
        version,
        downloads,
      }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10)

    return NextResponse.json({
      summary: {
        totalDownloads,
        totalSDKs: Object.keys(sdkStats).length,
        totalSources: Object.keys(sourceStats).length,
        period,
      },
      sdkBreakdown,
      sourceBreakdown,
      timeSeries,
      topVersions,
    })
  } catch (error) {
    console.error("[v0] Error fetching SDK analytics:", error)
    return NextResponse.json({ error: "Failed to fetch SDK analytics" }, { status: 500 })
  }
}
