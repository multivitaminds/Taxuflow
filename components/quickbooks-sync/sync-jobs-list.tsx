"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SyncJob {
  id: string
  job_type: string
  sync_direction: string
  status: string
  progress_percentage: number
  records_processed: number
  records_succeeded: number
  records_failed: number
  started_at: string | null
  completed_at: string | null
  duration_seconds: number | null
}

export function SyncJobsList() {
  const [jobs, setJobs] = useState<SyncJob[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadJobs()
  }, [])

  async function loadJobs() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("qbd_sync_jobs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (data) setJobs(data)
    setLoading(false)
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "running":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      case "running":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div>Loading sync jobs...</div>
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Sync History</h3>
      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No sync jobs yet</p>
            <p className="text-sm text-muted-foreground mt-1">Start your first sync to see history here</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(job.status)}
                  <div>
                    <p className="font-medium capitalize">{job.job_type.replace("-", " ")}</p>
                    <p className="text-sm text-muted-foreground capitalize">{job.sync_direction}</p>
                    {job.started_at && (
                      <p className="text-xs text-muted-foreground mt-1">{new Date(job.started_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusColor(job.status)}>{job.status}</Badge>
              </div>

              {job.status === "running" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{job.progress_percentage}%</span>
                  </div>
                  <Progress value={job.progress_percentage} className="h-2" />
                </div>
              )}

              {(job.status === "completed" || job.status === "failed") && (
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Processed: </span>
                    <span className="font-medium">{job.records_processed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Succeeded: </span>
                    <span className="font-medium text-green-600">{job.records_succeeded}</span>
                  </div>
                  {job.records_failed > 0 && (
                    <div>
                      <span className="text-muted-foreground">Failed: </span>
                      <span className="font-medium text-red-600">{job.records_failed}</span>
                    </div>
                  )}
                  {job.duration_seconds && (
                    <div>
                      <span className="text-muted-foreground">Duration: </span>
                      <span className="font-medium">{job.duration_seconds}s</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
