import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { line_items, ...invoiceData } = body

    // Generate invoice number
    const { data: lastInvoice } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const lastNumber = lastInvoice?.invoice_number ? Number.parseInt(lastInvoice.invoice_number.replace(/\D/g, "")) : 0
    const invoiceNumber = `INV-${String(lastNumber + 1).padStart(5, "0")}`

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        ...invoiceData,
        user_id: user.id,
        invoice_number: invoiceNumber,
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("[v0] Error creating invoice:", invoiceError)
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
    }

    // Create line items
    const lineItemsWithInvoiceId = line_items.map((item: any) => ({
      ...item,
      invoice_id: invoice.id,
    }))

    const { error: itemsError } = await supabase.from("invoice_items").insert(lineItemsWithInvoiceId)

    if (itemsError) {
      console.error("[v0] Error creating line items:", itemsError)
      // Rollback invoice creation
      await supabase.from("invoices").delete().eq("id", invoice.id)
      return NextResponse.json({ error: "Failed to create invoice items" }, { status: 500 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("[v0] Error in invoice creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
