"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Clock, DollarSign, Calendar, Edit, Trash2, Save, X, FileText, TrendingUp } from "lucide-react"

interface TimeEntry {
  id: string
  project: string
  task: string
  hours: number
  rate: number
  date: string
  status: "tracked" | "invoiced" | "running"
  description: string
  billable: boolean
}

export function TimeEntryDetailClient({ entryId }: { entryId: string }) {
  const [entry, setEntry] = useState<TimeEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    const mockEntry: TimeEntry = {
      id: entryId,
      project: "Website Redesign",
      task: "Frontend Development",
      hours: 4.5,
      rate: 150,
      date: new Date().toISOString(),
      status: "tracked",
      description: "Built new homepage components using React and Tailwind CSS",
      billable: true,
    }

    setEntry(mockEntry)
    setLoading(false)
  }, [entryId])

  if (loading || !entry) {
    return <div className="p-8">Loading time entry...</div>
  }

  const totalAmount = entry.hours * entry.rate

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/accounting/time">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Time Entry</h1>
              <p className="text-slate-600 mt-1">{entry.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="bg-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-white">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Amount Card */}
        <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Hours Tracked</p>
              <p className="text-4xl font-bold">{entry.hours.toFixed(1)}h</p>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Hourly Rate</p>
              <p className="text-4xl font-bold">${entry.rate}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Total Amount</p>
              <p className="text-4xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white shadow-md space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">Project</label>
                {isEditing ? (
                  <Input value={entry.project} className="font-semibold" />
                ) : (
                  <p className="text-lg font-semibold text-slate-900">{entry.project}</p>
                )}
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">Task</label>
                {isEditing ? <Input value={entry.task} /> : <p className="text-slate-900">{entry.task}</p>}
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-slate-600 mb-2 block">Description</label>
                {isEditing ? (
                  <Textarea value={entry.description} rows={4} />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{entry.description}</p>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Hours</label>
                  {isEditing ? (
                    <Input type="number" step="0.5" value={entry.hours} />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">{entry.hours.toFixed(1)}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-2 block">Rate (per hour)</label>
                  {isEditing ? (
                    <Input type="number" value={entry.rate} />
                  ) : (
                    <p className="text-2xl font-bold text-slate-900">${entry.rate}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status</h3>
              <Badge
                className={`${
                  entry.status === "invoiced"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : entry.status === "tracked"
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                } border px-4 py-2 text-sm font-semibold capitalize`}
              >
                {entry.status}
              </Badge>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4" />
                <span>{new Date(entry.date).toLocaleDateString()}</span>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Duration</span>
                  </div>
                  <span className="font-semibold text-slate-900">{entry.hours}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Amount</span>
                  </div>
                  <span className="font-semibold text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Billable</span>
                  </div>
                  <span className="font-semibold text-slate-900">{entry.billable ? "Yes" : "No"}</span>
                </div>
              </div>
            </Card>

            {entry.status === "tracked" && (
              <Card className="p-6 bg-white shadow-md">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Clock className="h-4 w-4 mr-2" />
                    Duplicate Entry
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
