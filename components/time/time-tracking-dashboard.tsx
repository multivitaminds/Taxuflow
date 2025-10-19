"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Square, Clock, DollarSign, Calendar, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TimeEntryForm } from "./time-entry-form"
import { TimeEntriesList } from "./time-entries-list"
import { ProjectsList } from "./projects-list"

interface TimeEntry {
  id: string
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  description: string
  is_billable: boolean
  status: string
  project?: {
    name: string
  }
}

interface Stats {
  todayHours: number
  weekHours: number
  billableAmount: number
  activeProjects: number
}

export function TimeTrackingDashboard() {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([])
  const [stats, setStats] = useState<Stats>({
    todayHours: 0,
    weekHours: 0,
    billableAmount: 0,
    activeProjects: 0,
  })
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [view, setView] = useState<"timer" | "entries" | "projects">("timer")
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Load active time entry
    const { data: active } = await supabase
      .from("time_entries")
      .select("*, project:projects(name)")
      .eq("user_id", user.id)
      .is("end_time", null)
      .single()

    if (active) setActiveEntry(active)

    // Load recent entries
    const { data: entries } = await supabase
      .from("time_entries")
      .select("*, project:projects(name)")
      .eq("user_id", user.id)
      .order("start_time", { ascending: false })
      .limit(10)

    if (entries) setRecentEntries(entries)

    // Calculate stats
    const today = new Date().toISOString().split("T")[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: todayEntries } = await supabase
      .from("time_entries")
      .select("duration_minutes")
      .eq("user_id", user.id)
      .gte("start_time", today)

    const { data: weekEntries } = await supabase
      .from("time_entries")
      .select("duration_minutes, billable_amount")
      .eq("user_id", user.id)
      .gte("start_time", weekAgo)

    const { data: projects } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")

    setStats({
      todayHours: (todayEntries?.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) || 0) / 60,
      weekHours: (weekEntries?.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) || 0) / 60,
      billableAmount: weekEntries?.reduce((sum, e) => sum + (e.billable_amount || 0), 0) || 0,
      activeProjects: projects?.length || 0,
    })
  }

  async function startTimer() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("time_entries")
      .insert({
        user_id: user.id,
        start_time: new Date().toISOString(),
        description: "New time entry",
        is_billable: true,
        status: "draft",
      })
      .select()
      .single()

    if (data) {
      setActiveEntry(data)
      loadData()
    }
  }

  async function stopTimer() {
    if (!activeEntry) return

    const endTime = new Date()
    const startTime = new Date(activeEntry.start_time)
    const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000)

    const { error } = await supabase
      .from("time_entries")
      .update({
        end_time: endTime.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("id", activeEntry.id)

    setActiveEntry(null)
    loadData()
  }

  function formatDuration(minutes: number | null) {
    if (!minutes) return "0:00"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
          <p className="text-muted-foreground">Track time, manage projects, and bill clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "timer" ? "default" : "outline"} onClick={() => setView("timer")}>
            <Clock className="h-4 w-4 mr-2" />
            Timer
          </Button>
          <Button variant={view === "entries" ? "default" : "outline"} onClick={() => setView("entries")}>
            <Calendar className="h-4 w-4 mr-2" />
            Entries
          </Button>
          <Button variant={view === "projects" ? "default" : "outline"} onClick={() => setView("projects")}>
            <Users className="h-4 w-4 mr-2" />
            Projects
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold">{stats.todayHours.toFixed(1)}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">{stats.weekHours.toFixed(1)}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Billable</p>
              <p className="text-2xl font-bold">${stats.billableAmount.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Timer View */}
      {view === "timer" && (
        <div className="space-y-6">
          {/* Active Timer */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              {activeEntry ? (
                <>
                  <div className="space-y-2">
                    <Badge variant="default" className="mb-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Timer Running
                      </div>
                    </Badge>
                    <h2 className="text-5xl font-bold font-mono">
                      {formatDuration(Math.floor((Date.now() - new Date(activeEntry.start_time).getTime()) / 60000))}
                    </h2>
                    <p className="text-muted-foreground">{activeEntry.description}</p>
                  </div>
                  <Button size="lg" onClick={stopTimer} variant="destructive">
                    <Square className="h-5 w-5 mr-2" />
                    Stop Timer
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h2 className="text-5xl font-bold font-mono text-muted-foreground">0:00</h2>
                    <p className="text-muted-foreground">No active timer</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button size="lg" onClick={startTimer}>
                      <Play className="h-5 w-5 mr-2" />
                      Start Timer
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setShowEntryForm(true)}>
                      <Clock className="h-5 w-5 mr-2" />
                      Manual Entry
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Recent Entries */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Time Entries</h3>
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-sm text-muted-foreground">{entry.project?.name || "No project"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {entry.is_billable && <Badge variant="secondary">Billable</Badge>}
                    <span className="font-mono font-semibold">{formatDuration(entry.duration_minutes)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Entries View */}
      {view === "entries" && <TimeEntriesList />}

      {/* Projects View */}
      {view === "projects" && <ProjectsList />}

      {/* Manual Entry Form */}
      {showEntryForm && (
        <TimeEntryForm
          onClose={() => setShowEntryForm(false)}
          onSave={() => {
            setShowEntryForm(false)
            loadData()
          }}
        />
      )}
    </div>
  )
}
