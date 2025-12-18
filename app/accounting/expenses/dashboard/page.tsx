import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ExpensesDashboardClient } from "@/components/expenses-dashboard-client"

export default async function ExpensesDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/accounting/expenses/dashboard")
  }

  return <ExpensesDashboardClient user={user} />
}
