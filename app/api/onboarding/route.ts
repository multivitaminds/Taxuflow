import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, filingStatus, incomeType } = await req.json()

    console.log("[v0] Onboarding request:", { name, email, filingStatus, incomeType })

    // Validate input
    if (!name || !email || !filingStatus || !incomeType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    console.log("[v0] Authenticated user:", user.id, user.email)

    const { data: existingProfile, error: checkError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (checkError) {
      console.error("[v0] Error checking profile:", checkError)
    }

    if (existingProfile) {
      console.log("[v0] Profile exists, updating...")
      const { data, error: updateError } = await supabase
        .from("user_profiles")
        .update({
          full_name: name,
          filing_status: filingStatus,
          income_type: incomeType,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()

      if (updateError) {
        console.error("[v0] Update error:", updateError)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
      }

      return NextResponse.json({ success: true, data, updated: true })
    }

    console.log("[v0] Creating new profile...")
    const { data, error } = await supabase
      .from("user_profiles")
      .insert([
        {
          id: user.id,
          full_name: name,
          email: user.email,
          filing_status: filingStatus,
          income_type: incomeType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Insert error:", error)
      return NextResponse.json({ error: "Failed to save onboarding data: " + error.message }, { status: 500 })
    }

    console.log("[v0] Profile created successfully")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
