import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = Number.parseInt(searchParams.get("year") || new Date().getFullYear().toString())

    // Get all recipients (contractors)
    const { data: recipients, error: recipientsError } = await supabase
      .from("recipients")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)

    if (recipientsError) throw recipientsError

    // Get payments for each contractor for the specified year
    const { data: payments, error: paymentsError } = await supabase
      .from("recipient_payments")
      .select("*")
      .eq("user_id", user.id)
      .gte("payment_date", `${year}-01-01`)
      .lte("payment_date", `${year}-12-31`)

    if (paymentsError) throw paymentsError

    // Get W-9 status for each contractor
    const { data: w9Forms, error: w9Error } = await supabase.from("w9_forms").select("*").eq("user_id", user.id)

    if (w9Error) throw w9Error

    // Combine data
    const contractors = recipients.map((recipient) => {
      const recipientPayments = payments?.filter((p) => p.recipient_id === recipient.id) || []
      const totalPayments = recipientPayments.reduce((sum, p) => sum + Number(p.amount), 0)
      const w9 = w9Forms?.find((w) => w.recipient_id === recipient.id)

      return {
        id: recipient.id,
        first_name: recipient.first_name,
        last_name: recipient.last_name,
        email: recipient.email,
        total_payments: totalPayments,
        payment_count: recipientPayments.length,
        w9_status: w9
          ? w9.status === "verified"
            ? "verified"
            : w9.status === "expired"
              ? "expired"
              : "pending"
          : "missing",
        needs_1099: totalPayments >= 600,
        last_payment_date: recipient.last_payment_date,
      }
    })

    return NextResponse.json({ success: true, contractors })
  } catch (error) {
    console.error("[Contractors API Error]", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch contractors" },
      { status: 500 },
    )
  }
}
