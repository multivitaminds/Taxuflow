"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Key, BookOpen, Webhook, BarChart3, Terminal, Zap, ArrowRight, Copy, Check, Activity } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function DeveloperDashboard({ user, profile }: any) {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApiKeys()
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/developer/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadApiKeys = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3)

    setApiKeys(data || [])
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const resources = [
    {
      icon: BookOpen,
      title: "API Documentation",
      description: "Complete API reference with examples",
      href: "/developer/docs",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Key,
      title: "API Keys",
      description: "Manage your API authentication",
      href: "/developer-portal/settings",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Set up real-time event notifications",
      href: "/developer/webhooks",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Terminal,
      title: "SDK & Libraries",
      description: "Client libraries for popular languages",
      href: "/developer/sdk",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Monitor API usage and performance",
      href: "/developer-portal",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Zap,
      title: "Quickstart",
      description: "Get started in 5 minutes",
      href: "/developer/quickstart",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Developer Portal</h1>
          <p className="text-lg text-slate-400">Build tax automation into your products with Taxu APIs</p>
        </div>

        {/* Real-time Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Total Requests</span>
                <BarChart3 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalRequests?.toLocaleString() || "0"}</div>
              <div className="text-xs text-green-400">Last 7 days</div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Success Rate</span>
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.successRate ? `${stats.successRate.toFixed(1)}%` : "0%"}
              </div>
              <div className="text-xs text-slate-400">{stats.successfulRequests || 0} successful</div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Avg Response Time</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.avgResponseTime ? `${Math.round(stats.avgResponseTime)}ms` : "0ms"}
              </div>
              <div className="text-xs text-slate-400">Average latency</div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Error Rate</span>
                <Activity className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.errorRate ? `${stats.errorRate.toFixed(1)}%` : "0%"}
              </div>
              <div className="text-xs text-red-400">{stats.failedRequests || 0} failed</div>
            </Card>
          </div>
        )}

        {/* API Keys Section */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Your API Keys</h3>
              <p className="text-slate-400">Use these keys to authenticate your API requests</p>
            </div>
            <Link href="/developer-portal/settings">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Key className="w-4 h-4 mr-2" />
                Manage Keys
              </Button>
            </Link>
          </div>

          {apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{key.name}</p>
                    <p className="text-sm text-slate-400 font-mono">
                      {key.key_prefix}••••••••••••••••{key.key_suffix}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        key.environment === "production"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {key.environment}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(key.key_prefix + key.key_suffix, key.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedKey === key.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No API keys yet</p>
              <Link href="/developer-portal/settings">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Your First Key</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Start */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Start</h3>
          <div className="bg-slate-950/50 rounded-lg p-6 border border-white/10">
            <pre className="text-sm text-slate-300 overflow-x-auto">
              <code>{`curl https://api.taxu.io/v1/filings \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tax_year": 2024,
    "form_type": "1099-NEC",
    "recipient": {
      "name": "John Doe",
      "tin": "123-45-6789"
    }
  }'`}</code>
            </pre>
          </div>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Link key={resource.href} href={resource.href}>
              <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resource.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <resource.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-slate-400 mb-4">{resource.description}</p>
                <div className="flex items-center text-indigo-400 font-medium group-hover:translate-x-2 transition-transform">
                  Explore <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
