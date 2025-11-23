import { createBooksServerClient } from "@/lib/supabase/books-server"
import { createClient } from "@/lib/supabase/server"
import { AccountingDashboardClient } from "@/components/accounting-dashboard-client"
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

  try {
    const booksClient = await createBooksServerClient()

    const [invoicesRes, expensesRes, customersRes, revenueRes] = await Promise.all([
      booksClient
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      booksClient
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_type", "expense")
        .order("entry_date", { ascending: false })
        .limit(10),
      booksClient.from("contacts").select("*").eq("user_id", user.id).eq("contact_type", "customer").limit(10),
      booksClient.from("invoices").select("total_amount, status, created_at").eq("user_id", user.id),
    ])

    return (
      <AccountingDashboardClient
        user={user}
        invoices={invoicesRes.data || []}
        expenses={expensesRes.data || []}
        customers={customersRes.data || []}
        allInvoices={revenueRes.data || []}
      />
    )
  } catch (error) {
    console.error("Error fetching accounting data:", error)
    // Return empty dashboard instead of crashing
    return <AccountingDashboardClient user={user} invoices={[]} expenses={[]} customers={[]} allInvoices={[]} />
  }
}
