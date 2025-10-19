"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Key, Activity, CreditCard, Settings, Code, BarChart3, Zap } from "lucide-react"
import Link from "next/link"
import { requirePaidSubscription } from "@/lib/auth/check-subscription"

export default async function DeveloperPortalPage() {
  await requirePaidSubscription()

  const apiKeys = [
    {
      name: "Production Key",
      key: "pk_live_••••••••••••••••3x9K",
      created: "Jan 15, 2025",
      lastUsed: "2 hours ago",
      status: "active",
    },
    {
      name: "Test Key",
      key: "pk_test_••••••••••••••••7mP2",
      created: "Jan 10, 2025",
      lastUsed: "5 minutes ago",
      status: "active",
    },
  ]

  const usageStats = [
    { label: "API Calls Today", value: "12,847", change: "+23%" },
    { label: "Success Rate", value: "99.97%", change: "+0.02%" },
    { label: "Avg Response Time", value: "48ms", change: "-5ms" },
    { label: "Monthly Usage", value: "387K / 1M", change: "38.7%" },
  ]

  const recentActivity = [
    { endpoint: "POST /api/v1/returns", status: 200, time: "2s ago", duration: "45ms" },
    { endpoint: "GET /api/v1/refund-estimate", status: 200, time: "5s ago", duration: "32ms" },
    { endpoint: "POST /api/v1/documents/upload", status: 201, time: "12s ago", duration: "156ms" },
    { endpoint: "GET /api/v1/returns/ret_abc123", status: 200, time: "18s ago", duration: "28ms" },
    { endpoint: "POST /api/v1/webhooks", status: 200, time: "25s ago", duration: "41ms" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Developer Portal</h1>
            <p className="text-xl text-muted-foreground">Manage your API keys, monitor usage, and track performance</p>
          </div>

          {/* Usage Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {usageStats.map((stat, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-green-500">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - API Keys & Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* API Keys */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Key className="w-6 h-6 text-accent" />
                    <h2 className="text-2xl font-bold">API Keys</h2>
                  </div>
                  <Link href="/developer-portal/keys/create">
                    <Button size="sm" className="glow-neon-strong">
                      Create New Key
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {apiKeys.map((key, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-background-alt"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold">{key.name}</p>
                          <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                            {key.status}
                          </span>
                        </div>
                        <code className="text-sm font-mono text-muted-foreground">{key.key}</code>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Created {key.created}</span>
                          <span>•</span>
                          <span>Last used {key.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/developer-portal/keys/${index === 0 ? "production" : "test"}/settings`}>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                </div>

                <div className="space-y-2">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-background-alt hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                            activity.status === 200 || activity.status === 201
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {activity.status}
                        </span>
                        <code className="text-sm font-mono">{activity.endpoint}</code>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{activity.duration}</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/developer-portal/logs">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Full Logs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Quick Links & Resources */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/api-docs">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Code className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                  </Link>
                  <Link href="/sandbox">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Zap className="w-4 h-4 mr-2" />
                      Test in Sandbox
                    </Button>
                  </Link>
                  <Link href="/developer-portal/analytics">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                  <Link href="/developer-portal/billing">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing Settings
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Rate Limits */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold mb-4">Rate Limits</h3>
                <div className="space-y-4">
                  <Link href="/developer-portal/rate-limits" className="block hover:opacity-80 transition-opacity">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Requests per minute</span>
                        <span className="text-sm font-semibold">847 / 1000</span>
                      </div>
                      <div className="h-2 rounded-full bg-background-alt overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: "84.7%" }}></div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/developer-portal/rate-limits" className="block hover:opacity-80 transition-opacity">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Monthly quota</span>
                        <span className="text-sm font-semibold">387K / 1M</span>
                      </div>
                      <div className="h-2 rounded-full bg-background-alt overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "38.7%" }}></div>
                      </div>
                    </div>
                  </Link>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>

              {/* System Status */}
              <div className="rounded-2xl border border-accent/30 bg-card p-6 glow-neon">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <h3 className="text-xl font-bold">All Systems Operational</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  API uptime: 99.99%
                  <br />
                  Last incident: 47 days ago
                </p>
                <Link href="/developer-portal/status">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View Status Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
