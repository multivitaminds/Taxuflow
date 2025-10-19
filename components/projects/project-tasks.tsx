"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Task {
  id: string
  name: string
  description: string
  status: string
  priority: string
  due_date: string | null
  estimated_hours: number | null
}

interface ProjectTasksProps {
  projectId: string
}

export function ProjectTasks({ projectId }: ProjectTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTasks()
  }, [projectId])

  async function loadTasks() {
    const { data } = await supabase.from("project_tasks").select("*").eq("project_id", projectId).order("created_at")

    if (data) setTasks(data)
    setLoading(false)
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return <div>Loading tasks...</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tasks yet. Create your first task to get started.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent">
              <Checkbox />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{task.name}</h4>
                  <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  <Badge variant="outline">{task.status}</Badge>
                </div>
                {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {task.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  )}
                  {task.estimated_hours && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.estimated_hours}h
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
