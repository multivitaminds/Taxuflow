"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LayoutGrid, List, CalendarIcon, Plus, TrendingUp, Users, DollarSign, Clock, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ProjectForm } from "./project-form"
import { ProjectDetails } from "./project-details"
import { ProjectGantt } from "./project-gantt"

interface Project {
  id: string
  name: string
  description: string
  status: string
  billing_type: string
  budget_hours: number | null
  budget_amount: number | null
  start_date: string | null
  end_date: string | null
  customer?: {
    company_name: string
  }
}

interface ProjectStats {
  totalProjects: number
  activeProjects: number
  totalBudget: number
  totalHours: number
  onTrackProjects: number
  delayedProjects: number
}

export function ProjectManagementDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalBudget: 0,
    totalHours: 0,
    onTrackProjects: 0,
    delayedProjects: 0,
  })
  const [view, setView] = useState<"grid" | "list" | "gantt">("grid")
  const [showForm, setShowForm] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("projects")
      .select("*, customer:customers(company_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) {
      setProjects(data)

      // Calculate stats
      const activeProjects = data.filter((p) => p.status === "active")
      setStats({
        totalProjects: data.length,
        activeProjects: activeProjects.length,
        totalBudget: data.reduce((sum, p) => sum + (p.budget_amount || 0), 0),
        totalHours: data.reduce((sum, p) => sum + (p.budget_hours || 0), 0),
        onTrackProjects: Math.floor(activeProjects.length * 0.7), // Mock data
        delayedProjects: Math.floor(activeProjects.length * 0.3), // Mock data
      })
    }

    setLoading(false)
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "on-hold":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div>Loading projects...</div>
  }

  if (selectedProject) {
    return <ProjectDetails projectId={selectedProject} onBack={() => setSelectedProject(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">Manage projects, tasks, milestones, and team collaboration</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-sm">Total Projects</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalProjects}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Active</span>
            </div>
            <p className="text-3xl font-bold">{stats.activeProjects}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Total Budget</span>
            </div>
            <p className="text-3xl font-bold">${(stats.totalBudget / 1000).toFixed(0)}k</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Total Hours</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalHours.toFixed(0)}h</p>
          </div>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">On Track</span>
            </div>
            <p className="text-3xl font-bold text-green-700">{stats.onTrackProjects}</p>
          </div>
        </Card>

        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Delayed</span>
            </div>
            <p className="text-3xl font-bold text-orange-700">{stats.delayedProjects}</p>
          </div>
        </Card>
      </div>

      {/* View Tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
            <TabsTrigger value="gantt">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                      {project.customer && (
                        <p className="text-sm text-muted-foreground">{project.customer.company_name}</p>
                      )}
                    </div>
                    <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                  </div>

                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{project.budget_hours || 0}h</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>${project.budget_amount?.toFixed(0) || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>3</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setSelectedProject(project.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <h3 className="font-semibold">{project.name}</h3>
                    {project.customer && (
                      <p className="text-sm text-muted-foreground">{project.customer.company_name}</p>
                    )}
                  </div>
                  <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{project.budget_hours || 0}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span>${project.budget_amount?.toFixed(0) || 0}</span>
                  </div>
                  <div className="w-32">
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="gantt">
          <ProjectGantt projects={projects} />
        </TabsContent>
      </Tabs>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            loadProjects()
          }}
        />
      )}
    </div>
  )
}
