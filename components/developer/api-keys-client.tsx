"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Copy, Trash2, Plus, Shield, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  environment: string
  is_active: boolean
  created_at: string
  last_used_at: string | null
  usage_count: number
}

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"test" | "production">("test")
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const response = await fetch("/api/developer/keys")
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
      const response = await fetch("/api/developer/keys", {
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
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/50" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Keep your API keys secure</p>
              <p className="text-sm text-muted-foreground">
                Never expose your API keys in client-side code, public repositories, or insecure locations. Always use
                environment variables and server-side code to keep your keys secure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your API Keys</h2>
          <p className="text-muted-foreground">Manage authentication keys for the Taxu API</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Key
        </Button>
      </div>

      {/* Keys List */}
      {keys.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Key className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No API keys yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Create your first API key to start making authenticated requests to the Taxu API
            </p>
            <Button onClick={() => setShowCreateModal(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Create API Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {keys.map((key) => (
            <Card key={key.id} className={!key.is_active ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${key.is_active ? "bg-green-500" : "bg-red-500"}`} />
                    <div>
                      <CardTitle className="text-lg">{key.name}</CardTitle>
                      <CardDescription className="font-mono text-xs mt-1">{key.key_prefix}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(key.key_prefix)} className="gap-2">
                      <Copy className="w-3 h-3" />
                      Copy
                    </Button>
                    {key.is_active && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeKey(key.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Environment</p>
                    <p className="font-medium capitalize flex items-center gap-2">
                      {key.environment}
                      {key.environment === "production" && <Shield className="w-3 h-3 text-amber-500" />}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Usage</p>
                    <p className="font-medium">{key.usage_count.toLocaleString()} requests</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Last Used</p>
                    <p className="font-medium">
                      {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Create API Key</CardTitle>
              <CardDescription>Generate a new API key for authenticating your requests</CardDescription>
            </CardHeader>
            <CardContent>
              {createdKey ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Save this key now - it won't be shown again!
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs font-mono bg-background p-3 rounded border overflow-x-auto">
                        {createdKey}
                      </code>
                      <Button size="sm" onClick={() => copyToClipboard(createdKey)} className="gap-2">
                        <Copy className="w-3 h-3" />
                        Copy
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
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Environment</label>
                    <select
                      value={newKeyEnvironment}
                      onChange={(e) => setNewKeyEnvironment(e.target.value as "production" | "test")}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    >
                      <option value="test">Test</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={createKey} className="flex-1">
                      Create Key
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
