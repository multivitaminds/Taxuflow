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

    if (orgContext.hasOrganizationAccess) {
      query = query.in("org_id", orgContext.organizationIds)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (customerId) {
      query = query.eq("customer_id", customerId)
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
      }
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

    const { customer_id, invoice_number, invoice_date, due_date, items, notes, terms } = body

    const targetOrgId = body.org_id || orgContext.organizationId

    if (!targetOrgId) {
      return NextResponse.json({ 
        error: "No organization context. Please create or join an organization first." 
      }, { status: 400 })
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0)
    const tax_amount = subtotal * 0.1 // 10% tax for example
    const total = subtotal + tax_amount

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
        org_id: targetOrgId,
      })
      .select()
      .single()

    if (invoiceError) {
      return handleSupabaseError(invoiceError, {
        operation: "create invoice",
        resource: "invoice",
        details: { customer_id, invoice_number, org_id: targetOrgId },
      })
    }

    // Create invoice items
    const itemsWithInvoiceId = items.map((item: any) => ({
      ...item,
      invoice_id: invoice.id,
    }))

    const { error: itemsError } = await supabase.from("invoice_lines").insert(itemsWithInvoiceId)

    if (itemsError) {
      return handleSupabaseError(itemsError, {
        operation: "add invoice items",
        resource: "invoice item",
        details: { invoice_id: invoice.id },
      })
    }

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error("[v0] Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
