import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete("demo_mode")

    const supabase = await createClient()

    if (supabase) {
      await supabase.auth.signOut()
    }

    const allCookies = cookieStore.getAll()
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith("sb-") || cookie.name.includes("auth") || cookie.name.includes("supabase")) {
        cookieStore.delete(cookie.name)
      }
    })

    console.log("[v0] User signed out successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    // Still return success to allow client-side cleanup
    return NextResponse.json({ success: true })
  }
}
