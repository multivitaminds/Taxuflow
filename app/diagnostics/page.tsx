"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Database, Server, Key } from "lucide-react"

interface DiagnosticResult {
  status: "success" | "error" | "warning"
  message: string
  details?: any
  tables?: Record<string, boolean>
  missingTables?: string[]
  error?: string
}

export default function DiagnosticsPage() {
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
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-white">System Health Monitor</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-orange-200 bg-clip-text text-transparent">
              Platform Diagnostics
            </h1>
            <p className="text-lg text-slate-300">Real-time health checks for Taxu infrastructure</p>

            <div className="flex items-center gap-4 mt-6">
              <div className="relative h-24 w-24">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${healthScore * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{healthScore}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-400">Overall Health</div>
                <div className="text-xl font-semibold text-white">
                  {healthScore === 100 ? "Excellent" : healthScore >= 50 ? "Good" : "Needs Attention"}
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={runDiagnostics}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white border-0 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Diagnostics
          </Button>
        </div>

        <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <div className="relative p-8">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30">
                <Server className="h-8 w-8 text-purple-300" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {supabaseStatus && <StatusIcon status={supabaseStatus.status} />}
                  <h2 className="text-2xl font-bold text-white">Supabase Connection</h2>
                </div>
                <p className="text-slate-300 text-lg">
                  {loading ? "Running diagnostics..." : supabaseStatus?.message || "Not checked"}
                </p>

                {supabaseStatus?.details && (
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Environment Variables
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { key: "hasUrl", label: "NEXT_PUBLIC_SUPABASE_URL" },
                          { key: "hasKey", label: "NEXT_PUBLIC_SUPABASE_ANON_KEY" },
                          { key: "hasServiceRole", label: "SUPABASE_SERVICE_ROLE_KEY" },
                        ].map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                          >
                            {supabaseStatus.details.environmentVariables?.[key] ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-sm text-slate-300 font-mono">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {supabaseStatus.details.databaseConnection && (
                      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-400/30">
                        <h3 className="font-semibold text-emerald-300 mb-1">Database Connection</h3>
                        <p className="text-sm text-emerald-200">{supabaseStatus.details.databaseConnection}</p>
                      </div>
                    )}

                    {supabaseStatus.details.user && (
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30">
                        <h3 className="font-semibold text-blue-300 mb-1">Current User</h3>
                        <p className="text-sm text-blue-200">{supabaseStatus.details.user}</p>
                      </div>
                    )}
                  </div>
                )}

                {supabaseStatus?.error && (
                  <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-400/30">
                    <strong className="text-red-300">Error:</strong>
                    <p className="text-sm text-red-200 mt-1">{supabaseStatus.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
          <div className="relative p-8">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30">
                <Database className="h-8 w-8 text-orange-300" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {databaseStatus && <StatusIcon status={databaseStatus.status} />}
                  <h2 className="text-2xl font-bold text-white">Database Schema</h2>
                </div>
                <p className="text-slate-300 text-lg">
                  {loading ? "Checking tables..." : databaseStatus?.message || "Not checked"}
                </p>

                {databaseStatus?.tables && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-white mb-3">Tables Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(databaseStatus.tables).map(([table, exists]) => (
                        <div
                          key={table}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                            exists
                              ? "bg-emerald-500/10 border-emerald-400/30 hover:bg-emerald-500/20"
                              : "bg-red-500/10 border-red-400/30 hover:bg-red-500/20"
                          }`}
                        >
                          {exists ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                          )}
                          <span className={`text-sm font-mono ${exists ? "text-emerald-200" : "text-red-200"}`}>
                            {table}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {databaseStatus?.missingTables && databaseStatus.missingTables.length > 0 && (
                  <div className="mt-6 p-6 rounded-xl bg-amber-500/10 border border-amber-400/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-amber-300 text-lg">Missing Tables</strong>
                        <p className="text-amber-200 mt-2">{databaseStatus.missingTables.join(", ")}</p>
                        <p className="text-amber-200/80 text-sm mt-3">
                          Run the SQL scripts in the{" "}
                          <code className="px-2 py-1 rounded bg-amber-400/20 font-mono">/scripts</code> folder to create
                          these tables.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-transparent" />
          <div className="relative p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions & Troubleshooting</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-300 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  If Supabase connection fails:
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Verify environment variables are set in Vercel project settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Check that your Supabase project is active and not paused</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Verify API keys are correct and have proper permissions</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-orange-300 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  If tables are missing:
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>
                      Run SQL scripts from{" "}
                      <code className="px-1 py-0.5 rounded bg-white/10 font-mono text-xs">/scripts</code> folder in
                      Supabase SQL Editor
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Verify Row Level Security (RLS) policies are properly configured</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-1">•</span>
                    <span>Check that migrations have been applied successfully</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center text-slate-400 text-sm">Last checked: {new Date().toLocaleString()}</div>
      </div>
    </div>
  )
}
