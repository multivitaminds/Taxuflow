import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ lookback: null }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ lookback: null }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lookbackYear = searchParams.get("lookback_year") || new Date().getFullYear().toString()

    const { data: lookback, error } = await supabase
      .from("lookback_periods")
      .select("*")
      .eq("user_id", user.id)
      .eq("lookback_year", lookbackYear)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching lookback period:", error)
    }

    return NextResponse.json({
      success: true,
      lookback: lookback || null,
    })
  } catch (error: any) {
    console.error("[v0] Error in lookback/get:", error)
    return NextResponse.json({ lookback: null, error: error.message }, { status: 500 })
  }
}
