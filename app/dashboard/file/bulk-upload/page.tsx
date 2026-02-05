import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BulkTaxFilingClient } from "@/components/bulk-tax-filing-client"

export default async function BulkUploadPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <BulkTaxFilingClient userId={user.id} />
}
