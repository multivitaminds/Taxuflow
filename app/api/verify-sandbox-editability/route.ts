import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * API Route to verify that Sandbox data is fully editable
 * Tests CRUD operations on demo data across all 4 platforms
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Call the verification function
    const { data: verification, error } = await supabase.rpc("verify_sandbox_editability", { p_user_id: user.id })

    if (error) {
      console.error("[v0] Verification error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      verification,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tableName, updates } = await request.json()

    if (!tableName || !updates) {
      return NextResponse.json(
        {
          error: "tableName and updates are required",
        },
        { status: 400 },
      )
    }

    // Call the bulk update function
    const { data: result, error } = await supabase.rpc("bulk_update_sandbox_data", {
      p_table_name: tableName,
      p_user_id: user.id,
      p_updates: updates,
    })

    if (error) {
      console.error("[v0] Bulk update error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
