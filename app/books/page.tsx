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

  // Get user's organization
  const { data: orgMember } = await booksClient.from("org_members").select("org_id").eq("user_id", user.id).single()

  const orgId = orgMember?.org_id

  if (!orgId) {
    // Create default organization for user
    const { data: newOrg } = await booksClient
      .from("organizations")
      .insert({ name: `${user.email}'s Books` })
      .select()
      .single()

    if (newOrg) {
      await booksClient.from("org_members").insert({ org_id: newOrg.id, user_id: user.id, role: "owner" })
    }
  }

  // Fetch invoices
  const { data: invoices = [] } = await booksClient
    .from("invoices")
    .select(`
      *,
      contact:contacts(display_name, email)
    `)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch expenses
  const { data: expenses = [] } = await booksClient
    .from("journal_entries")
    .select("*")
    .eq("org_id", orgId)
    .eq("entry_type", "expense")
    .order("date", { ascending: false })
    .limit(10)

  // Fetch customers
  const { data: customers = [] } = await booksClient
    .from("contacts")
    .select("*")
    .eq("org_id", orgId)
    .eq("kind", "customer")
    .order("created_at", { ascending: false })

  // Format recent transactions
  const recentTransactions = [
    ...invoices.map((inv: any) => ({
      id: inv.id,
      type: "invoice",
      description: `Invoice ${inv.number}`,
      amount: inv.total,
      date: inv.issue_date,
      status: inv.status,
    })),
    ...expenses.map((exp: any) => ({
      id: exp.id,
      type: "expense",
      description: exp.memo || "Expense",
      amount: exp.total_amount,
      date: exp.date,
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
