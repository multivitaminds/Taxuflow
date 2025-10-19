"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, DollarSign, Users, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ProjectTasks } from "./project-tasks"
import { ProjectMilestones } from "./project-milestones"
import { ProjectTeam } from "./project-team"
import { ProjectFiles } from "./project-files"
import { ProjectExpenses } from "./project-expenses"

interface ProjectDetailsProps {
  projectId: string
  onBack: () => void
}

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

export function ProjectDetails({ projectId, onBack }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProject()
  }, [projectId])

  async function loadProject() {
    const { data } = await supabase
      .from("projects")
      .select("*, customer:customers(company_name)")
      .eq("id", projectId)
      .single()

    if (data) setProject(data)
    setLoading(false)
  }

  if (loading || !project) {
    return <div>Loading project...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge>{project.status}</Badge>
          </div>
          {project.customer && <p className="text-muted-foreground">{project.customer.company_name}</p>}
        </div>
        <Button>Edit Project</Button>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold">45%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours Tracked</p>
              <p className="text-2xl font-bold">124h</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget Used</p>
              <p className="text-2xl font-bold">$12.4k</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Project Details Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <ProjectTasks projectId={projectId} />
        </TabsContent>

        <TabsContent value="milestones">
          <ProjectMilestones projectId={projectId} />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeam projectId={projectId} />
        </TabsContent>

        <TabsContent value="files">
          <ProjectFiles projectId={projectId} />
        </TabsContent>

        <TabsContent value="expenses">
          <ProjectExpenses projectId={projectId} />
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Activity</h3>
            <p className="text-muted-foreground">Activity log coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
