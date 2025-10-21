import { type NextRequest, NextResponse } from "next/server"
import { createBooksServerClient } from "@/lib/supabase/books-server"

export async function GET() {
  try {
    const supabase = await createBooksServerClient()

    const { data, error } = await supabase
      .from("contacts")
      .select(`
        *,
        invoices:invoices!customer_id (
          id,
          total_amount,
          balance_due,
          status
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Calculate customer stats
    const customersWithStats = data.map((customer: any) => {
      const totalRevenue = customer.invoices.reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0)
      const outstandingBalance = customer.invoices.reduce((sum: number, inv: any) => sum + (inv.balance_due || 0), 0)
      const invoiceCount = customer.invoices.length

      return {
        ...customer,
        total_revenue: totalRevenue,
        outstanding_balance: outstandingBalance,
        invoice_count: invoiceCount,
      }
    })

    return NextResponse.json({ customers: customersWithStats })
  } catch (error: any) {
    console.error("[v0] Error fetching customers:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createBooksServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("[v0] Creating customer - User:", user?.id)

    if (authError || !user) {
      console.error("[v0] Authentication error:", authError)
      return NextResponse.json({ error: "You must be logged in to create a customer" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Customer data received:", body)

    if (!body.contact_name || !body.email) {
      return NextResponse.json({ error: "Customer name and email are required" }, { status: 400 })
    }

    const customerData = {
      contact_name: body.contact_name,
      company_name: body.company_name || null,
      email: body.email,
      phone: body.phone || null,
      tax_id: body.tax_id || null,
      contact_type: body.contact_type || "customer",
      user_id: user.id,
    }

    console.log("[v0] Inserting customer with data:", customerData)

    const { data: customer, error } = await supabase.from("contacts").insert(customerData).select().single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: error.message || "Database error occurred" }, { status: 500 })
    }

    console.log("[v0] Customer created successfully:", customer)
    return NextResponse.json({ customer }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Error creating customer:", error)
    return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 500 })
  }
}
