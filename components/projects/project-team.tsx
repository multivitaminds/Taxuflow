"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

interface ProjectTeamProps {
  projectId: string
}

export function ProjectTeam({ projectId }: ProjectTeamProps) {
  // Mock team data
  const team = [
    { id: "1", name: "John Doe", role: "Project Manager", allocation: 100 },
    { id: "2", name: "Jane Smith", role: "Developer", allocation: 80 },
    { id: "3", name: "Bob Johnson", role: "Designer", allocation: 50 },
  ]

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Team Members</h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="space-y-3">
        {team.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <Badge variant="secondary">{member.allocation}% allocated</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
