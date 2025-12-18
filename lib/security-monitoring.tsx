import { createClient } from "@/lib/supabase/server"

export type SecurityEventType =
  | "auth_failure"
  | "suspicious_upload"
  | "rate_limit_exceeded"
  | "invalid_token"
  | "unauthorized_access"
  | "webhook_verification_failed"

export type SecuritySeverity = "low" | "medium" | "high" | "critical"

interface LogSecurityEventParams {
  eventType: SecurityEventType
  userId?: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, any>
  severity: SecuritySeverity
}

export async function logSecurityEvent(params: LogSecurityEventParams) {
  try {
    const supabase = await createClient()

    await supabase.from("security_events").insert({
      event_type: params.eventType,
      user_id: params.userId || null,
      ip_address: params.ipAddress || null,
      user_agent: params.userAgent || null,
      details: params.details || {},
      severity: params.severity,
      occurred_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Security Monitoring] Failed to log event:", error)
  }
}

export async function checkSuspiciousActivity(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    const { count } = await supabase
      .from("security_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("occurred_at", fiveMinutesAgo)
      .in("severity", ["high", "critical"])

    return (count || 0) > 5
  } catch (error) {
    console.error("[Security Monitoring] Failed to check suspicious activity:", error)
    return false
  }
}
// </CHANGE>
