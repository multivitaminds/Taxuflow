import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"

export async function GET() {
  try {
    const supabase = await createBooksServerClient()

    const { data, error } = await supabase
      .from("contacts")
      .select(`
        *,
        bills:bills!vendor_id (
          id,
          total_amount,
          balance_due,
          status
        )
      `)
      .eq("contact_type", "vendor")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ vendors: data })
  } catch (error: any) {
    console.error("[v0] Error fetching vendors:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()
    const body = await request.json()

    const { data: vendor, error } = await supabase
      .from("contacts")
      .insert({
        ...body,
        contact_type: "vendor",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ vendor })
  } catch (error: any) {
    console.error("[v0] Error creating vendor:", error)
    return NextResponse.json({ error: error.message || "Failed to create vendor" }, { status: 500 })
  }
}
