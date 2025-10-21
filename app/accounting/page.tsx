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

  const booksClient = await createBooksServerClient()

  // Get user's organization
  const { data: orgMember } = await booksClient
    .from("org_members")
    .select("org_id, organizations(*)")
    .eq("user_id", user.id)
    .single()

  if (!orgMember) {
    // Create default organization for user
    const { data: newOrg } = await booksClient
      .from("organizations")
      .insert({ name: `${user.email}'s Organization` })
      .select()
      .single()

    if (newOrg) {
      await booksClient.from("org_members").insert({ org_id: newOrg.id, user_id: user.id, role: "owner" })
    }
  }

  const orgId = orgMember?.org_id

  // Fetch dashboard data
  const [invoicesRes, expensesRes, customersRes] = await Promise.all([
    booksClient.from("invoices").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(10),
    booksClient
      .from("journal_entries")
      .select("*")
      .eq("org_id", orgId)
      .eq("entry_type", "expense")
      .order("entry_date", { ascending: false })
      .limit(10),
    booksClient.from("contacts").select("*").eq("org_id", orgId).eq("kind", "customer").limit(10),
  ])

  return (
    <AccountingDashboardClient
      user={user}
      invoices={invoicesRes.data || []}
      expenses={expensesRes.data || []}
      customers={customersRes.data || []}
      recentTransactions={[]}
    />
  )
}
