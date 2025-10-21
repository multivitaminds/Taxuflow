import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProcessedDocumentsClient } from "@/components/processed-documents-client"

export default async function ProcessedDocumentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  return <ProcessedDocumentsClient user={user} profile={profile} />
}
