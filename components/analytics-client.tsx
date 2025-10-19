"use client"
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function AnalyticsClient() {
  const requestData = [
    { date: "Jan 10", requests: 8500, errors: 12 },
    { date: "Jan 11", requests: 9200, errors: 8 },
    { date: "Jan 12", requests: 11000, errors: 15 },
    { date: "Jan 13", requests: 10500, errors: 10 },
    { date: "Jan 14", requests: 12800, errors: 18 },
    { date: "Jan 15", requests: 13500, errors: 14 },
    { date: "Today", requests: 12847, errors: 9 },
  ]

  const endpointData = [
    { endpoint: "/api/v1/returns", calls: 4523, avgTime: "45ms" },
    { endpoint: "/api/v1/refund-estimate", calls: 3891, avgTime: "32ms" },
    { endpoint: "/api/v1/documents/upload", calls: 2156, avgTime: "156ms" },
    { endpoint: "/api/v1/deductions", calls: 1847, avgTime: "38ms" },
    { endpoint: "/api/v1/webhooks", calls: 430, avgTime: "41ms" },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">API Analytics</h1>
        <p className="text-xl text-muted-foreground">Monitor performance, usage patterns, and error rates</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground">Total Requests</p>
          </div>
          <p className="text-3xl font-bold mb-1">12,847</p>
          <div className="flex items-center gap-1 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+23% from yesterday</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <p className="text-3xl font-bold mb-1">99.97%</p>
          <div className="flex items-center gap-1 text-sm text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+0.02% improvement</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-muted-foreground">Avg Response</p>
          </div>
          <p className="text-3xl font-bold mb-1">48ms</p>
          <div className="flex items-center gap-1 text-sm text-green-500">
            <TrendingDown className="w-4 h-4" />
            <span>-5ms faster</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-muted-foreground">Error Rate</p>
          </div>
          <p className="text-3xl font-bold mb-1">0.03%</p>
          <div className="flex items-center gap-1 text-sm text-red-500">
            <TrendingUp className="w-4 h-4" />
            <span>+0.01% increase</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-6">Request Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={requestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="requests" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold mb-6">Error Tracking</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={requestData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="errors" fill="hsl(var(--destructive))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-bold mb-6">Top Endpoints</h2>
        <div className="space-y-4">
          {endpointData.map((endpoint, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-background"
            >
              <div className="flex-1">
                <code className="font-mono text-sm">{endpoint.endpoint}</code>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div className="text-right">
                  <p className="text-muted-foreground">Calls</p>
                  <p className="font-semibold">{endpoint.calls.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Avg Time</p>
                  <p className="font-semibold">{endpoint.avgTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
