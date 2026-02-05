"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createInvoice(data: {
  customer_id: string
  invoice_number: string
  amount: number
  due_date: string
  status: "draft" | "sent" | "paid" | "overdue"
  items: Array<{ description: string; quantity: number; rate: number; amount: number }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    customer_id: data.customer_id,
    invoice_number: data.invoice_number,
    amount: data.amount,
    due_date: data.due_date,
    status: data.status,
    items: data.items,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error creating invoice:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/accounting/invoices")
  return { success: true }
}

export async function createExpense(data: {
  vendor_id?: string
  category: string
  amount: number
  date: string
  description: string
  receipt_url?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    vendor_id: data.vendor_id,
    category: data.category,
    amount: data.amount,
    expense_date: data.date,
    description: data.description,
    receipt_url: data.receipt_url,
    status: "pending",
  })

  if (error) {
    console.error("[v0] Error creating expense:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/accounting/expenses")
  return { success: true }
}

export async function createCustomer(data: {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("customers").insert({
    user_id: user.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    address: data.address,
  })

  if (error) {
    console.error("[v0] Error creating customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/accounting/customers")
  return { success: true }
}

export async function createVendor(data: {
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("vendors").insert({
    user_id: user.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    address: data.address,
  })

  if (error) {
    console.error("[v0] Error creating vendor:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/accounting/vendors")
  return { success: true }
}

export async function createBill(data: {
  vendor_id: string
  bill_number: string
  bill_date: string
  due_date: string
  total_amount: number
  status: "draft" | "open"
  items: Array<{ description: string; quantity: number; rate: number; amount: number }>
  notes?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase.from("bills").insert({
    user_id: user.id,
    vendor_id: data.vendor_id,
    bill_number: data.bill_number,
    bill_date: data.bill_date,
    due_date: data.due_date,
    total_amount: data.total_amount,
    amount_paid: 0,
    status: data.status,
    items: data.items,
    notes: data.notes,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error creating bill:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/accounting/bills")
  return { success: true }
}
