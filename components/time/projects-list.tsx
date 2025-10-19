"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, DollarSign, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ProjectForm } from "./project-form"

interface Project {
  id: string
  name: string
  description: string
  status: string
  billing_type: string
  budget_hours: number | null
  budget_amount: number | null
  customer?: {
    company_name: string
  }
}

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
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

    if (data) setProjects(data)
    setLoading(false)
  }

  if (loading) {
    return <div>Loading projects...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  {project.customer && <p className="text-sm text-muted-foreground">{project.customer.company_name}</p>}
                </div>
                <Badge variant={project.status === "active" ? "default" : "secondary"}>{project.status}</Badge>
              </div>

              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">{project.budget_hours ? `${project.budget_hours}h` : "No limit"}</span>
                </div>
                {project.budget_hours && <Progress value={45} className="h-2" />}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>0h tracked</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span>${project.budget_amount?.toFixed(0) || "0"}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

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
