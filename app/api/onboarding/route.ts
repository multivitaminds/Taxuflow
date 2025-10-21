import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, filingStatus, incomeType } = await req.json()

    // Validate input
    if (!name || !email || !filingStatus || !incomeType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: existingProfile } = await supabase.from("user_profiles").select("id").eq("email", email).maybeSingle()

    if (existingProfile) {
      return NextResponse.json({ error: "User profile already exists" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .insert([
        {
          full_name: name,
          email,
          filing_status: filingStatus,
          income_type: incomeType,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to save onboarding data" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
