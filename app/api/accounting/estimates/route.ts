import { NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"

export async function GET() {
  try {
    const supabase = await createBooksServerClient()

    const { data: estimates, error } = await supabase
      .from("invoices")
      .select("*, customer:contacts!customer_id(*)")
      .eq("status", "draft")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ estimates })
  } catch (error) {
    console.error("Error fetching estimates:", error)
    return NextResponse.json({ error: "Failed to fetch estimates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createBooksServerClient()
    const body = await request.json()

    const { data: estimate, error } = await supabase
      .from("invoices")
      .insert([
        {
          customer_id: body.customer_id,
          invoice_number: body.estimate_number,
          invoice_date: body.estimate_date,
          due_date: body.expiry_date,
          subtotal_amount: body.subtotal,
          tax_amount: body.tax_amount,
          total_amount: body.total_amount,
          status: "draft",
          notes: body.notes,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ estimate }, { status: 201 })
  } catch (error) {
    console.error("Error creating estimate:", error)
    return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 })
  }
}
