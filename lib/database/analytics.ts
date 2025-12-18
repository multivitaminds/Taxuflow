// Enterprise Analytics System
// Provides real-time insights into platform performance and user behavior

import type { SupabaseClient } from "@supabase/supabase-js"

export class AnalyticsEngine {
  constructor(private supabase: SupabaseClient) {}

  async trackUserActivity(userId: string, activityType: string, metadata?: any) {
    // Track user activity for analytics
    await this.supabase.from("audit_log").insert({
      user_id: userId,
      action_type: activityType,
      resource_type: "user_activity",
      action_details: metadata,
      success: true,
    })
  }

  async getUserAnalytics(userId: string) {
    const { data, error } = await this.supabase
      .from("user_analytics")
      .select("*")
      .eq("user_id", userId)
      .order("analytics_date", { ascending: false })
      .limit(30)

    if (error) {
      console.error("[Analytics] Error fetching user analytics:", error)
      return null
    }

    return data
  }

  async getPlatformMetrics() {
    const { data, error } = await this.supabase
      .from("platform_analytics")
      .select("*")
      .order("analytics_date", { ascending: false })
      .limit(30)

    if (error) {
      console.error("[Analytics] Error fetching platform metrics:", error)
      return null
    }

    return data
  }

  async getDashboardSummary(userId: string) {
    const { data, error } = await this.supabase
      .from("user_dashboard_summary")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("[Analytics] Error fetching dashboard summary:", error)
      return null
    }

    return data
  }

  async refreshDashboardCache() {
    // Refresh materialized view for better performance
    await this.supabase.rpc("refresh_dashboard_summary")
  }

  async logQueryPerformance(queryName: string, executionTimeMs: number, userId?: string) {
    await this.supabase.from("query_performance_log").insert({
      query_name: queryName,
      execution_time_ms: executionTimeMs,
      user_id: userId,
    })
  }
}

export class FeatureFlagManager {
  constructor(private supabase: SupabaseClient) {}

  async isFeatureEnabled(featureName: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("is_feature_enabled", {
      p_feature_name: featureName,
      p_user_id: userId,
    })

    if (error) {
      console.error("[FeatureFlags] Error checking feature:", error)
      return false
    }

    return data as boolean
  }

  async enableFeature(featureName: string, rolloutPercentage = 100) {
    await this.supabase.from("feature_flags").upsert({
      feature_name: featureName,
      enabled: true,
      rollout_percentage: rolloutPercentage,
    })
  }

  async disableFeature(featureName: string) {
    await this.supabase
      .from("feature_flags")
      .update({
        enabled: false,
      })
      .eq("feature_name", featureName)
  }
}

export class RateLimiter {
  constructor(private supabase: SupabaseClient) {}

  async checkRateLimit(userId: string, actionType: string, maxRequests: number, windowMinutes = 60): Promise<boolean> {
    const windowStart = new Date()
    const windowEnd = new Date(windowStart.getTime() + windowMinutes * 60 * 1000)

    // Get current count
    const { data, error } = await this.supabase
      .from("rate_limits")
      .select("request_count")
      .eq("user_id", userId)
      .eq("action_type", actionType)
      .gte("window_end", new Date().toISOString())
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" which is okay
      console.error("[RateLimit] Error checking rate limit:", error)
      return false
    }

    if (data && data.request_count >= maxRequests) {
      return false // Rate limit exceeded
    }

    // Increment or create rate limit record
    await this.supabase.from("rate_limits").upsert({
      user_id: userId,
      action_type: actionType,
      request_count: (data?.request_count || 0) + 1,
      window_start: windowStart.toISOString(),
      window_end: windowEnd.toISOString(),
    })

    return true // Within rate limit
  }
}
