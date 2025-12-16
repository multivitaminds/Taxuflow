"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Shield, Database, Zap } from "lucide-react"

export default function MonitoringPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)
  const [securityEvents, setSecurityEvents] = useState<any[]>([])

  useEffect(() => {
    checkAuth()
    fetchMonitoringData()
    const interval = setInterval(fetchMonitoringData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  async function checkAuth() {
    const supabase = createBrowserClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push("/admin/login")
      return
    }

    const { data: admin } = await supabase.from("admin_users").select("*").eq("user_id", session.user.id).single()

    if (!admin) {
      router.push("/admin/unauthorized")
      return
    }

    setLoading(false)
  }

  async function fetchMonitoringData() {
    setRefreshing(true)
    try {
      // Fetch system health
      const healthRes = await fetch("/api/health")
      const healthData = await healthRes.json()
      setSystemHealth(healthData)

      // Fetch metrics
      const metricsRes = await fetch("/api/monitoring/metrics")
      const metricsData = await metricsRes.json()
      setMetrics(metricsData)

      // Fetch recent security events
      const supabase = createBrowserClient()
      const { data: events } = await supabase
        .from("security_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      setSecurityEvents(events || [])
    } catch (error) {
      console.error("[v0] Failed to fetch monitoring data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "error":
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Production Monitoring</h1>
            <p className="text-muted-foreground mt-2">Real-time system health and performance metrics</p>
          </div>
          <Button onClick={fetchMonitoringData} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemHealth?.status || "unknown")}
                <span className={`text-2xl font-bold ${getStatusColor(systemHealth?.status || "unknown")}`}>
                  {systemHealth?.status || "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(systemHealth?.checks?.database || "unknown")}
                <span className={`text-2xl font-bold ${getStatusColor(systemHealth?.checks?.database || "unknown")}`}>
                  {systemHealth?.checks?.database || "Unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">API Performance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.performance?.avgResponseTime ? `${metrics.performance.avgResponseTime}ms` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Security Events</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 10 events</p>
            </CardContent>
          </Card>
        </div>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Status of all connected third-party services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {systemHealth?.integrations &&
                Object.entries(systemHealth.integrations).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">{key}</span>
                    <Badge variant={value ? "default" : "secondary"}>{value ? "Connected" : "Not Configured"}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Last 10 security-related events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent security events</p>
              ) : (
                securityEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            event.severity === "critical"
                              ? "destructive"
                              : event.severity === "warning"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {event.severity}
                        </Badge>
                        <span className="font-medium">{event.event_type}</span>
                      </div>
                      {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        {metrics?.performance && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                  <div className="text-2xl font-bold mt-1">{metrics.performance.totalRequests || 0}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                  <div className="text-2xl font-bold mt-1">{metrics.performance.successRate || "0"}%</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Error Rate</div>
                  <div className="text-2xl font-bold mt-1">{metrics.performance.errorRate || "0"}%</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                  <div className="text-2xl font-bold mt-1">{metrics.performance.avgResponseTime || 0}ms</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Platform version and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Version</div>
                <div className="font-medium mt-1">{systemHealth?.version || "Unknown"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="font-medium mt-1">
                  {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleString() : "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
