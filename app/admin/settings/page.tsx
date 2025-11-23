import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminSettingsClient from "@/components/admin-settings-client"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Get admin user from admin_users table
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

  if (!adminUser) {
    redirect("/admin/unauthorized")
  }

  return <AdminSettingsClient adminUser={adminUser} />
}
