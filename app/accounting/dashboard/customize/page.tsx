import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardCustomizer } from "@/components/dashboard-customizer"

export default async function DashboardCustomizePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  return <DashboardCustomizer user={user} />
}
