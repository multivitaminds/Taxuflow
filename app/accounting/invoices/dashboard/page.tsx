import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InvoicesDashboardClient } from "@/components/invoices-dashboard-client"

export default async function InvoicesDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/accounting/invoices/dashboard")
  }

  return <InvoicesDashboardClient user={user} />
}
