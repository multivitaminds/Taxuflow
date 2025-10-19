import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountingDashboardClient } from "@/components/accounting-dashboard-client"

export default async function BooksPage() {
  const supabase = await createServerClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Fetch invoices
  const { data: invoices = [] } = await supabase
    .from("invoices")
    .select(`
      *,
      contact:contacts(name, email, company_name)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch expenses (from journal_entries with type='expense')
  const { data: expenses = [] } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("entry_type", "expense")
    .order("entry_date", { ascending: false })
    .limit(10)

  // Fetch customers (contacts with type='customer')
  const { data: customers = [] } = await supabase
    .from("contacts")
    .select("*")
    .eq("contact_type", "customer")
    .order("created_at", { ascending: false })

  // Format recent transactions
  const recentTransactions = [
    ...invoices.map((inv) => ({
      id: inv.id,
      type: "invoice",
      description: `Invoice ${inv.invoice_number}`,
      amount: inv.total_amount,
      date: inv.invoice_date,
      status: inv.status,
    })),
    ...expenses.map((exp) => ({
      id: exp.id,
      type: "expense",
      description: exp.description || "Expense",
      amount: exp.total_amount,
      date: exp.entry_date,
      status: "completed",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <AccountingDashboardClient
      user={user}
      invoices={invoices}
      expenses={expenses}
      customers={customers}
      recentTransactions={recentTransactions}
    />
  )
}
