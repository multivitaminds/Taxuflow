import { createBooksServerClient } from "@/lib/supabase/books-server"
import { createClient } from "@/lib/supabase/server"
import { AccountingDashboardClient } from "@/components/accounting-dashboard-client"
import { AccountingMenuGrid } from "@/components/accounting-menu-grid"
import { redirect } from "next/navigation"

export default async function AccountingPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const booksClient = await createBooksServerClient()

  // Fetch dashboard data using user_id instead of org_id
  const [invoicesRes, expensesRes, customersRes] = await Promise.all([
    booksClient.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    booksClient
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_type", "expense")
      .order("entry_date", { ascending: false })
      .limit(10),
    booksClient.from("contacts").select("*").eq("user_id", user.id).eq("contact_type", "customer").limit(10),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Accounting</h1>
        <p className="text-muted-foreground mb-6">Manage your business finances and accounting</p>
        <AccountingMenuGrid />
      </div>

      <AccountingDashboardClient
        user={user}
        invoices={invoicesRes.data || []}
        expenses={expensesRes.data || []}
        customers={customersRes.data || []}
        recentTransactions={[]}
      />
    </div>
  )
}
