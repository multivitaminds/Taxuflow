import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProjectsDashboardClient } from "@/components/projects-dashboard-client"

export default async function ProjectsDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <ProjectsDashboardClient user={user} />
}
