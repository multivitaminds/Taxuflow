import { createClient } from "@/lib/supabase/server"

export class PlatformMonitor {
  static async updateDailyMetrics(): Promise<void> {
    try {
      const supabase = await createClient()
      const today = new Date().toISOString().split("T")[0]

      // Get total users
      const { count: totalUsers } = await supabase.from("user_profiles").select("*", { count: "exact", head: true })

      // Get new users today
      const { count: newUsers } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today)

      // Get active users today (users who logged in)
      const { count: activeUsers } = await supabase
        .from("admin_activity_logs")
        .select("*", { count: "exact", head: true })
        .eq("action", "login")
        .gte("created_at", today)

      // Get total filings today
      const { count: totalFilings } = await supabase
        .from("tax_filings")
        .select("*", { count: "exact", head: true })
        .gte("filed_at", today)

      // Get successful filings
      const { count: successfulFilings } = await supabase
        .from("tax_filings")
        .select("*", { count: "exact", head: true })
        .eq("filing_status", "accepted")
        .gte("filed_at", today)

      // Get failed filings
      const { count: failedFilings } = await supabase
        .from("tax_filings")
        .select("*", { count: "exact", head: true })
        .in("filing_status", ["rejected", "error"])
        .gte("filed_at", today)

      // Upsert daily metrics
      await supabase.from("platform_analytics").upsert({
        date: today,
        total_users: totalUsers || 0,
        new_users: newUsers || 0,
        active_users: activeUsers || 0,
        total_filings: totalFilings || 0,
        successful_filings: successfulFilings || 0,
        failed_filings: failedFilings || 0,
        updated_at: new Date().toISOString(),
      })

      console.log("[v0] Daily metrics updated successfully")
    } catch (error) {
      console.error("[v0] Failed to update daily metrics:", error)
    }
  }

  static async getSystemHealth(): Promise<{
    status: "healthy" | "degraded" | "down"
    checks: Record<string, boolean>
  }> {
    const checks: Record<string, boolean> = {}

    try {
      const supabase = await createClient()

      // Check database connection
      const { error: dbError } = await supabase.from("user_profiles").select("id").limit(1)
      checks.database = !dbError

      // Check if there are recent failed filings
      const { count: recentFailures } = await supabase
        .from("tax_filings")
        .select("*", { count: "exact", head: true })
        .eq("filing_status", "error")
        .gte("filed_at", new Date(Date.now() - 3600000).toISOString()) // Last hour

      checks.filingSystem = (recentFailures || 0) < 10

      // Check if there are recent security incidents
      const { count: securityIncidents } = await supabase
        .from("security_logs")
        .select("*", { count: "exact", head: true })
        .eq("severity", "critical")
        .gte("created_at", new Date(Date.now() - 3600000).toISOString())

      checks.security = (securityIncidents || 0) === 0

      const allHealthy = Object.values(checks).every((check) => check)
      const someUnhealthy = Object.values(checks).some((check) => !check)

      return {
        status: allHealthy ? "healthy" : someUnhealthy ? "degraded" : "down",
        checks,
      }
    } catch (error) {
      console.error("[v0] Health check failed:", error)
      return {
        status: "down",
        checks: { ...checks, error: false },
      }
    }
  }
}
