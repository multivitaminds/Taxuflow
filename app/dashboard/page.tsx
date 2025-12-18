import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  return <DashboardClient user={user} profile={profile} />
}
