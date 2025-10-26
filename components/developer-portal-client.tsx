"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Key, Copy, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* API Keys Section */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">API Keys</h2>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="glow-neon-strong">
            Create New Key
          </Button>
        </div>

        {keys.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No API keys yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background-alt"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold">{key.name}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        key.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {key.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        key.environment === "production" ? "bg-accent/10 text-accent" : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {key.environment}
                    </span>
                  </div>
                  <code className="text-sm font-mono text-muted-foreground">{key.key}</code>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                    {key.last_used_at && (
                      <>
                        <span>•</span>
                        <span>Last used {new Date(key.last_used_at).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(key.key)}
                    className="bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {key.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => revokeKey(key.id)}
                      className="bg-transparent text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Create API Key</h3>

            {createdKey ? (
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
