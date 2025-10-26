import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import AdminDashboardClient from "@/components/admin-dashboard-client"

export const metadata = {
  title: "Admin Dashboard - Taxu",
  description: "Manage the Taxu platform",
}

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Verify admin access
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("user_id", session.user.id).single()

  if (!adminUser) {
    redirect("/admin/unauthorized")
  }

  return <AdminDashboardClient adminUser={adminUser} />
}
