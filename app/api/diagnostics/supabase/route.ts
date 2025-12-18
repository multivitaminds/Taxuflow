import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("[v0] Supabase diagnostics:", { hasUrl, hasKey, hasServiceRole })

    if (!hasUrl || !hasKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing Supabase environment variables",
          details: { hasUrl, hasKey, hasServiceRole },
        },
        { status: 500 },
      )
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to create Supabase client",
        },
        { status: 500 },
      )
    }

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 })
    }

    const { data: tables, error: tablesError } = await supabase.from("user_profiles").select("id").limit(1)

    if (tablesError) {
      console.error("[v0] Database query error:", tablesError)
      return NextResponse.json(
        {
          status: "warning",
          message: "Supabase client created but database query failed",
          error: tablesError.message,
          details: { hasUrl, hasKey, hasServiceRole },
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Supabase connection working",
      details: {
        environmentVariables: { hasUrl, hasKey, hasServiceRole },
        databaseConnection: "OK",
        tablesAccessible: true,
        hasSession: !!session,
        user: session?.user?.email || "No user logged in",
      },
    })
  } catch (error: any) {
    console.error("[v0] Supabase diagnostics error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Diagnostic check failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
