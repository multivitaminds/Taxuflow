import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BankingDashboardClient } from "@/components/banking-dashboard-client"

export default async function BankingDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <BankingDashboardClient user={user} />
}
