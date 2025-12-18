"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Settings,
  Activity,
  Zap,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Code,
  Shield,
  Webhook,
  Database,
  Cloud,
  CreditCard,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function IntegrationsHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const integrations = [
    {
      id: 1,
      name: "Stripe",
      category: "Payments",
      icon: CreditCard,
      status: "connected",
      description: "Accept payments and manage subscriptions",
      apiCalls: "24.5K",
      lastSync: "2 min ago",
      health: 100,
      route: "/integrations/stripe",
    },
    {
      id: 2,
      name: "QuickBooks",
      category: "Accounting",
      icon: Database,
      status: "connected",
      description: "Sync accounting data and transactions",
      apiCalls: "18.2K",
      lastSync: "5 min ago",
      health: 98,
      route: "/integrations/quickbooks",
    },
    {
      id: 3,
      name: "Plaid",
      category: "Banking",
      icon: Shield,
      status: "connected",
      description: "Connect bank accounts securely",
      apiCalls: "12.8K",
      lastSync: "1 min ago",
      health: 100,
      route: "/integrations/plaid",
    },
    {
      id: 4,
      name: "Xero",
      category: "Accounting",
      icon: Database,
      status: "available",
      description: "Cloud accounting software integration",
      apiCalls: "0",
      lastSync: "Never",
      health: 0,
      route: "/integrations/xero",
    },
    {
      id: 5,
      name: "TaxBandits",
      category: "Tax Filing",
      icon: Cloud,
      status: "connected",
      description: "E-file tax forms and manage filings",
      apiCalls: "8.4K",
      lastSync: "10 min ago",
      health: 95,
      route: "/integrations/taxbandits",
    },
    {
      id: 6,
      name: "Supabase",
      category: "Database",
      icon: Database,
      status: "connected",
      description: "PostgreSQL database and authentication",
      apiCalls: "156K",
      lastSync: "Just now",
      health: 100,
      route: "/integrations/supabase",
    },
  ]

  const webhooks = [
    {
      event: "invoice.created",
      endpoint: "https://api.example.com/webhooks/invoice",
      status: "active",
      deliveries: "1.2K",
    },
    {
      event: "payment.received",
      endpoint: "https://api.example.com/webhooks/payment",
      status: "active",
      deliveries: "3.4K",
    },
    { event: "tax.filed", endpoint: "https://api.example.com/webhooks/tax", status: "active", deliveries: "245" },
  ]

  const apiKeys = [
    {
      name: "Production API Key",
      key: "pk_live_••••••••••••••••",
      created: "2024-01-15",
      lastUsed: "2 min ago",
      requests: "45.2K",
    },
    {
      name: "Development API Key",
      key: "pk_test_••••••••••••••••",
      created: "2024-01-10",
      lastUsed: "1 hour ago",
      requests: "12.8K",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrations & API</h1>
          <p className="text-muted-foreground mt-1">Manage third-party connections and API access</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              +2 this week
            </Badge>
          </div>
          <div className="text-2xl font-bold text-foreground">6</div>
          <div className="text-sm text-muted-foreground">Active Integrations</div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              +18% ↑
            </Badge>
          </div>
          <div className="text-2xl font-bold text-foreground">245K</div>
          <div className="text-sm text-muted-foreground">API Calls (30d)</div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Webhook className="h-5 w-5 text-purple-600" />
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              3 active
            </Badge>
          </div>
          <div className="text-2xl font-bold text-foreground">4.9K</div>
          <div className="text-sm text-muted-foreground">Webhook Deliveries</div>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              99.8%
            </Badge>
          </div>
          <div className="text-2xl font-bold text-foreground">Healthy</div>
          <div className="text-sm text-muted-foreground">Integration Status</div>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter by Category</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card
                  key={integration.id}
                  onClick={() => router.push(integration.route)}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">{integration.category}</p>
                      </div>
                    </div>
                    <Badge
                      variant={integration.status === "connected" ? "default" : "outline"}
                      className={integration.status === "connected" ? "bg-green-500" : ""}
                    >
                      {integration.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                  {integration.status === "connected" && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">API Calls</span>
                        <span className="font-semibold text-foreground">{integration.apiCalls}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span className="font-semibold text-foreground">{integration.lastSync}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Health</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                              style={{ width: `${integration.health}%` }}
                            />
                          </div>
                          <span className="font-semibold text-foreground">{integration.health}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={integration.status === "connected" ? "outline" : "default"}
                      className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(integration.route)
                      }}
                    >
                      {integration.status === "connected" ? (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                    {integration.status === "connected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(integration.route)
                        }}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">API Keys</h3>
                <p className="text-sm text-muted-foreground">Manage your API authentication keys</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            </div>

            <div className="space-y-4">
              {apiKeys.map((apiKey, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Code className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-foreground">{apiKey.name}</h4>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </div>
                      <div className="font-mono text-sm text-muted-foreground mb-3">{apiKey.key}</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Created</span>
                          <div className="font-semibold text-foreground">{apiKey.created}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Used</span>
                          <div className="font-semibold text-foreground">{apiKey.lastUsed}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Requests (30d)</span>
                          <div className="font-semibold text-foreground">{apiKey.requests}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        Rotate
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Webhooks</h3>
                <p className="text-sm text-muted-foreground">Configure real-time event notifications</p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Webhook
              </Button>
            </div>

            <div className="space-y-4">
              {webhooks.map((webhook, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Webhook className="h-5 w-5 text-purple-600" />
                        <Badge variant="outline" className="font-mono text-xs">
                          {webhook.event}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {webhook.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{webhook.endpoint}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Successful deliveries: </span>
                          <span className="font-semibold text-foreground">{webhook.deliveries}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Test
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Integration Marketplace</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Discover and connect hundreds of third-party integrations to extend your platform
            </p>
            <Button className="gap-2">
              Explore Marketplace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
