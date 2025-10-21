import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { IncomeClient } from "@/components/income-client"

export default async function IncomePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .in("document_type", ["w2", "1099", "1040"])
    .order("created_at", { ascending: false })

  return <IncomeClient user={user} documents={documents || []} />
}
