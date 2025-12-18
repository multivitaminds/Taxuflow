import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { CacheManager } from "@/lib/cache/redis-client"
import { PerformanceMonitor } from "@/lib/monitoring/performance-monitor"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get cache statistics
    const cacheHits = (await CacheManager.get<number>("cache:hits")) || 0
    const cacheMisses = (await CacheManager.get<number>("cache:misses")) || 0
    const cacheHitRatio = cacheHits + cacheMisses > 0 ? cacheHits / (cacheHits + cacheMisses) : 0

    // Get error statistics
    const totalErrors = (await CacheManager.get<number>("errors:total")) || 0

    // Get performance metrics
    const metrics = await PerformanceMonitor.getMetricsSummary()

    // Get database statistics
    const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

    const { count: transactionCount } = await supabase.from("transactions").select("*", { count: "exact", head: true })

    return NextResponse.json({
      cache: {
        hits: cacheHits,
        misses: cacheMisses,
        hitRatio: cacheHitRatio,
      },
      errors: {
        total: totalErrors,
      },
      performance: metrics,
      database: {
        users: userCount || 0,
        transactions: transactionCount || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Monitoring metrics error:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
