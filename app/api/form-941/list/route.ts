import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ success: false, filings: [] }, { status: 401 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, filings: [] }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear().toString()

    const { data: filings, error } = await supabase
      .from("form_941_filings")
      .select("*")
      .eq("user_id", user.id)
      .eq("tax_year", year)
      .order("quarter", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching 941 filings:", error)
      return NextResponse.json({ success: false, filings: [], error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      filings: filings || [],
    })
  } catch (error: any) {
    console.error("[v0] Error in form-941/list:", error)
    return NextResponse.json({ success: false, filings: [], error: error.message }, { status: 500 })
  }
}
