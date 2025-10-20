import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { createCheckoutSession } from "@/lib/stripe/payments"

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

    const { invoiceId } = await request.json()

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, customers(company_name, email)")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Create Stripe checkout session
    const checkoutUrl = await createCheckoutSession({
      invoiceId: invoice.id,
      amount: invoice.amount,
      description: `Invoice #${invoice.invoice_number} - ${invoice.customers?.company_name || "Customer"}`,
      customerEmail: invoice.customers?.email,
      metadata: {
        user_id: user.id,
        invoice_number: invoice.invoice_number,
      },
    })

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    console.error("[v0] Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 })
  }
}
