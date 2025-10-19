import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const vendorId = searchParams.get("vendor_id")

    let query = supabase
      .from("journal_entries")
      .select(`
        *,
        accounts (
          id,
          name,
          type
        )
      `)
      .eq("entry_type", "expense")
      .order("entry_date", { ascending: false })

    if (vendorId) {
      query = query.eq("contact_id", vendorId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ expenses: data })
  } catch (error: any) {
    console.error("[v0] Error fetching expenses:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()
    const body = await request.json()

    const { data: expense, error } = await supabase
      .from("journal_entries")
      .insert({
        ...body,
        entry_type: "expense",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ expense })
  } catch (error: any) {
    console.error("[v0] Error creating expense:", error)
    return NextResponse.json({ error: error.message || "Failed to create expense" }, { status: 500 })
  }
}
