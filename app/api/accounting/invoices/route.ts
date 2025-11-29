import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"
import { handleSupabaseError } from "@/lib/supabase/error-handler"
import { getOrganizationContext } from "@/lib/organization/context"

export async function GET(request: NextRequest) {
  try {
    const orgContext = await getOrganizationContext()

    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createBooksServerClient()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const customerId = searchParams.get("customer_id") || searchParams.get("contact_id")

    let query = supabase
      .from("invoices")
      .select(`
        *,
        contact:contacts!contact_id (
          id,
          display_name,
          email
        )
      `)
      .order("created_at", { ascending: false })

    if (orgContext.hasOrganizationAccess) {
      query = query.in("org_id", orgContext.organizationIds)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (customerId) {
      query = query.eq("contact_id", customerId)
    }

    const { data, error } = await query

    if (error) {
      return handleSupabaseError(error, {
        operation: "fetch invoices",
        resource: "invoice",
      })
    }

    const invoicesWithContext = data.map((invoice: any) => ({
      ...invoice,
      is_organization: !!invoice.org_id,
    }))

    return NextResponse.json({
      invoices: invoicesWithContext,
      context: {
        hasOrganizations: orgContext.hasOrganizationAccess,
        organizationCount: orgContext.organizationIds.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orgContext = await getOrganizationContext()

    if (!orgContext) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createBooksServerClient()
    const body = await request.json()

    console.log("[v0] Received invoice creation request:", body)

    const contactId = body.customer_id || body.contact_id
    const { invoice_number, invoice_date, due_date, items, notes, terms } = body

    if (!contactId) {
      return NextResponse.json(
        {
          error: "Customer/Contact ID is required",
        },
        { status: 400 },
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          error: "At least one line item is required",
        },
        { status: 400 },
      )
    }

    const targetOrgId = body.org_id || orgContext.organizationId

    if (!targetOrgId) {
      return NextResponse.json(
        {
          error: "No organization context. Please create or join an organization first.",
        },
        { status: 400 },
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax

    const finalInvoiceNumber = invoice_number || `INV-${Date.now()}`

    console.log("[v0] Creating invoice with totals:", { subtotal, tax, total })

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        contact_id: contactId,
        number: finalInvoiceNumber,
        issue_date: invoice_date,
        due_date,
        subtotal,
        tax,
        total,
        balance: total,
        status: "draft",
        currency: "USD",
        org_id: targetOrgId,
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("[v0] Error creating invoice:", invoiceError)
      return handleSupabaseError(invoiceError, {
        operation: "create invoice",
        resource: "invoice",
        details: { contact_id: contactId, invoice_number: finalInvoiceNumber, org_id: targetOrgId },
      })
    }

    console.log("[v0] Invoice created:", invoice)

    const itemsWithInvoiceId = items.map((item: any) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: item.amount,
    }))

    const { error: itemsError } = await supabase.from("invoice_lines").insert(itemsWithInvoiceId)

    if (itemsError) {
      console.error("[v0] Error creating invoice items:", itemsError)
      // Rollback: delete the invoice
      await supabase.from("invoices").delete().eq("id", invoice.id)

      return handleSupabaseError(itemsError, {
        operation: "add invoice items",
        resource: "invoice item",
        details: { invoice_id: invoice.id },
      })
    }

    console.log("[v0] Invoice line items created successfully")

    return NextResponse.json({ invoice, success: true })
  } catch (error: any) {
    console.error("[v0] Error creating invoice:", error)
    return NextResponse.json({ error: error.message || "Failed to create invoice" }, { status: 500 })
  }
}
