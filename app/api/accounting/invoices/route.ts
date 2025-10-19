import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const customerId = searchParams.get("customer_id")

    let query = supabase
      .from("invoices")
      .select(`
        *,
        customers:contacts!customer_id (
          id,
          company_name,
          contact_name,
          email
        ),
        invoice_lines:invoice_lines (
          id,
          description,
          quantity,
          unit_price,
          amount
        )
      `)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ invoices: data })
  } catch (error: any) {
    console.error("[v0] Error fetching invoices:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()
    const body = await request.json()

    const { customer_id, invoice_number, invoice_date, due_date, items, notes, terms } = body

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0)
    const tax_amount = subtotal * 0.1 // 10% tax for example
    const total = subtotal + tax_amount

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        customer_id,
        invoice_number,
        invoice_date,
        due_date,
        subtotal_amount: subtotal,
        tax_amount,
        total_amount: total,
        balance_due: total,
        status: "draft",
        notes,
        terms,
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // Create invoice items
    const itemsWithInvoiceId = items.map((item: any) => ({
      ...item,
      invoice_id: invoice.id,
    }))

    const { error: itemsError } = await supabase.from("invoice_lines").insert(itemsWithInvoiceId)

    if (itemsError) throw itemsError

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error("[v0] Error creating invoice:", error)
    return NextResponse.json({ error: error.message || "Failed to create invoice" }, { status: 500 })
  }
}
