import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FilingDashboardClient } from "@/components/filing-dashboard-client"

export default async function FilingDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login?redirect=/dashboard/filing")
  }

  // Fetch all filings for the user
  const { data: filings, error: filingsError } = await supabase
    .from("tax_filings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (filingsError) {
    console.error("[v0] Error fetching filings:", filingsError)
  }

  return <FilingDashboardClient user={user} filings={filings || []} />
}
