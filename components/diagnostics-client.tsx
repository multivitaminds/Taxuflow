"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, Server, Shield } from "lucide-react"

interface DiagnosticResult {
  status: "success" | "error" | "warning"
  message: string
  details?: any
  tables?: Record<string, boolean>
  missingTables?: string[]
  error?: string
}

interface DiagnosticsClientProps {
  userEmail?: string | null
}

export default function DiagnosticsClient({ userEmail }: DiagnosticsClientProps) {
  const [supabaseStatus, setSupabaseStatus] = useState<DiagnosticResult | null>(null)
  const [databaseStatus, setDatabaseStatus] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(true)

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const [supabaseRes, databaseRes] = await Promise.all([
        fetch("/api/diagnostics/supabase"),
        fetch("/api/diagnostics/database"),
      ])

      const supabaseData = await supabaseRes.json()
      const databaseData = await databaseRes.json()

      setSupabaseStatus(supabaseData)
      setDatabaseStatus(databaseData)
    } catch (error) {
      console.error("[v0] Diagnostics error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "success") return <CheckCircle2 className="h-6 w-6 text-emerald-500" />
    if (status === "error") return <XCircle className="h-6 w-6 text-red-500" />
    return <AlertCircle className="h-6 w-6 text-amber-500" />
  }

  const calculateHealthScore = () => {
    if (!supabaseStatus || !databaseStatus) return 0
    let score = 0
    if (supabaseStatus.status === "success") score += 50
    if (databaseStatus.status === "success") score += 50
    else if (databaseStatus.status === "warning") score += 35
    return score
  }

  const healthScore = calculateHealthScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl p-8 space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Authenticated: {userEmail}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-white">System Health Monitor</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-orange-200 bg-clip-text text-transparent">
              Platform Diagnostics
            </h1>
            <p className="text-lg text-slate-300">Real-time health checks for Taxu infrastructure</p>
          </div>
          <div>
            <Button onClick={runDiagnostics} disabled={loading}>
              {loading ? <RefreshCw className="h-6 w-6 animate-spin" /> : "Run Diagnostics"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Server className="h-12 w-12 text-emerald-500" />
                <div>
                  <h2 className="text-xl font-bold">Supabase</h2>
                  <p className="text-sm text-slate-400">{supabaseStatus?.message || "No data"}</p>
                </div>
              </div>
              <StatusIcon status={supabaseStatus?.status || "error"} />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Database className="h-12 w-12 text-emerald-500" />
                <div>
                  <h2 className="text-xl font-bold">Database</h2>
                  <p className="text-sm text-slate-400">{databaseStatus?.message || "No data"}</p>
                </div>
              </div>
              <StatusIcon status={databaseStatus?.status || "error"} />
            </div>
          </Card>
        </div>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Health Score: {healthScore}</h2>
          <p className="text-sm text-slate-400">Overall health of the Taxu infrastructure</p>
        </div>
      </div>
    </div>
  )
}
