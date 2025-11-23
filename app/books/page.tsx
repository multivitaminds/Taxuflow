import { createBooksServerClient } from "@/lib/supabase/books-server"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AccountingDashboardClient } from "@/components/accounting-dashboard-client"

export default async function BooksPage() {
  const supabase = await createClient()
  const booksClient = await createBooksServerClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Fetch invoices using user_id with error handling
  const { data: invoices, error: invoicesError } = await booksClient
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  console.log("[v0] Invoices query result:", { invoices, error: invoicesError })

  // Fetch expenses using user_id with error handling
  const { data: expenses, error: expensesError } = await booksClient
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
    .limit(10)

  console.log("[v0] Expenses query result:", { expenses, error: expensesError })

  // Fetch customers using user_id with error handling
  const { data: customers, error: customersError } = await booksClient
    .from("contacts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  console.log("[v0] Customers query result:", { customers, error: customersError })

  // Use empty arrays as fallback if queries fail
  const safeInvoices = invoices || []
  const safeExpenses = expenses || []
  const safeCustomers = customers || []

  // Format recent transactions with safe data
  const recentTransactions = [
    ...safeInvoices.map((inv: any) => ({
      id: inv.id,
      type: "invoice",
      description: `Invoice ${inv.invoice_number || inv.id}`,
      amount: inv.total_amount,
      date: inv.invoice_date,
      status: inv.status,
    })),
    ...safeExpenses.map((exp: any) => ({
      id: exp.id,
      type: "expense",
      description: exp.description || "Expense",
      amount: exp.amount,
      date: exp.entry_date,
      status: "completed",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <AccountingDashboardClient
      user={user}
      invoices={safeInvoices}
      expenses={safeExpenses}
      customers={safeCustomers}
      recentTransactions={recentTransactions}
    />
  )
}
