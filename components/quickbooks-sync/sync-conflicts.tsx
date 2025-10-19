"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SyncConflict {
  id: string
  entity_type: string
  conflict_type: string
  taxu_data: any
  qbd_data: any
  resolution_status: string
  created_at: string
}

export function SyncConflicts() {
  const [conflicts, setConflicts] = useState<SyncConflict[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadConflicts()
  }, [])

  async function loadConflicts() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("qbd_sync_conflicts")
      .select("*")
      .eq("resolution_status", "pending")
      .order("created_at", { ascending: false })

    if (data) setConflicts(data)
    setLoading(false)
  }

  async function resolveConflict(conflictId: string, resolution: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from("qbd_sync_conflicts")
      .update({
        resolution_status: resolution,
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
      })
      .eq("id", conflictId)

    loadConflicts()
  }

  if (loading) {
    return <div>Loading conflicts...</div>
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sync Conflicts</h3>
      <div className="space-y-3">
        {conflicts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pending conflicts</p>
            <p className="text-sm text-muted-foreground mt-1">All sync conflicts have been resolved</p>
          </div>
        ) : (
          conflicts.map((conflict) => (
            <div key={conflict.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium capitalize">{conflict.entity_type}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {conflict.conflict_type.replace("-", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conflict.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium mb-2">Taxu Data</p>
                  <pre className="text-xs overflow-auto">{JSON.stringify(conflict.taxu_data, null, 2)}</pre>
                </div>
                <div className="p-3 bg-white rounded border">
                  <p className="font-medium mb-2">QuickBooks Data</p>
                  <pre className="text-xs overflow-auto">{JSON.stringify(conflict.qbd_data, null, 2)}</pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => resolveConflict(conflict.id, "resolved-taxu")}>
                  Use Taxu Data
                </Button>
                <Button size="sm" variant="outline" onClick={() => resolveConflict(conflict.id, "resolved-qbd")}>
                  Use QuickBooks Data
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
