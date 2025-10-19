"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TimeEntry {
  id: string
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  description: string
  is_billable: boolean
  billable_amount: number | null
  status: string
  project?: {
    name: string
  }
}

export function TimeEntriesList() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("time_entries")
      .select("*, project:projects(name)")
      .eq("user_id", user.id)
      .order("start_time", { ascending: false })
      .limit(50)

    if (data) setEntries(data)
    setLoading(false)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  function formatDuration(minutes: number | null) {
    if (!minutes) return "0:00"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, "0")}`
  }

  if (loading) {
    return <div>Loading entries...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Time Entries</h2>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{entry.description}</h3>
                  {entry.is_billable && <Badge variant="secondary">Billable</Badge>}
                  <Badge variant="outline">{entry.status}</Badge>
                </div>

                {entry.project && <p className="text-sm text-muted-foreground">Project: {entry.project.name}</p>}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(entry.start_time)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(entry.start_time)} - {entry.end_time ? formatTime(entry.end_time) : "In progress"}
                  </div>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-2xl font-bold font-mono">{formatDuration(entry.duration_minutes)}</div>
                {entry.billable_amount && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {entry.billable_amount.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
