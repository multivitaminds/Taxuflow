import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CustomersDashboardClient } from "@/components/customers-dashboard-client"

export default async function CustomersDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/accounting/customers/dashboard")
  }

  return <CustomersDashboardClient user={user} />
}
