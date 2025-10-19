"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  name: string
  status: string
  start_date: string | null
  end_date: string | null
}

interface ProjectGanttProps {
  projects: Project[]
}

export function ProjectGantt({ projects }: ProjectGanttProps) {
  // Simple timeline visualization
  const today = new Date()
  const monthsToShow = 6
  const months = Array.from({ length: monthsToShow }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() + i, 1)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  })

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Project Timeline</h3>

        {/* Timeline Header */}
        <div className="flex gap-2 border-b pb-2">
          <div className="w-48 font-medium">Project</div>
          <div className="flex-1 grid grid-cols-6 gap-2">
            {months.map((month) => (
              <div key={month} className="text-center text-sm text-muted-foreground">
                {month}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="flex gap-2 items-center">
              <div className="w-48">
                <p className="font-medium text-sm truncate">{project.name}</p>
                <Badge variant="outline" className="text-xs">
                  {project.status}
                </Badge>
              </div>
              <div className="flex-1 grid grid-cols-6 gap-2">
                {/* Mock timeline bar */}
                <div className="col-span-3 bg-blue-200 rounded h-8 flex items-center px-2">
                  <div className="w-full bg-blue-500 h-2 rounded" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
