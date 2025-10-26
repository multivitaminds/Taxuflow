import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleApiError, ApiError, ErrorCode } from "@/lib/errors"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new ApiError("Unauthorized", ErrorCode.UNAUTHORIZED)
    }

    // Verify user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (adminError || !adminUser) {
      throw new ApiError("Admin access required", ErrorCode.FORBIDDEN)
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const action = searchParams.get("action")
    const resourceType = searchParams.get("resourceType")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build query
    let query = supabase
      .from("admin_activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (action) {
      query = query.eq("action", action)
    }

    if (resourceType) {
      query = query.eq("resource_type", resourceType)
    }

    const { data: logs, error: logsError, count } = await query

    if (logsError) {
      throw new ApiError(`Failed to fetch audit logs: ${logsError.message}`, ErrorCode.DATABASE_ERROR)
    }

    return NextResponse.json({
      logs,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
