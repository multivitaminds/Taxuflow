import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AllDocumentsClient } from "@/components/all-documents-client"

export default async function AllDocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <AllDocumentsClient user={user} profile={profile} />
}
