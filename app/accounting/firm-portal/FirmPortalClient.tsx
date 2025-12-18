"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Users, FileText, Clock, AlertCircle, Search, Plus, DollarSign } from "lucide-react"
import Link from "next/link"

export default function FirmPortalClient() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { label: "Total Clients", value: "47", change: "+3", icon: Building, color: "blue" },
    { label: "Active Projects", value: "89", change: "+12", icon: FileText, color: "green" },
    { label: "Revenue (MTD)", value: "$124K", change: "+18%", icon: DollarSign, color: "purple" },
    { label: "Billable Hours", value: "1,847", change: "+5%", icon: Clock, color: "orange" },
  ]

  const clients = [
    {
      id: 1,
      name: "Acme Corporation",
      industry: "Technology",
      status: "Active",
      revenue: "$45,000",
      projects: 3,
      lastActivity: "2 hours ago",
      teamMembers: ["Sarah J.", "Mike C."],
      urgentTasks: 2,
    },
    {
      id: 2,
      name: "TechStart Inc",
      industry: "Software",
      status: "Active",
      revenue: "$32,500",
      projects: 2,
      lastActivity: "1 day ago",
      teamMembers: ["Emily R.", "David K."],
      urgentTasks: 0,
    },
    {
      id: 3,
      name: "Global Ventures",
      industry: "Finance",
      status: "Review",
      revenue: "$67,800",
      projects: 5,
      lastActivity: "3 hours ago",
      teamMembers: ["Jessica T.", "Robert M."],
      urgentTasks: 4,
    },
  ]

  const projects = [
    {
      id: 1,
      client: "Acme Corporation",
      title: "Q2 2024 Tax Return",
      type: "Tax Filing",
      dueDate: "2024-07-15",
      progress: 75,
      status: "In Progress",
      assignee: "Sarah Johnson",
    },
    {
      id: 2,
      client: "TechStart Inc",
      title: "Monthly Bookkeeping",
      type: "Accounting",
      dueDate: "2024-06-30",
      progress: 100,
      status: "Completed",
      assignee: "Emily Rodriguez",
    },
    {
      id: 3,
      client: "Global Ventures",
      title: "Financial Audit",
      type: "Audit",
      dueDate: "2024-07-30",
      progress: 45,
      status: "In Progress",
      assignee: "Jessica Taylor",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Accounting Firm Portal</h1>
              <p className="text-muted-foreground">Multi-client management and collaboration platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Team
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                <Plus className="h-4 w-4" />
                New Client
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="p-6 border-border hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">{stat.change}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Urgent Tasks */}
              <Card className="border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Urgent Tasks
                  </h2>
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">6 Items</Badge>
                </div>
                <div className="divide-y divide-border">
                  {clients
                    .filter((c) => c.urgentTasks > 0)
                    .map((client) => (
                      <div key={client.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{client.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{client.urgentTasks} urgent tasks</p>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              {/* Recent Projects */}
              <Card className="border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
                  <Link href="/accounting/firm-portal?tab=projects">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <Badge
                          className={
                            project.status === "Completed"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Team Capacity */}
            <Card className="border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Team Capacity</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Sarah Johnson", utilization: 85, projects: 5, hours: 168 },
                    { name: "Emily Rodriguez", utilization: 72, projects: 4, hours: 144 },
                    { name: "David Kim", utilization: 91, projects: 6, hours: 182 },
                  ].map((member) => (
                    <Card key={member.name} className="p-4 border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.projects} projects</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">{member.utilization}%</p>
                          <p className="text-xs text-muted-foreground">{member.hours}h</p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            member.utilization > 85
                              ? "bg-gradient-to-r from-orange-500 to-red-500"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600"
                          }`}
                          style={{ width: `${member.utilization}%` }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="border-border hover:shadow-lg transition-all cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{client.name}</h3>
                        <p className="text-muted-foreground">{client.industry}</p>
                      </div>
                      <Badge
                        className={
                          client.status === "Active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }
                      >
                        {client.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Revenue (YTD)</p>
                        <p className="text-lg font-semibold text-foreground">{client.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                        <p className="text-lg font-semibold text-foreground">{client.projects}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{client.teamMembers.join(", ")}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>

                    {client.urgentTasks > 0 && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-900 font-medium">
                          {client.urgentTasks} urgent {client.urgentTasks === 1 ? "task" : "tasks"}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="border-border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Project</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Client</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Type</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Due Date</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Progress</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-semibold text-foreground">{project.title}</td>
                        <td className="p-4 text-muted-foreground">{project.client}</td>
                        <td className="p-4">
                          <Badge variant="outline">{project.type}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{project.dueDate}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{project.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              project.status === "Completed"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }
                          >
                            {project.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{project.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="p-6 border-border text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Team Management</h3>
              <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Team Member
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
