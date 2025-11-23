import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { VendorsDashboardClient } from "@/components/vendors-dashboard-client"

export default async function VendorsDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <VendorsDashboardClient user={user} />
}
