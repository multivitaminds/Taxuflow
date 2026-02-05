import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { applicationId, stepNumber } = body

    if (!applicationId || !stepNumber) {
      return NextResponse.json({ error: "Application ID and step number required" }, { status: 400 })
    }

    console.log(`[v0] Validating step ${stepNumber} for application:`, applicationId)

    // Call validation function
    const { data, error } = await supabase.rpc("validate_registration_step", {
      p_application_id: applicationId,
      p_step_number: stepNumber,
    })

    if (error) {
      console.error("[v0] Validation error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error validating step:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
