"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Webhook, Activity, Copy, Eye, EyeOff, Trash2, Plus, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface APIKey {
  id: string
  name: string
  key_prefix: string
  environment: "sandbox" | "production"
  permissions: string[]
  rate_limit: number
  last_used_at: string | null
  created_at: string
  is_active: boolean
}

interface WebhookEndpoint {
  id: string
  url: string
  description: string | null
  events: string[]
  environment: "sandbox" | "production"
  is_active: boolean
  created_at: string
}

interface APILog {
  id: string
  method: string
  endpoint: string
  status_code: number
  duration_ms: number
  created_at: string
}

export default function DeveloperDashboardClient({
  apiKeys: initialApiKeys,
  webhookEndpoints: initialWebhookEndpoints,
  apiLogs: initialApiLogs,
}: {
  apiKeys: APIKey[]
  webhookEndpoints: WebhookEndpoint[]
  apiLogs: APILog[]
}) {
  const [apiKeys, setApiKeys] = useState(initialApiKeys)
  const [webhookEndpoints, setWebhookEndpoints] = useState(initialWebhookEndpoints)
  const [apiLogs] = useState(initialApiLogs)
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"sandbox" | "production">("sandbox")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const createAPIKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      })
      return
    }

    const response = await fetch("/api/developer/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newKeyName,
        environment: newKeyEnvironment,
      }),
    })

    if (response.ok) {
      const { key, apiKey } = await response.json()
      setGeneratedKey(key)
      setApiKeys([apiKey, ...apiKeys])
      setNewKeyName("")
      toast({
        title: "API Key Created",
        description: "Make sure to copy your key now. You won't be able to see it again!",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    }
  }

  const deleteAPIKey = async (id: string) => {
    const response = await fetch(`/api/developer/keys/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      setApiKeys(apiKeys.filter((key) => key.id !== id))
      toast({
        title: "API Key Deleted",
        description: "The API key has been permanently deleted",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    })
  }

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisibleKeys(newVisible)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your API keys, webhooks, and monitor API usage</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys" className="gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="gap-2">
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Activity className="h-4 w-4" />
              API Logs
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">API Keys</h2>
                <p className="text-muted-foreground">Create and manage API keys for authentication</p>
              </div>
              <Button onClick={() => setShowNewKeyDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>

            {showNewKeyDialog && (
              <Card className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Create New API Key</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="Production API Key"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select
                      value={newKeyEnvironment}
                      onValueChange={(value: "sandbox" | "production") => setNewKeyEnvironment(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {generatedKey && (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium text-destructive">
                        ⚠️ Save this key now! You won't be able to see it again.
                      </p>
                      <div className="flex gap-2">
                        <Input value={generatedKey} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedKey)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={createAPIKey} disabled={!!generatedKey}>
                      Create Key
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewKeyDialog(false)
                        setGeneratedKey(null)
                        setNewKeyName("")
                      }}
                    >
                      {generatedKey ? "Done" : "Cancel"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {apiKeys.map((key) => (
                <Card key={key.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{key.name}</h3>
                        <Badge variant={key.environment === "production" ? "default" : "secondary"}>
                          {key.environment}
                        </Badge>
                        {key.is_active ? (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {visibleKeys.has(key.id) ? key.key_prefix : key.key_prefix + "••••••••••••"}
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(key.id)}>
                          {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(key.key_prefix)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Rate Limit: {key.rate_limit} requests/hour</p>
                        <p>Last used: {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : "Never"}</p>
                        <p>Created: {new Date(key.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAPIKey(key.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}

              {apiKeys.length === 0 && (
                <Card className="p-12 text-center">
                  <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
                  <p className="text-muted-foreground mb-4">Create your first API key to start using the Taxu API</p>
                  <Button onClick={() => setShowNewKeyDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Webhook Endpoints</h2>
                <p className="text-muted-foreground">Receive real-time notifications for events</p>
              </div>
              <Button onClick={() => setShowNewWebhookDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Endpoint
              </Button>
            </div>

            <div className="space-y-4">
              {webhookEndpoints.map((endpoint) => (
                <Card key={endpoint.id} className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.url}</code>
                        {endpoint.description && (
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        )}
                      </div>
                      <Badge variant={endpoint.environment === "production" ? "default" : "secondary"}>
                        {endpoint.environment}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.events.map((event) => (
                        <Badge key={event} variant="outline">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(endpoint.created_at).toLocaleString()}
                    </p>
                  </div>
                </Card>
              ))}

              {webhookEndpoints.length === 0 && (
                <Card className="p-12 text-center">
                  <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Webhook Endpoints</h3>
                  <p className="text-muted-foreground mb-4">
                    Add a webhook endpoint to receive real-time event notifications
                  </p>
                  <Button onClick={() => setShowNewWebhookDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Endpoint
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* API Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">API Request Logs</h2>
              <p className="text-muted-foreground">Monitor your API usage and performance</p>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Method</th>
                      <th className="p-4 font-medium">Endpoint</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Duration</th>
                      <th className="p-4 font-medium">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiLogs.map((log) => (
                      <tr key={log.id} className="border-b last:border-0">
                        <td className="p-4">
                          <Badge variant="outline">{log.method}</Badge>
                        </td>
                        <td className="p-4">
                          <code className="text-sm">{log.endpoint}</code>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              log.status_code < 300 ? "default" : log.status_code < 400 ? "secondary" : "destructive"
                            }
                          >
                            {log.status_code}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{log.duration_ms}ms</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {apiLogs.length === 0 && (
                <div className="p-12 text-center">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No API Requests</h3>
                  <p className="text-muted-foreground">
                    API request logs will appear here once you start making requests
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
