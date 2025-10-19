"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Milestone {
  id: string
  name: string
  description: string
  due_date: string | null
  status: string
  progress_percentage: number
}

interface ProjectMilestonesProps {
  projectId: string
}

export function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadMilestones()
  }, [projectId])

  async function loadMilestones() {
    const { data } = await supabase.from("project_milestones").select("*").eq("project_id", projectId).order("due_date")

    if (data) setMilestones(data)
    setLoading(false)
  }

  if (loading) {
    return <div>Loading milestones...</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Milestones</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No milestones yet. Create milestones to track major project goals.
          </p>
        ) : (
          milestones.map((milestone) => (
            <div key={milestone.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Flag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-semibold">{milestone.name}</h4>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                  </div>
                </div>
                <Badge>{milestone.status}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{milestone.progress_percentage}%</span>
                </div>
                <Progress value={milestone.progress_percentage} className="h-2" />
              </div>

              {milestone.due_date && (
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(milestone.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
