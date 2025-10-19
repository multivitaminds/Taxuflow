"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Link2, Settings, History, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SyncConnectionSetup } from "./sync-connection-setup"
import { SyncJobsList } from "./sync-jobs-list"
import { SyncConflicts } from "./sync-conflicts"
import { SyncSettings } from "./sync-settings"

interface SyncConnection {
  id: string
  connection_name: string
  company_file_name: string
  last_sync_at: string | null
  last_sync_status: string | null
  is_active: boolean
  auto_sync_enabled: boolean
}

interface SyncStats {
  totalSyncs: number
  successfulSyncs: number
  failedSyncs: number
  pendingConflicts: number
  lastSyncDuration: number
}

export function QuickBooksDesktopSync() {
  const [connections, setConnections] = useState<SyncConnection[]>([])
  const [stats, setStats] = useState<SyncStats>({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    pendingConflicts: 0,
    lastSyncDuration: 0,
  })
  const [showSetup, setShowSetup] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Load connections
    const { data: conns } = await supabase.from("qbd_sync_connections").select("*").eq("user_id", user.id)

    if (conns) setConnections(conns)

    // Load stats
    const { data: jobs } = await supabase
      .from("qbd_sync_jobs")
      .select("status, duration_seconds")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    const { data: conflicts } = await supabase
      .from("qbd_sync_conflicts")
      .select("id")
      .eq("resolution_status", "pending")
      .limit(100)

    if (jobs) {
      setStats({
        totalSyncs: jobs.length,
        successfulSyncs: jobs.filter((j) => j.status === "completed").length,
        failedSyncs: jobs.filter((j) => j.status === "failed").length,
        pendingConflicts: conflicts?.length || 0,
        lastSyncDuration: jobs[0]?.duration_seconds || 0,
      })
    }

    setLoading(false)
  }

  async function startSync(connectionId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Create sync job
    const { data, error } = await supabase
      .from("qbd_sync_jobs")
      .insert({
        connection_id: connectionId,
        user_id: user.id,
        job_type: "full-sync",
        sync_direction: "bidirectional",
        entities_to_sync: ["customers", "invoices", "bills", "products"],
        status: "pending",
      })
      .select()
      .single()

    if (data) {
      // In a real implementation, this would trigger the actual sync process
      alert("Sync job started! This would connect to QuickBooks Desktop in production.")
      loadData()
    }
  }

  if (loading) {
    return <div>Loading QuickBooks Desktop sync...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QuickBooks Desktop Sync</h1>
          <p className="text-muted-foreground">Sync data between Taxu and QuickBooks Desktop</p>
        </div>
        {connections.length > 0 ? (
          <Button onClick={() => startSync(connections[0].id)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
        ) : (
          <Button onClick={() => setShowSetup(true)}>
            <Link2 className="h-4 w-4 mr-2" />
            Connect QuickBooks
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Syncs</p>
              <p className="text-2xl font-bold">{stats.totalSyncs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700">Successful</p>
              <p className="text-2xl font-bold text-green-700">{stats.successfulSyncs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-700">Failed</p>
              <p className="text-2xl font-bold text-red-700">{stats.failedSyncs}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-700">Conflicts</p>
              <p className="text-2xl font-bold text-orange-700">{stats.pendingConflicts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Duration</p>
              <p className="text-2xl font-bold">{stats.lastSyncDuration}s</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Connections */}
      {connections.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Connections</h3>
          <div className="space-y-3">
            {connections.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{conn.connection_name}</p>
                    <p className="text-sm text-muted-foreground">{conn.company_file_name}</p>
                    {conn.last_sync_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last synced: {new Date(conn.last_sync_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {conn.auto_sync_enabled && <Badge variant="secondary">Auto-sync</Badge>}
                  <Badge variant={conn.is_active ? "default" : "outline"}>
                    {conn.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {conn.last_sync_status && (
                    <Badge
                      variant={
                        conn.last_sync_status === "completed"
                          ? "default"
                          : conn.last_sync_status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {conn.last_sync_status}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">
            <History className="h-4 w-4 mr-2" />
            Sync History
          </TabsTrigger>
          <TabsTrigger value="conflicts">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Conflicts ({stats.pendingConflicts})
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <SyncJobsList />
        </TabsContent>

        <TabsContent value="conflicts">
          <SyncConflicts />
        </TabsContent>

        <TabsContent value="settings">
          <SyncSettings connections={connections} onUpdate={loadData} />
        </TabsContent>
      </Tabs>

      {/* Setup Dialog */}
      {showSetup && <SyncConnectionSetup onClose={() => setShowSetup(false)} onSuccess={loadData} />}
    </div>
  )
}
