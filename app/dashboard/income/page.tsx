"use client"

import { useState, useEffect } from "react"
import { useDashboard } from "../layout"
import { IncomeClient } from "@/components/income-client"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function IncomePage() {
  const { user } = useDashboard()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      if (!user) return

      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .in("document_type", ["w2", "1099", "1040"])
        .order("created_at", { ascending: false })

      setDocuments(data || [])
      setLoading(false)
    }

    fetchDocuments()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <IncomeClient user={user} documents={documents} />
}
