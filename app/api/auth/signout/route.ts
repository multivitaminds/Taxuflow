import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    cookieStore.delete("demo_mode")

    const supabase = await createClient()
    await supabase.auth.signOut()

    console.log("[v0] User signed out successfully")
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    return NextResponse.json({ success: true })
  }
}
