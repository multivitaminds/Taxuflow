import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    console.log("[v0] Setting demo mode cookie...")
    
    // Set demo mode cookie
    const cookieStore = await cookies()
    cookieStore.set("demo_mode", "true", {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    console.log("[v0] Demo mode cookie set successfully")
    
    return NextResponse.json({ success: true, message: "Demo mode activated" })
  } catch (error) {
    console.error("[v0] Failed to set demo mode:", error)
    return NextResponse.json(
      { error: "Failed to activate demo mode", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
