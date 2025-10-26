import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await request.json()

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify current password
    const { data: adminUser, error: verifyError } = await supabase.rpc("verify_admin_password", {
      admin_email: email,
      admin_password: currentPassword,
    })

    if (verifyError || !adminUser) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Update password using pgcrypto
    const { error: updateError } = await supabase.rpc("update_admin_password", {
      admin_email: email,
      new_password: newPassword,
    })

    if (updateError) {
      console.error("[v0] Password update error:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Log password change activity
    await supabase.from("admin_activity_logs").insert({
      admin_id: adminUser.id,
      action: "password_change",
      resource_type: "auth",
      details: { email, ip: request.headers.get("x-forwarded-for") || "unknown" },
    })

    return NextResponse.json({ success: true, message: "Password changed successfully" })
  } catch (error) {
    console.error("[v0] Password change error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
