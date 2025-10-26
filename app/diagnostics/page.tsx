"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface DiagnosticResult {
  status: "success" | "error" | "warning"
  message: string
  details?: any
  tables?: Record<string, boolean>
  missingTables?: string[]
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
    if (status === "success") return <CheckCircle2 className="h-6 w-6 text-green-500" />
    if (status === "error") return <XCircle className="h-6 w-6 text-red-500" />
    return <AlertCircle className="h-6 w-6 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              System Diagnostics
            </h1>
            <p className="mt-2 text-slate-600">Check Taxu platform health and connectivity</p>
          </div>
          <Button onClick={runDiagnostics} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Supabase Connection */}
        <Card className="p-6 border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            {supabaseStatus && <StatusIcon status={supabaseStatus.status} />}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">Supabase Connection</h2>
              <p className="mt-1 text-slate-600">
                {loading ? "Checking..." : supabaseStatus?.message || "Not checked"}
              </p>

              {supabaseStatus?.details && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-medium text-slate-700">Environment Variables:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {supabaseStatus.details.environmentVariables?.hasUrl ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>NEXT_PUBLIC_SUPABASE_URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {supabaseStatus.details.environmentVariables?.hasKey ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {supabaseStatus.details.environmentVariables?.hasServiceRole ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>SUPABASE_SERVICE_ROLE_KEY</span>
                    </div>
                  </div>

                  {supabaseStatus.details.databaseConnection && (
                    <div className="mt-4">
                      <h3 className="font-medium text-slate-700">Database Connection:</h3>
                      <p className="text-sm text-slate-600">{supabaseStatus.details.databaseConnection}</p>
                    </div>
                  )}

                  {supabaseStatus.details.user && (
                    <div className="mt-4">
                      <h3 className="font-medium text-slate-700">Current User:</h3>
                      <p className="text-sm text-slate-600">{supabaseStatus.details.user}</p>
                    </div>
                  )}
                </div>
              )}

              {supabaseStatus?.error && (
                <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  <strong>Error:</strong> {supabaseStatus.error}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Database Tables */}
        <Card className="p-6 border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            {databaseStatus && <StatusIcon status={databaseStatus.status} />}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">Database Schema</h2>
              <p className="mt-1 text-slate-600">
                {loading ? "Checking..." : databaseStatus?.message || "Not checked"}
              </p>

              {databaseStatus?.tables && (
                <div className="mt-4">
                  <h3 className="font-medium text-slate-700 mb-2">Tables Status:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(databaseStatus.tables).map(([table, exists]) => (
                      <div key={table} className="flex items-center gap-2">
                        {exists ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={exists ? "text-slate-700" : "text-red-600"}>{table}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {databaseStatus?.missingTables && databaseStatus.missingTables.length > 0 && (
                <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                  <strong>Missing Tables:</strong> {databaseStatus.missingTables.join(", ")}
                  <p className="mt-2">Run the SQL scripts in the /scripts folder to create these tables.</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-slate-200 bg-white/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <strong>If Supabase connection fails:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Verify environment variables are set in Vercel</li>
              <li>Check Supabase project is active</li>
              <li>Verify API keys are correct</li>
            </ul>
            <p className="mt-4">
              <strong>If tables are missing:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Run SQL scripts from /scripts folder in Supabase SQL Editor</li>
              <li>Check Row Level Security (RLS) policies are enabled</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
