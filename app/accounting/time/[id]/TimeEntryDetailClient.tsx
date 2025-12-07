"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Clock, DollarSign, Calendar, FileText, Activity, CheckCircle2 } from "lucide-react"

interface TimeEntry {
  id: string
  project: string
  task: string
  hours: number
  rate: number
  date: string
  status: "tracked" | "invoiced" | "running"
  description: string
  notes?: string
  billable: boolean
}

export default function TimeEntryDetailClient({ entryId }: { entryId: string }) {
  const [entry, setEntry] = useState<TimeEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockEntry: TimeEntry = {
      id: entryId,
      project: "Website Redesign",
      task: "Frontend Development",
      hours: 4.5,
      rate: 150,
      date: new Date().toISOString(),
      status: "tracked",
      description: "Built new homepage components with React and Tailwind CSS",
      notes: "Completed hero section, navigation bar, and footer components. Ready for review.",
      billable: true,
    }

    setEntry(mockEntry)
    setLoading(false)
  }, [entryId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-5xl mx-auto">Loading time entry...</div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-5xl mx-auto">Time entry not found</div>
      </div>
    )
  }

  const statusConfig = {
    tracked: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Tracked" },
    invoiced: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Invoiced" },
    running: { icon: Activity, color: "text-orange-600", bg: "bg-orange-50", label: "Running" },
  }

  const StatusIcon = statusConfig[entry.status].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/accounting/time">
            <Button variant="ghost" size="sm" className="hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Time Tracking
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Time Entry Details</h1>
            <p className="text-slate-600 mt-1">Entry ID: {entry.id}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-slate-300">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="bg-white border-red-300 text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 bg-white md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Time Details</h2>
                <Badge className={`${statusConfig[entry.status].bg} ${statusConfig[entry.status].color} border-0`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[entry.status].label}
                </Badge>
              </div>
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Hours</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1 font-mono">{entry.hours.toFixed(1)}h</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Hourly Rate</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">${entry.rate}/hr</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">${(entry.hours * entry.rate).toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-600 mb-2">Project</p>
                <Link
                  href={`/accounting/projects/${entry.project}`}
                  className="text-lg font-medium text-slate-900 hover:text-blue-600"
                >
                  {entry.project}
                </Link>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-2">Task</p>
                <p className="text-slate-900 font-medium">{entry.task}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-600 mb-2">Description</p>
                <p className="text-slate-700">{entry.description}</p>
              </div>

              {entry.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Notes</p>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-700">{entry.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Date & Time</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Date</p>
                  <p className="text-sm text-slate-900">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Billing</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Billable</p>
                  <p className="text-sm font-medium text-slate-900">{entry.billable ? "Yes" : "No"}</p>
                </div>
                {entry.billable && (
                  <div>
                    <p className="text-xs text-slate-600">Amount to Bill</p>
                    <p className="text-sm font-semibold text-slate-900">${(entry.hours * entry.rate).toFixed(2)}</p>
                  </div>
                )}
              </div>
            </Card>

            {entry.status === "tracked" && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            )}
          </div>
        </div>

        <Card className="bg-white">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="activity"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Time entry created</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(entry.date).toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
