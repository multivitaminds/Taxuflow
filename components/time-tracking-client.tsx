"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  Users,
  BarChart3,
  CalendarDays,
  ArrowUpRight,
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

  const quickActions = [
    {
      title: "Project Time Reports",
      description: "View time breakdown by project",
      icon: BarChart3,
      href: "/accounting/time/reports",
      color: "blue",
    },
    {
      title: "Team Timesheets",
      description: "Manage employee time entries",
      icon: Users,
      href: "/accounting/time/team",
      color: "purple",
    },
    {
      title: "Time Calendar",
      description: "Calendar view of all time entries",
      icon: CalendarDays,
      href: "/accounting/time/calendar",
      color: "green",
    },
    {
      title: "Invoice from Time",
      description: "Create invoices from tracked time",
      icon: DollarSign,
      href: "/accounting/invoices/new?source=time",
      color: "orange",
    },
  ]

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Time Tracking</h1>
          <p className="text-slate-600 mt-2">Track billable hours and manage project time</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/accounting/time/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium opacity-90">Current Timer</h3>
            <div className="text-5xl font-bold font-mono tracking-tight">{formatTime(elapsedTime)}</div>
            {isTracking && <p className="text-sm opacity-80">Working on current project...</p>}
          </div>
          <div className="flex gap-3">
            {!isTracking ? (
              <Button
                size="lg"
                onClick={() => setIsTracking(true)}
                className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg"
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
        <Link href="/accounting/time/hours">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Total Hours</h3>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +12% from last month
            </p>
          </Card>
        </Link>
        <Link href="/accounting/time/revenue">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Total Revenue</h3>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-2">earned this month</p>
          </Card>
        </Link>
        <Link href="/accounting/time/billable">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Billable Hours</h3>
              <Timer className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{billableHours.toFixed(1)}h</div>
            <p className="text-xs text-slate-500 mt-2">ready to invoice</p>
          </Card>
        </Link>
        <Link href="/accounting/time/invoiced">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Invoiced</h3>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${invoicedRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-2">already billed</p>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="p-5 bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group border border-slate-200">
                  <div
                    className={`p-3 rounded-xl ${colorClasses[action.color as keyof typeof colorClasses]} inline-flex mb-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <Card className="bg-white shadow-md">
        <div className="p-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search time entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 pl-0"
            />
          </div>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Project</TableHead>
              <TableHead className="font-semibold">Task</TableHead>
              <TableHead className="font-semibold">Hours</TableHead>
              <TableHead className="font-semibold">Rate</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                  Loading time entries...
                </TableCell>
              </TableRow>
            ) : filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium text-slate-700 mb-2">No time entries found</p>
                  <p className="text-sm text-slate-500 mb-4">Start tracking time or add a manual entry</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Entry
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="text-slate-700">{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-slate-900">
                    <Link
                      href={`/accounting/projects/${entry.project}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {entry.project}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-700">{entry.task}</TableCell>
                  <TableCell className="font-mono font-semibold text-slate-900">{entry.hours.toFixed(1)}h</TableCell>
                  <TableCell className="text-slate-700">${entry.rate}/hr</TableCell>
                  <TableCell className="font-medium text-slate-900">${(entry.hours * entry.rate).toFixed(2)}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        entry.status === "invoiced"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : entry.status === "tracked"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {entry.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/accounting/time/${entry.id}`} className="flex items-center w-full">
                            View details
                            <ArrowUpRight className="h-3 w-3 ml-auto" />
                          </Link>
                        </DropdownMenuItem>
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
