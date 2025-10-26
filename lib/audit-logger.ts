import { createClient } from "@/lib/supabase/server"

export enum AuditAction {
  // Authentication
  LOGIN = "login",
  LOGOUT = "logout",
  PASSWORD_CHANGE = "password_change",
  PASSWORD_RESET = "password_reset",

  // User Management
  USER_CREATE = "user_create",
  USER_UPDATE = "user_update",
  USER_DELETE = "user_delete",
  USER_VIEW = "user_view",

  // Filing Operations
  FILING_CREATE = "filing_create",
  FILING_SUBMIT = "filing_submit",
  FILING_UPDATE = "filing_update",
  FILING_DELETE = "filing_delete",
  FILING_VIEW = "filing_view",

  // Document Operations
  DOCUMENT_UPLOAD = "document_upload",
  DOCUMENT_DELETE = "document_delete",
  DOCUMENT_VIEW = "document_view",

  // Payment Operations
  PAYMENT_CREATE = "payment_create",
  PAYMENT_REFUND = "payment_refund",

  // Integration Operations
  INTEGRATION_CONNECT = "integration_connect",
  INTEGRATION_DISCONNECT = "integration_disconnect",
  INTEGRATION_SYNC = "integration_sync",

  // Admin Operations
  ADMIN_CREATE = "admin_create",
  ADMIN_UPDATE = "admin_update",
  ADMIN_DELETE = "admin_delete",
  SETTINGS_UPDATE = "settings_update",

  // Security Events
  UNAUTHORIZED_ACCESS = "unauthorized_access",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
}

export enum ResourceType {
  USER = "user",
  FILING = "filing",
  DOCUMENT = "document",
  PAYMENT = "payment",
  ADMIN = "admin",
  INTEGRATION = "integration",
  SETTINGS = "settings",
}

interface AuditLogEntry {
  action: AuditAction
  resourceType?: ResourceType
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export class AuditLogger {
  private static async getClientInfo(request?: Request) {
    if (!request) return { ipAddress: undefined, userAgent: undefined }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"

    const userAgent = request.headers.get("user-agent") || "unknown"

    return { ipAddress, userAgent }
  }

  static async log(userId: string, entry: AuditLogEntry, request?: Request): Promise<void> {
    try {
      const supabase = await createClient()
      const { ipAddress, userAgent } = await this.getClientInfo(request)

      // Get admin user ID if this is an admin action
      const { data: adminUser } = await supabase.from("admin_users").select("id").eq("user_id", userId).single()

      await supabase.from("admin_activity_logs").insert({
        admin_id: adminUser?.id || userId,
        action: entry.action,
        resource_type: entry.resourceType,
        resource_id: entry.resourceId,
        details: entry.details,
        ip_address: ipAddress || entry.ipAddress,
        user_agent: userAgent || entry.userAgent,
      })

      console.log("[v0] Audit log created:", {
        userId,
        action: entry.action,
        resourceType: entry.resourceType,
      })
    } catch (error) {
      console.error("[v0] Failed to create audit log:", error)
    }
  }

  static async logSecurityEvent(action: AuditAction, details: Record<string, any>, request?: Request): Promise<void> {
    try {
      const supabase = await createClient()
      const { ipAddress, userAgent } = await this.getClientInfo(request)

      await supabase.from("security_logs").insert({
        event_type: action,
        details,
        ip_address: ipAddress,
        user_agent: userAgent,
      })

      console.log("[v0] Security event logged:", action)
    } catch (error) {
      console.error("[v0] Failed to log security event:", error)
    }
  }
}
