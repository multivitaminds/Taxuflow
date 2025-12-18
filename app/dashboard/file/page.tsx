import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FileSelectionClient } from "@/components/file-selection-client"

export default async function FilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <FileSelectionClient />
}
