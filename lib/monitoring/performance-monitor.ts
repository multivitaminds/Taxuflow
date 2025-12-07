import { CacheManager } from "../cache/redis-client"

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export class PerformanceMonitor {
  /**
   * Track API response time
   */
  static async trackAPIResponseTime(endpoint: string, duration: number, status: number): Promise<void> {
    const metric: PerformanceMetric = {
      name: "api_response_time",
      value: duration,
      timestamp: Date.now(),
      tags: { endpoint, status: status.toString() },
    }

    await this.recordMetric(metric)
  }

  /**
   * Track database query performance
   */
  static async trackDatabaseQuery(query: string, duration: number, success: boolean): Promise<void> {
    const metric: PerformanceMetric = {
      name: "db_query_time",
      value: duration,
      timestamp: Date.now(),
      tags: { query, success: success.toString() },
    }

    await this.recordMetric(metric)
  }

  /**
   * Track cache hit/miss ratio
   */
  static async trackCacheHit(key: string, hit: boolean): Promise<void> {
    const cacheKey = hit ? "cache:hits" : "cache:misses"
    await CacheManager.increment(cacheKey)
  }

  /**
   * Track error rates
   */
  static async trackError(type: string, message: string, stack?: string): Promise<void> {
    await CacheManager.increment("errors:total")
    await CacheManager.increment(`errors:${type}`)

    // Store recent errors
    const errorKey = `error:${Date.now()}`
    await CacheManager.setWithExpiry(
      errorKey,
      { type, message, stack, timestamp: Date.now() },
      3600, // Keep for 1 hour
    )
  }

  /**
   * Get performance metrics summary
   */
  static async getMetricsSummary(): Promise<{
    apiResponseTime: number
    dbQueryTime: number
    cacheHitRatio: number
    errorRate: number
  }> {
    // This would integrate with a real monitoring service
    // For now, return sample data
    return {
      apiResponseTime: 250,
      dbQueryTime: 50,
      cacheHitRatio: 0.85,
      errorRate: 0.02,
    }
  }

  /**
   * Record metric to storage
   */
  private static async recordMetric(metric: PerformanceMetric): Promise<void> {
    const key = `metrics:${metric.name}:${Date.now()}`
    await CacheManager.setWithExpiry(key, metric, 86400) // Keep for 24 hours
  }

  /**
   * Track page load performance
   */
  static trackPageLoad(
    page: string,
    metrics: {
      fcp?: number // First Contentful Paint
      lcp?: number // Largest Contentful Paint
      fid?: number // First Input Delay
      cls?: number // Cumulative Layout Shift
      ttfb?: number // Time to First Byte
    },
  ): void {
    if (typeof window === "undefined") return

    Object.entries(metrics).forEach(([name, value]) => {
      if (value !== undefined) {
        console.log(`[v0] Performance metric ${name} for ${page}:`, value)
      }
    })
  }
}
