"use client"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DiagnosticsClient from "@/components/diagnostics-client"

interface DiagnosticResult {
  status: "success" | "error" | "warning"
  message: string
  details?: any
  tables?: Record<string, boolean>
  missingTables?: string[]
  error?: string
}

export default async function DiagnosticsPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login?redirect=/diagnostics")
  }

  // Optional: Check if user is admin (you can add admin role check here)
  // const { data: profile } = await supabase
  //   .from('user_profiles')
  //   .select('role')
  //   .eq('id', session.user.id)
  //   .single()
  //
  // if (profile?.role !== 'admin') {
  //   redirect('/dashboard')
  // }

  return <DiagnosticsClient userEmail={session.user.email} />
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "success") return <CheckCircle2 className="h-6 w-6 text-emerald-500" />
  if (status === "error") return <XCircle className="h-6 w-6 text-red-500" />
  return <AlertCircle className="h-6 w-6 text-amber-500" />
}

const calculateHealthScore = (supabaseStatus: DiagnosticResult | null, databaseStatus: DiagnosticResult | null) => {
  let score = 0
  if (supabaseStatus?.status === "success") score += 50
  if (databaseStatus?.status === "success") score += 50
  else if (databaseStatus?.status === "warning") score += 35
  return score
}
