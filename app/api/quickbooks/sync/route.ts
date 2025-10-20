import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { quickbooksRequest } from "@/lib/quickbooks/oauth"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Starting QuickBooks sync for user:", user.id)

    // Sync Customers
    const customersData = await quickbooksRequest(user.id, "/query?query=SELECT * FROM Customer")
    const customers = customersData.QueryResponse.Customer || []

    for (const customer of customers) {
      await supabase.from("customers").upsert({
        user_id: user.id,
        qbo_id: customer.Id,
        company_name: customer.CompanyName || customer.DisplayName,
        contact_name: customer.DisplayName,
        email: customer.PrimaryEmailAddr?.Address,
        phone: customer.PrimaryPhone?.FreeFormNumber,
        address: customer.BillAddr?.Line1,
        city: customer.BillAddr?.City,
        state: customer.BillAddr?.CountrySubDivisionCode,
        zip: customer.BillAddr?.PostalCode,
        synced_at: new Date().toISOString(),
      })
    }

    // Sync Invoices
    const invoicesData = await quickbooksRequest(user.id, "/query?query=SELECT * FROM Invoice")
    const invoices = invoicesData.QueryResponse.Invoice || []

    for (const invoice of invoices) {
      await supabase.from("invoices").upsert({
        user_id: user.id,
        qbo_id: invoice.Id,
        customer_id: invoice.CustomerRef.value,
        invoice_number: invoice.DocNumber,
        invoice_date: invoice.TxnDate,
        due_date: invoice.DueDate,
        amount: invoice.TotalAmt,
        status: invoice.Balance === 0 ? "paid" : "unpaid",
        synced_at: new Date().toISOString(),
      })
    }

    // Sync Vendors
    const vendorsData = await quickbooksRequest(user.id, "/query?query=SELECT * FROM Vendor")
    const vendors = vendorsData.QueryResponse.Vendor || []

    for (const vendor of vendors) {
      await supabase.from("vendors").upsert({
        user_id: user.id,
        qbo_id: vendor.Id,
        company_name: vendor.CompanyName || vendor.DisplayName,
        contact_name: vendor.DisplayName,
        email: vendor.PrimaryEmailAddr?.Address,
        phone: vendor.PrimaryPhone?.FreeFormNumber,
        synced_at: new Date().toISOString(),
      })
    }

    console.log("[v0] QuickBooks sync completed successfully")

    return NextResponse.json({
      success: true,
      synced: {
        customers: customers.length,
        invoices: invoices.length,
        vendors: vendors.length,
      },
    })
  } catch (error) {
    console.error("[v0] QuickBooks sync error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Sync failed" }, { status: 500 })
  }
}
