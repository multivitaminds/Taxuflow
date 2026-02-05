"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  XCircle,
  Clock,
  GitBranch,
  Rocket,
  RefreshCw,
  ExternalLink,
  Terminal,
  Activity,
} from "lucide-react"

interface DeploymentStatus {
  id: string
  status: "success" | "failed" | "building" | "queued"
  environment: "production" | "preview"
  branch: string
  commit: string
  commitMessage: string
  author: string
  createdAt: string
  duration: number
  url?: string
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [buildStats, setBuildStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    avgDuration: 0,
  })

  useEffect(() => {
    fetchDeployments()
    const interval = setInterval(fetchDeployments, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchDeployments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/deployments")
      const data = await response.json()
      setDeployments(data.deployments)
      setBuildStats(data.stats)
    } catch (error) {
      console.error("[v0] Failed to fetch deployments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "building":
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case "queued":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      failed: "destructive",
      building: "secondary",
      queued: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deployment Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor builds and deployments for taxu.io</p>
        </div>
        <Button onClick={fetchDeployments} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deployments</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{buildStats.successful}</div>
            <p className="text-xs text-muted-foreground">
              {buildStats.total > 0 ? Math.round((buildStats.successful / buildStats.total) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{buildStats.failed}</div>
            <p className="text-xs text-muted-foreground">
              {buildStats.total > 0 ? Math.round((buildStats.failed / buildStats.total) * 100) : 0}% failure rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildStats.avgDuration}s</div>
            <p className="text-xs text-muted-foreground">Build time</p>
          </CardContent>
        </Card>
      </div>

      {/* Deployments List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Deployments</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                Loading deployments...
              </CardContent>
            </Card>
          ) : deployments.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">No deployments found</CardContent>
            </Card>
          ) : (
            deployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">{getStatusIcon(deployment.status)}</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-base">{deployment.commitMessage}</CardTitle>
                          {getStatusBadge(deployment.status)}
                        </div>
                        <CardDescription>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="flex items-center">
                              <GitBranch className="h-3 w-3 mr-1" />
                              {deployment.branch}
                            </span>
                            <span>by {deployment.author}</span>
                            <span>{new Date(deployment.createdAt).toLocaleString()}</span>
                            <span>{deployment.duration}s</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {deployment.url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Visit
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Terminal className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="production">
          {/* Filter production deployments */}
          {deployments
            .filter((d) => d.environment === "production")
            .map((deployment) => (
              <Card key={deployment.id}>{/* Same card content as above */}</Card>
            ))}
        </TabsContent>

        <TabsContent value="preview">
          {/* Filter preview deployments */}
          {deployments
            .filter((d) => d.environment === "preview")
            .map((deployment) => (
              <Card key={deployment.id}>{/* Same card content as above */}</Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
