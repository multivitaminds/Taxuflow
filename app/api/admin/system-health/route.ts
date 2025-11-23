import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { handleApiError, ApiError, ErrorCode } from "@/lib/errors"
import { PlatformMonitor } from "@/lib/monitoring"

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

    const health = await PlatformMonitor.getSystemHealth()

    return NextResponse.json(health)
  } catch (error) {
    return handleApiError(error)
  }
}
