"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FolderKanban, Plus, Search, DollarSign, Clock, CheckCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ProjectsDashboardClientProps {
  user: User
}

export function ProjectsDashboardClient({ user }: ProjectsDashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetchProjects()
  }, [user.id])

  const fetchProjects = async () => {
    setLoading(false)
    // TODO: Fetch actual projects from database
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Projects</h1>
              <p className="text-muted-foreground">Track project profitability and time</p>
            </div>
            <Button
              onClick={() => router.push("/accounting/projects/new")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <FolderKanban className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-muted-foreground">Total Projects</span>
            </div>
            <div className="text-3xl font-bold">{projects.length}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Active Projects</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">0</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <div className="text-3xl font-bold text-green-500">$0</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="text-3xl font-bold text-purple-500">0</div>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Projects</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 bg-background border border-neon/20 rounded-lg focus:outline-none focus:border-neon/40"
                />
              </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">Create your first project to track time and profitability</p>
              <Button
                onClick={() => router.push("/accounting/projects/new")}
                className="bg-neon hover:bg-neon/90 text-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/accounting/projects/${project.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.client}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${project.revenue || 0}</div>
                    <div className="text-sm text-muted-foreground">{project.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/invoices/dashboard")}
            className="border-neon/20"
          >
            View Invoices
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/customers/dashboard")}
            className="border-neon/20"
          >
            View Customers
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/reports/dashboard")}
            className="border-neon/20"
          >
            View Reports
          </Button>
        </div>
      </div>
    </div>
  )
}
