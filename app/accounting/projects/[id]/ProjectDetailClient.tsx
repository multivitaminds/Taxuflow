"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Edit,
  MoreHorizontal,
  Plus,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ProjectDetailClientProps {
  projectId: string
  user: User
}

export default function ProjectDetailClient({ projectId, user }: ProjectDetailClientProps) {
  const project = {
    id: projectId,
    name: "Website Redesign",
    client: "Acme Corp",
    status: "in_progress",
    budget: 15000,
    actualCost: 8500,
    revenue: 12000,
    profit: 3500,
    profitMargin: 29.2,
    hours: {
      budgeted: 150,
      tracked: 85,
      remaining: 65,
    },
    startDate: "2024-01-15",
    dueDate: "2024-02-15",
    progress: 60,
    teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"],
  }

  const expenses = [
    {
      id: "exp_1",
      date: "2024-01-20",
      category: "Software Licenses",
      description: "Adobe Creative Cloud",
      amount: 500,
      billable: true,
    },
    {
      id: "exp_2",
      date: "2024-01-22",
      category: "Freelancer",
      description: "UI Design Consultation",
      amount: 1200,
      billable: true,
    },
    {
      id: "exp_3",
      date: "2024-01-25",
      category: "Marketing",
      description: "Stock Photos",
      amount: 150,
      billable: false,
    },
  ]

  const timeEntries = [
    {
      id: "time_1",
      date: "2024-01-18",
      employee: "John Doe",
      task: "Frontend Development",
      hours: 8,
      rate: 150,
      amount: 1200,
      billable: true,
    },
    {
      id: "time_2",
      date: "2024-01-19",
      employee: "Jane Smith",
      task: "UI Design",
      hours: 6,
      rate: 120,
      amount: 720,
      billable: true,
    },
    {
      id: "time_3",
      date: "2024-01-20",
      employee: "Mike Johnson",
      task: "Project Management",
      hours: 4,
      rate: 100,
      amount: 400,
      billable: false,
    },
  ]

  const profitTrend = project.profit > 0 ? "positive" : "negative"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              <Badge
                className={
                  project.status === "in_progress"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-green-100 text-green-700 border-green-200"
                }
              >
                {project.status === "in_progress" ? "In Progress" : "Completed"}
              </Badge>
            </div>
            <p className="text-slate-600 mt-1">Client: {project.client}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Budget</h3>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">${project.budget.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Total allocated</p>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Actual Cost</h3>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">${project.actualCost.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">
            {((project.actualCost / project.budget) * 100).toFixed(1)}% of budget
          </p>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Revenue</h3>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">${project.revenue.toLocaleString()}</div>
          <p className="text-xs text-slate-500 mt-1">Earned to date</p>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Profit</h3>
            {profitTrend === "positive" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
          <div className={`text-2xl font-bold ${profitTrend === "positive" ? "text-green-600" : "text-red-600"}`}>
            ${project.profit.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">{project.profitMargin.toFixed(1)}% margin</p>
        </Card>

        <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Hours</h3>
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{project.hours.tracked}h</div>
          <p className="text-xs text-slate-500 mt-1">{project.hours.remaining}h remaining</p>
        </Card>
      </div>

      {/* Budget vs Actual Chart */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Budget vs Actual</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Labor Costs</span>
              <span className="text-sm text-slate-900">
                ${(project.actualCost * 0.6).toFixed(0)} / ${(project.budget * 0.6).toFixed(0)}
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${((project.actualCost * 0.6) / (project.budget * 0.6)) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Materials & Expenses</span>
              <span className="text-sm text-slate-900">
                ${(project.actualCost * 0.3).toFixed(0)} / ${(project.budget * 0.3).toFixed(0)}
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 rounded-full"
                style={{ width: `${((project.actualCost * 0.3) / (project.budget * 0.3)) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Overhead</span>
              <span className="text-sm text-slate-900">
                ${(project.actualCost * 0.1).toFixed(0)} / ${(project.budget * 0.1).toFixed(0)}
              </span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${((project.actualCost * 0.1) / (project.budget * 0.1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="time">Time Entries</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Project Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Start Date</span>
                  <span className="text-sm font-medium text-slate-900">{project.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Due Date</span>
                  <span className="text-sm font-medium text-slate-900">{project.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Progress</span>
                  <span className="text-sm font-medium text-slate-900">{project.progress}%</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Team Members</h3>
              <div className="space-y-2">
                {project.teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {member.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{member}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time">
          <Card className="bg-white">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Time Entries</h3>
              <Link href={`/accounting/time/new?project=${projectId}`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Time
                </Button>
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50">
                    <TableCell>{entry.date}</TableCell>
                    <TableCell className="font-medium">{entry.employee}</TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell>{entry.hours}h</TableCell>
                    <TableCell>${entry.rate}/hr</TableCell>
                    <TableCell className="font-medium">${entry.amount}</TableCell>
                    <TableCell>
                      <Badge className={entry.billable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                        {entry.billable ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="bg-white">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Project Expenses</h3>
              <Link href={`/accounting/expenses/new?project=${projectId}`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Billable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-slate-50">
                    <TableCell>{expense.date}</TableCell>
                    <TableCell className="font-medium">{expense.category}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="font-medium">${expense.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={expense.billable ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}
                      >
                        {expense.billable ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="profitability">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Billable Labor</span>
                  <span className="text-sm font-medium text-slate-900">${(project.revenue * 0.7).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Billable Expenses</span>
                  <span className="text-sm font-medium text-slate-900">${(project.revenue * 0.2).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Other Revenue</span>
                  <span className="text-sm font-medium text-slate-900">${(project.revenue * 0.1).toFixed(0)}</span>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">Total Revenue</span>
                  <span className="text-base font-bold text-green-600">${project.revenue.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Labor Costs</span>
                  <span className="text-sm font-medium text-slate-900">${(project.actualCost * 0.6).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Materials & Expenses</span>
                  <span className="text-sm font-medium text-slate-900">${(project.actualCost * 0.3).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Overhead Allocation</span>
                  <span className="text-sm font-medium text-slate-900">${(project.actualCost * 0.1).toFixed(0)}</span>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">Total Costs</span>
                  <span className="text-base font-bold text-orange-600">${project.actualCost.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
