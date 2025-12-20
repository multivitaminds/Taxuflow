import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DocumentEditClient } from "@/components/document-edit-client"

export default async function DocumentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch the document
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("user_id", user.id)
    .single()

  if (error || !document) {
    redirect("/dashboard/documents")
  }

  return <DocumentEditClient document={document} />
}
