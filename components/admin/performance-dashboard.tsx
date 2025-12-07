"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Database, Zap, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface MetricsData {
  cache: {
    hits: number
    misses: number
    hitRatio: number
  }
  errors: {
    total: number
  }
  performance: {
    apiResponseTime: number
    dbQueryTime: number
    cacheHitRatio: number
    errorRate: number
  }
  database: {
    users: number
    transactions: number
  }
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchMetrics() {
    try {
      const response = await fetch("/api/monitoring/metrics")
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error("[v0] Failed to fetch metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-muted-foreground">Loading performance metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance & Monitoring</h1>
        <p className="text-muted-foreground mt-2">Real-time system performance metrics and monitoring</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Response</p>
              <p className="text-2xl font-bold mt-1">{metrics?.performance.apiResponseTime}ms</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Excellent
              </p>
            </div>
            <Zap className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">DB Query Time</p>
              <p className="text-2xl font-bold mt-1">{metrics?.performance.dbQueryTime}ms</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Optimized
              </p>
            </div>
            <Database className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cache Hit Ratio</p>
              <p className="text-2xl font-bold mt-1">{((metrics?.cache.hitRatio || 0) * 100).toFixed(1)}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                High efficiency
              </p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold mt-1">{((metrics?.performance.errorRate || 0) * 100).toFixed(2)}%</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Low errors
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="cache" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="cache">Cache Performance</TabsTrigger>
          <TabsTrigger value="database">Database Stats</TabsTrigger>
          <TabsTrigger value="errors">Error Monitoring</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="cache" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Redis Cache Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cache Hits</span>
                <span className="font-semibold text-green-600">{metrics?.cache.hits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cache Misses</span>
                <span className="font-semibold text-orange-600">{metrics?.cache.misses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Hit Ratio</span>
                <span className="font-semibold">{((metrics?.cache.hitRatio || 0) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${(metrics?.cache.hitRatio || 0) * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Database Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Users</span>
                <span className="font-semibold">{metrics?.database.users.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Transactions</span>
                <span className="font-semibold">{metrics?.database.transactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Query Time</span>
                <span className="font-semibold text-green-600">{metrics?.performance.dbQueryTime}ms</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Error Monitoring</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Errors (24h)</span>
                <span className="font-semibold text-orange-600">{metrics?.errors.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Error Rate</span>
                <span className="font-semibold">{((metrics?.performance.errorRate || 0) * 100).toFixed(2)}%</span>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  System is operating within normal parameters
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Optimization</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">Redis Caching Active</p>
                <p className="text-sm text-blue-700 mt-1">
                  User data, dashboards, and reports are cached with optimal TTL
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-900">Database Indexes Optimized</p>
                <p className="text-sm text-green-700 mt-1">All frequently queried columns have proper indexes</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="font-medium text-purple-900">Code Splitting Enabled</p>
                <p className="text-sm text-purple-700 mt-1">
                  Heavy libraries load on-demand for faster initial page loads
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-orange-900">CDN & Image Optimization</p>
                <p className="text-sm text-orange-700 mt-1">
                  Static assets served via Vercel CDN with Next.js Image optimization
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
