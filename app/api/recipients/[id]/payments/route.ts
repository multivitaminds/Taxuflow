import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { data: payments, error } = await supabase
      .from("recipient_payments")
      .select("*")
      .eq("recipient_id", id)
      .eq("user_id", user.id)
      .order("payment_date", { ascending: false })

    if (error) throw error

    return NextResponse.json({ payments })
  } catch (error) {
    console.error("[v0] Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { amount, paymentDate, description, category } = body

    if (!amount || !paymentDate) {
      return NextResponse.json({ error: "Amount and payment date are required" }, { status: 400 })
    }

    // Insert payment
    const { data: payment, error: paymentError } = await supabase
      .from("recipient_payments")
      .insert({
        recipient_id: id,
        user_id: user.id,
        amount,
        payment_date: paymentDate,
        description,
        category,
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // Update recipient totals
    const { data: recipient } = await supabase
      .from("recipients")
      .select("total_payments, payment_count")
      .eq("id", id)
      .single()

    if (recipient) {
      await supabase
        .from("recipients")
        .update({
          total_payments: (recipient.total_payments || 0) + Number.parseFloat(amount),
          payment_count: (recipient.payment_count || 0) + 1,
          last_payment_date: paymentDate,
        })
        .eq("id", id)
    }

    return NextResponse.json({ payment, success: true })
  } catch (error) {
    console.error("[v0] Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
