"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Clock,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  Play,
  Square,
  Timer,
  DollarSign,
  TrendingUp,
} from "lucide-react"

interface TimeEntry {
  id: string
  project: string
  task: string
  hours: number
  rate: number
  date: string
  status: "tracked" | "invoiced" | "running"
  description: string
}

export function TimeTrackingClient() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isTracking, setIsTracking] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    // Mock data for demonstration
    const mockEntries: TimeEntry[] = [
      {
        id: "time_1",
        project: "Website Redesign",
        task: "Frontend Development",
        hours: 4.5,
        rate: 150,
        date: new Date().toISOString(),
        status: "tracked",
        description: "Built new homepage components",
      },
      {
        id: "time_2",
        project: "Mobile App",
        task: "UI Design",
        hours: 3.0,
        rate: 120,
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "invoiced",
        description: "Designed onboarding screens",
      },
      {
        id: "time_3",
        project: "Client Consultation",
        task: "Strategy Meeting",
        hours: 2.0,
        rate: 200,
        date: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: "tracked",
        description: "Q1 planning session",
      },
      {
        id: "time_4",
        project: "E-commerce Site",
        task: "Backend Development",
        hours: 6.5,
        rate: 175,
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
        status: "invoiced",
        description: "Payment gateway integration",
      },
    ]

    setEntries(mockEntries)
    setLoading(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
  const totalRevenue = entries.reduce((sum, e) => sum + e.hours * e.rate, 0)
  const billableHours = entries.filter((e) => e.status === "tracked").reduce((sum, e) => sum + e.hours, 0)
  const invoicedRevenue = entries.filter((e) => e.status === "invoiced").reduce((sum, e) => sum + e.hours * e.rate, 0)

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
          <p className="text-muted-foreground mt-2">Track billable hours and manage project time</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5851df] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Timer Widget */}
      <Card className="p-6 bg-gradient-to-br from-[#635bff] to-[#7c73ff] text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-90">Current Timer</h3>
            <div className="text-4xl font-bold font-mono">{formatTime(elapsedTime)}</div>
          </div>
          <div className="flex gap-3">
            {!isTracking ? (
              <Button
                size="lg"
                onClick={() => setIsTracking(true)}
                className="bg-white text-[#635bff] hover:bg-gray-100"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Timer
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  setIsTracking(false)
                  setElapsedTime(0)
                }}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Square className="mr-2 h-5 w-5" />
                Stop & Save
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Hours</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground mt-1">this month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">earned this month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Billable Hours</h3>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{billableHours.toFixed(1)}h</div>
          <p className="text-xs text-muted-foreground mt-1">ready to invoice</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Invoiced</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">
            ${invoicedRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">already billed</p>
        </Card>
      </div>

      <Card>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search time entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 pl-0"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading time entries...
                </TableCell>
              </TableRow>
            ) : filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No time entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{entry.project}</TableCell>
                  <TableCell>{entry.task}</TableCell>
                  <TableCell className="font-mono">{entry.hours.toFixed(1)}h</TableCell>
                  <TableCell>${entry.rate}/hr</TableCell>
                  <TableCell className="font-medium">${(entry.hours * entry.rate).toFixed(2)}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        entry.status === "invoiced"
                          ? "bg-green-100 text-green-800"
                          : entry.status === "tracked"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {entry.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit entry</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-green-600">Create invoice</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
