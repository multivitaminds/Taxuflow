import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProcessingDocumentsClient } from "@/components/processing-documents-client"

export default async function ProcessingDocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return <ProcessingDocumentsClient user={user} profile={profile} />
}
