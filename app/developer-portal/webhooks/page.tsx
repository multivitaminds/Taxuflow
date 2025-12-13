"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Trash2,
  TestTube,
  Activity,
  CheckCircle2,
  XCircle,
  Zap,
  Copy,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AVAILABLE_EVENTS = [
  {
    value: "tax.filing.created",
    label: "Tax Filing Created",
    category: "Tax Filing",
    description: "Triggered when a new tax filing is created",
  },
  {
    value: "tax.filing.submitted",
    label: "Tax Filing Submitted",
    category: "Tax Filing",
    description: "Triggered when a tax filing is submitted to IRS",
  },
  {
    value: "tax.filing.accepted",
    label: "Tax Filing Accepted",
    category: "Tax Filing",
    description: "Triggered when IRS accepts the filing",
  },
  {
    value: "tax.filing.rejected",
    label: "Tax Filing Rejected",
    category: "Tax Filing",
    description: "Triggered when IRS rejects the filing",
  },
  {
    value: "tax.filing.amended",
    label: "Tax Filing Amended",
    category: "Tax Filing",
    description: "Triggered when a filing is amended",
  },
  {
    value: "payment.succeeded",
    label: "Payment Succeeded",
    category: "Payments",
    description: "Triggered when a payment is successfully processed",
  },
  {
    value: "payment.failed",
    label: "Payment Failed",
    category: "Payments",
    description: "Triggered when a payment fails",
  },
  {
    value: "payment.refunded",
    label: "Payment Refunded",
    category: "Payments",
    description: "Triggered when a payment is refunded",
  },
  {
    value: "transaction.posted",
    label: "Transaction Posted",
    category: "Banking",
    description: "Triggered when a bank transaction is posted",
  },
  {
    value: "account.updated",
    label: "Account Updated",
    category: "Banking",
    description: "Triggered when account information changes",
  },
  {
    value: "transfer.completed",
    label: "Transfer Completed",
    category: "Banking",
    description: "Triggered when a transfer completes",
  },
  {
    value: "document.uploaded",
    label: "Document Uploaded",
    category: "Documents",
    description: "Triggered when a document is uploaded",
  },
  {
    value: "document.processed",
    label: "Document Processed",
    category: "Documents",
    description: "Triggered when document processing completes",
  },
  {
    value: "document.verified",
    label: "Document Verified",
    category: "Documents",
    description: "Triggered when a document is verified",
  },
]

export default function WebhooksManagementPage() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  useEffect(() => {
    loadWebhooks()
  }, [])

  async function loadWebhooks() {
    try {
      const response = await fetch("/api/webhooks/endpoints")
      if (response.ok) {
        const data = await response.json()
        setWebhooks(data.endpoints || [])
      }
    } catch (error) {
      console.error("Error loading webhooks:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    console.log("[v0] Create webhook called", { url, selectedEventsCount: selectedEvents.length })

    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a webhook endpoint URL",
        variant: "destructive",
      })
      return
    }

    if (selectedEvents.length === 0) {
      toast({
        title: "No events selected",
        description: "Please select at least one event to subscribe to",
        variant: "destructive",
      })
      return
    }

    try {
      new URL(url)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://api.example.com/webhooks)",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    console.log("[v0] Sending create webhook request", { url, events: selectedEvents })

    try {
      const response = await fetch("/api/webhooks/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          description,
          events: selectedEvents,
        }),
      })

      console.log("[v0] Create webhook response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Webhook created successfully:", data)

        toast({
          title: "Webhook created",
          description: "Your webhook endpoint has been created successfully",
        })
        setIsDialogOpen(false)
        setUrl("")
        setDescription("")
        setSelectedEvents([])
        loadWebhooks()
      } else {
        let errorMessage = "Failed to create webhook endpoint"
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
          console.error("[v0] Create webhook error:", error)
        } catch {
          const textError = await response.text()
          errorMessage = textError || errorMessage
          console.error("[v0] Create webhook text error:", textError)
        }

        if (response.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please sign in to create webhook endpoints",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error creating webhook",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("[v0] Create webhook exception:", error)
      toast({
        title: "Network error",
        description: error instanceof Error ? error.message : "Failed to connect to the server",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this webhook endpoint?")) return

    try {
      const response = await fetch(`/api/webhooks/endpoints/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Webhook deleted",
          description: "The webhook endpoint has been removed",
        })
        loadWebhooks()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      })
    }
  }

  async function handleTest(id: string) {
    try {
      const response = await fetch("/api/webhooks/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint_id: id }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Test successful",
          description: `Webhook responded with status ${result.status}`,
        })
      } else {
        toast({
          title: "Test failed",
          description: result.error || `HTTP ${result.status}: ${result.statusText}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Failed to send test webhook",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  const eventsByCategory = AVAILABLE_EVENTS.reduce(
    (acc, event) => {
      if (!acc[event.category]) acc[event.category] = []
      acc[event.category].push(event)
      return acc
    },
    {} as Record<string, typeof AVAILABLE_EVENTS>,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading webhooks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="gradient-stripe-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-white">Webhooks</h1>
              </div>
              <p className="max-w-2xl text-lg text-blue-100">
                Receive real-time notifications when events occur in your Taxu account. Build reactive integrations with
                our webhook infrastructure.
              </p>
              <div className="flex items-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Automatic retries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>HMAC signature verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Delivery logs</span>
                </div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 shadow-xl">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Endpoint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Create Webhook Endpoint</DialogTitle>
                  <DialogDescription>
                    Subscribe to events and receive real-time notifications when they occur
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-base font-semibold">
                      Endpoint URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://api.yoursite.com/webhooks/taxu"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-11"
                    />
                    <p className="text-sm text-muted-foreground">
                      Must be a valid HTTPS URL (HTTP allowed in test mode)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="e.g., Production webhook for tax filing events"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Select Events to Subscribe</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Choose which events you want to receive. You can update this later.
                        </p>
                      </div>
                      {selectedEvents.length > 0 && (
                        <Badge variant="default" className="ml-4">
                          {selectedEvents.length} selected
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-3">
                      {Object.entries(eventsByCategory).map(([category, events]) => (
                        <Card key={category} className="border-2 p-4">
                          <h3 className="mb-3 flex items-center gap-2 font-semibold">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            {category}
                          </h3>
                          <div className="space-y-3">
                            {events.map((event) => (
                              <div
                                key={event.value}
                                className="flex items-start space-x-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                              >
                                <Checkbox
                                  id={event.value}
                                  checked={selectedEvents.includes(event.value)}
                                  onCheckedChange={(checked) => {
                                    console.log("[v0] Checkbox changed", { event: event.value, checked })
                                    if (checked) {
                                      setSelectedEvents([...selectedEvents, event.value])
                                    } else {
                                      setSelectedEvents(selectedEvents.filter((e) => e !== event.value))
                                    }
                                  }}
                                  className="mt-0.5"
                                />
                                <div
                                  className="flex-1 cursor-pointer"
                                  onClick={() => {
                                    const checkbox = document.getElementById(event.value) as HTMLButtonElement
                                    checkbox?.click()
                                  }}
                                >
                                  <Label htmlFor={event.value} className="cursor-pointer font-medium">
                                    {event.label}
                                  </Label>
                                  <p className="text-xs text-muted-foreground">{event.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={handleCreate}
                      size="lg"
                      className="flex-1"
                      disabled={creating || !url || selectedEvents.length === 0}
                    >
                      {creating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-5 w-5" />
                          Create Endpoint
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setUrl("")
                        setDescription("")
                        setSelectedEvents([])
                      }}
                      disabled={creating}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Tabs defaultValue="endpoints" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="events">Event Catalog</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-6">
            {webhooks.length === 0 ? (
              <Card className="border-2 border-dashed">
                <div className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No webhook endpoints yet</h3>
                  <p className="mb-6 max-w-md text-muted-foreground">
                    Create your first webhook endpoint to start receiving real-time event notifications from Taxu
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Endpoint
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6">
                {webhooks.map((webhook) => (
                  <Card key={webhook.id} className="overflow-hidden border-2 transition-all hover:shadow-lg">
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-950/50 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={webhook.status === "active" ? "default" : "secondary"}
                              className="px-3 py-1"
                            >
                              {webhook.status === "active" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {webhook.status}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1">
                              {webhook.environment}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="rounded-lg bg-black/5 dark:bg-white/5 px-4 py-2 text-sm font-mono">
                              {webhook.url}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(webhook.url)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          {webhook.description && (
                            <p className="text-sm text-muted-foreground">{webhook.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleTest(webhook.id)}>
                            <TestTube className="mr-2 h-4 w-4" />
                            Test
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(webhook.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Subscribed Events */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <Zap className="h-4 w-4 text-primary" />
                          Subscribed Events ({webhook.webhook_subscriptions?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {webhook.webhook_subscriptions?.map((sub: any) => (
                            <Badge key={sub.id} variant="secondary" className="px-3 py-1">
                              {sub.event_type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Signing Secret */}
                      <div className="rounded-lg border-2 border-dashed p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="mb-2 flex items-center gap-2 text-sm font-semibold">Signing Secret</Label>
                            <code className="text-xs font-mono text-muted-foreground">
                              {showSecret[webhook.id]
                                ? webhook.secret
                                : `${webhook.secret.substring(0, 20)}${"•".repeat(20)}`}
                            </code>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowSecret((prev) => ({ ...prev, [webhook.id]: !prev[webhook.id] }))}
                            >
                              {showSecret[webhook.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(webhook.secret)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg border p-4">
                          <p className="mb-1 text-sm text-muted-foreground">Created</p>
                          <p className="font-semibold">{new Date(webhook.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="mb-1 text-sm text-muted-foreground">Last Triggered</p>
                          <p className="font-semibold">
                            {webhook.last_triggered_at ? (
                              new Date(webhook.last_triggered_at).toLocaleString()
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <p className="mb-1 text-sm text-muted-foreground">Total Deliveries</p>
                          <p className="font-semibold">{webhook.delivery_count || 0}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-semibold">Available Webhook Events</h3>
              <p className="mb-6 text-muted-foreground">
                Subscribe to these events to receive real-time notifications when they occur in your Taxu account.
              </p>
              <div className="space-y-6">
                {Object.entries(eventsByCategory).map(([category, events]) => (
                  <div key={category}>
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {category}
                    </h4>
                    <div className="grid gap-3">
                      {events.map((event) => (
                        <Card key={event.value} className="p-4 transition-all hover:border-primary/50 hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <code className="rounded bg-primary/10 px-2 py-1 text-sm font-mono text-primary">
                                  {event.value}
                                </code>
                              </div>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Documentation Section */}
        <Card className="mt-12 border-2 bg-gradient-to-br from-primary/5 to-accent/5 p-8">
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-2xl font-bold">Need help with webhooks?</h3>
              <p className="mb-4 text-muted-foreground">
                Check out our comprehensive webhook documentation with code examples, best practices, and security
                guidelines.
              </p>
              <Button variant="default" size="lg" asChild>
                <a href="/developer/docs/webhooks">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
