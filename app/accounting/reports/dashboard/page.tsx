import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReportsDashboardClient } from "@/components/reports-dashboard-client"

export default async function ReportsDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <ReportsDashboardClient user={user} />
}
