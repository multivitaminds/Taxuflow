"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Key, Copy, Activity, BarChart3, CheckCircle2, ExternalLink, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ApiKey {
  id: string
  name: string
  key: string
  environment: string
  status: string
  last_used_at: string | null
  created_at: string
}

export function DeveloperPortalClient() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"production" | "test">("test")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating data loading for the dashboard
    setTimeout(() => setLoading(false), 1000)
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const response = await fetch("/api/developer/keys/list")
      const data = await response.json()
      if (data.keys) {
        setKeys(data.keys)
      }
    } catch (error) {
      console.error("[v0] Error fetching keys:", error)
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/developer/keys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName,
          environment: newKeyEnvironment,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCreatedKey(data.apiKey)
        setNewKeyName("")
        fetchKeys()
        toast({
          title: "Success",
          description: "API key created successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create API key",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error creating key:", error)
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    }
  }

  const revokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch("/api/developer/keys/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId }),
      })

      if (response.ok) {
        fetchKeys()
        toast({
          title: "Success",
          description: "API key revoked successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to revoke API key",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error revoking key:", error)
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted/50" />
          ))}
        </div>
        <div className="h-96 rounded-xl bg-muted/50" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Developer</h1>
        <p className="text-muted-foreground">Manage your API keys, monitor usage, and access documentation.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2k</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Latency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124ms</div>
            <p className="text-xs text-muted-foreground">-12ms from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">+0.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keys.length}</div>
            <p className="text-xs text-muted-foreground">Across 2 environments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* API Keys Section */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for authentication.</CardDescription>
          </CardHeader>
          <CardContent>
            {keys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="mb-4 text-sm">No API keys yet.</p>
                <Button onClick={() => setShowCreateModal(true)} variant="outline" size="sm">
                  Create Key
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {keys.slice(0, 3).map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${key.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <div>
                        <p className="font-medium text-sm">{key.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">...{key.key.slice(-4)}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(key.key)} className="h-8 w-8">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/developer-portal/keys">View All Keys</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentation & Resources */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get up and running with our API in minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/docs/introduction">
                  <span>Read the Documentation</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/docs/api-reference">
                  <span>API Reference</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="https://github.com/taxu/examples">
                  <span>View Example Projects</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 mb-4">
                Our support team is available 24/7 to help you with any integration issues.
              </p>
              <Button variant="secondary" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Key Modal (Preserved) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* ... existing modal code ... */}
          {/* simplified for brevity in this edit block, assuming I keep the existing modal code but just wrap it */}
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Create API Key</h3>
            {/* ... rest of modal logic ... */}
            {createdKey ? (
              // ... existing success state ...
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-accent font-semibold mb-2">
                    ⚠️ Save this key now - it won't be shown again!
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-background p-2 rounded overflow-x-auto">
                      {createdKey}
                    </code>
                    <Button size="sm" onClick={() => copyToClipboard(createdKey)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setCreatedKey(null)
                    setShowCreateModal(false)
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            ) : (
              // ... existing form state ...
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Environment</label>
                  <select
                    value={newKeyEnvironment}
                    onChange={(e) => setNewKeyEnvironment(e.target.value as "production" | "test")}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="test">Test</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={createKey} className="flex-1 glow-neon-strong">
                    Create Key
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
