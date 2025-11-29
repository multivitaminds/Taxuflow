import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ deposits: [] }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ deposits: [] }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const taxYear = searchParams.get("tax_year") || new Date().getFullYear().toString()
    const quarter = searchParams.get("quarter") || "1"

    const { data: deposits, error } = await supabase
      .from("eftps_deposits")
      .select("*")
      .eq("user_id", user.id)
      .eq("tax_year", taxYear)
      .eq("quarter", quarter)
      .order("scheduled_date", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching EFTPS deposits:", error)
    }

    return NextResponse.json({
      success: true,
      deposits: deposits || [],
    })
  } catch (error: any) {
    console.error("[v0] Error in eftps/list:", error)
    return NextResponse.json({ deposits: [], error: error.message }, { status: 500 })
  }
}
