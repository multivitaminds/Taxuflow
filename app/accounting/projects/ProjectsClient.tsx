"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FolderKanban, Clock, DollarSign, Users } from "lucide-react"
import Link from "next/link"

export default function ProjectsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - will be replaced with real API calls
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      client: "Acme Corp",
      status: "in_progress",
      budget: 15000,
      spent: 8500,
      hours: 85,
      progress: 60,
      dueDate: "2024-02-15",
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "TechStart Inc",
      status: "in_progress",
      budget: 50000,
      spent: 12000,
      hours: 120,
      progress: 25,
      dueDate: "2024-03-30",
    },
    {
      id: 3,
      name: "Brand Identity Package",
      client: "Creative Studio",
      status: "completed",
      budget: 8000,
      spent: 7800,
      hours: 78,
      progress: 100,
      dueDate: "2024-01-20",
    },
  ]

  const stats = [
    { label: "Active Projects", value: "12", icon: FolderKanban, color: "text-blue-600" },
    { label: "Total Hours", value: "1,245", icon: Clock, color: "text-green-600" },
    { label: "Total Revenue", value: "$125,400", icon: DollarSign, color: "text-purple-600" },
    { label: "Team Members", value: "8", icon: Users, color: "text-orange-600" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "on_hold":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Track project progress and profitability</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
              All
            </Button>
            <Button
              variant={statusFilter === "in_progress" ? "default" : "outline"}
              onClick={() => setStatusFilter("in_progress")}
            >
              In Progress
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              onClick={() => setStatusFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/accounting/projects/${project.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                {/* Budget Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold">${project.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="font-semibold">${project.spent.toLocaleString()}</p>
                  </div>
                </div>

                {/* Time & Due Date */}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{project.hours}h logged</span>
                  </div>
                  <span className="text-muted-foreground">Due {project.dueDate}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
