import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ safeHarbor: null }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ safeHarbor: null }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taxYear = searchParams.get("tax_year") || new Date().getFullYear().toString()
    const quarter = searchParams.get("quarter") || "1"

    const { data: safeHarbor, error } = await supabase
      .from("safe_harbor_tracking")
      .select("*")
      .eq("user_id", user.id)
      .eq("tax_year", taxYear)
      .eq("quarter", quarter)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching safe harbor:", error)
    }

    return NextResponse.json({
      success: true,
      safeHarbor: safeHarbor || null,
    })
  } catch (error: any) {
    console.error("[v0] Error in safe-harbor/get:", error)
    return NextResponse.json({ safeHarbor: null, error: error.message }, { status: 500 })
  }
}
