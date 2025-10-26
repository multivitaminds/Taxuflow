import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const rateLimitKey = `${email}:${clientIp}`
    const now = Date.now()

    const attempts = loginAttempts.get(rateLimitKey)
    if (attempts) {
      if (now < attempts.resetAt) {
        if (attempts.count >= MAX_ATTEMPTS) {
          return NextResponse.json(
            {
              error: "Too many login attempts. Please try again in 15 minutes.",
            },
            { status: 429 },
          )
        }
      } else {
        // Reset counter after lockout duration
        loginAttempts.delete(rateLimitKey)
      }
    }

    const supabase = await createClient()

    // Query admin_users table and verify password using pgcrypto
    const { data: adminUser, error } = await supabase.rpc("verify_admin_password", {
      admin_email: email,
      admin_password: password,
    })

    if (error || !adminUser) {
      const currentAttempts = loginAttempts.get(rateLimitKey) || { count: 0, resetAt: now + LOCKOUT_DURATION }
      loginAttempts.set(rateLimitKey, {
        count: currentAttempts.count + 1,
        resetAt: currentAttempts.resetAt,
      })

      console.error("[v0] Admin login error:", error)
      return NextResponse.json({ error: "Invalid login credentials" }, { status: 401 })
    }

    // Check if admin is active
    if (!adminUser.is_active) {
      return NextResponse.json({ error: "Admin account is disabled" }, { status: 403 })
    }

    loginAttempts.delete(rateLimitKey)

    // Log admin login activity
    await supabase.from("admin_activity_logs").insert({
      admin_id: adminUser.id,
      action: "login",
      resource_type: "auth",
      details: { email, ip: clientIp },
    })

    // Update last login timestamp
    await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", adminUser.id)

    // Return admin user data (excluding password_hash)
    const { password_hash, ...adminData } = adminUser

    return NextResponse.json({
      success: true,
      admin: adminData,
    })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
