import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleError, AuthenticationError, AuthorizationError } from "@/lib/error-handling/handler"
import { hasPermission, type Resource, type Permission } from "@/lib/auth/permissions"

export interface RouteContext {
  req: NextRequest
  userId: string
  organizationId?: string
  user: any
}

export interface RouteConfig {
  requireAuth?: boolean
  requirePermission?: {
    resource: Resource
    permission: Permission
  }
  rateLimit?: {
    maxRequests: number
    windowMs: number
  }
}

export function createRoute<T = any>(
  handler: (context: RouteContext) => Promise<NextResponse<T>>,
  config: RouteConfig = {},
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Check authentication if required
      if (config.requireAuth !== false) {
        const supabase = await createClient()
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          throw new AuthenticationError()
        }

        // Check rate limiting
        if (config.rateLimit) {
          const rateLimitResult = await checkRateLimit(user.id, req.url, config.rateLimit)
          if (!rateLimitResult.allowed) {
            return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
          }
        }

        // Check permissions if required
        if (config.requirePermission) {
          const allowed = await hasPermission(
            user.id,
            config.requirePermission.resource,
            config.requirePermission.permission,
          )

          if (!allowed) {
            throw new AuthorizationError()
          }
        }

        // Get organization context
        const { data: orgMembership } = await supabase
          .from("org_members")
          .select("org_id")
          .eq("user_id", user.id)
          .single()

        // Call the handler with context
        return await handler({
          req,
          userId: user.id,
          organizationId: orgMembership?.org_id,
          user,
        })
      }

      // No auth required - call handler without user context
      return await handler({
        req,
        userId: "",
        user: null,
      })
    } catch (error) {
      return handleError(error)
    }
  }
}

// Rate limiting implementation
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

async function checkRateLimit(
  userId: string,
  endpoint: string,
  config: { maxRequests: number; windowMs: number },
): Promise<{ allowed: boolean }> {
  const key = `${userId}:${endpoint}`
  const now = Date.now()

  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    })
    return { allowed: true }
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false }
  }

  record.count++
  return { allowed: true }
}
