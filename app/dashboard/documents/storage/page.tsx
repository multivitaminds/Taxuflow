import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StorageDetailsClient } from "@/components/storage-details-client"

export default async function StorageDetailsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <StorageDetailsClient user={user} profile={profile} />
}
