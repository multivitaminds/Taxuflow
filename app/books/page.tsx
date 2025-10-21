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

  // Fetch invoices using user_id
  const { data: invoices = [] } = await booksClient
    .from("invoices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch expenses using user_id
  const { data: expenses = [] } = await booksClient
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("entry_type", "expense")
    .order("entry_date", { ascending: false })
    .limit(10)

  // Fetch customers using user_id
  const { data: customers = [] } = await booksClient
    .from("contacts")
    .select("*")
    .eq("user_id", user.id)
    .eq("contact_type", "customer")
    .order("created_at", { ascending: false })

  // Format recent transactions
  const recentTransactions = [
    ...invoices.map((inv: any) => ({
      id: inv.id,
      type: "invoice",
      description: `Invoice ${inv.invoice_number || inv.id}`,
      amount: inv.total_amount,
      date: inv.invoice_date,
      status: inv.status,
    })),
    ...expenses.map((exp: any) => ({
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
      invoices={invoices}
      expenses={expenses}
      customers={customers}
      recentTransactions={recentTransactions}
    />
  )
}
