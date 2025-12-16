"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const integrations = [
    {
      name: "Zapier",
      description: "Link your automated workflows",
      category: "Other",
      status: "connected",
      logo: "🔶",
    },
    {
      name: "NetSuite",
      description: "Categorize transactions and sync your bank feed",
      category: "Accounting",
      logo: "🔷",
    },
    {
      name: "QuickBooks",
      description: "Categorize transactions and sync your bank feed",
      category: "Accounting",
      logo: "🟢",
    },
    {
      name: "Xero",
      description: "Categorize transactions and sync your bank feed",
      category: "Accounting",
      logo: "🔵",
    },
    { name: "Quicken", description: "Sync your bank feed", category: "Accounting", logo: "⚫" },
    {
      name: "Payroll or HR",
      description: "Sync and invite team members",
      category: "Team Management",
      logo: "👥",
    },
    { name: "Stripe", description: "Accept card payments on invoices", category: "Other", logo: "💳" },
    { name: "Slack", description: "Configurable notifications", category: "Other", logo: "📱" },
    {
      name: "Finicity",
      description: "Connect your accounts to financial institutions and third-party applications",
      category: "Other",
      logo: "🏦",
    },
    {
      name: "Plaid",
      description: "Connect your accounts to financial institutions and third-party applications",
      category: "Other",
      logo: "🔗",
    },
    {
      name: "Taxu MCP",
      description: "Model Context Protocol server to connect LLM clients with Taxu",
      category: "Other",
      logo: "🤖",
    },
  ]

  const filteredIntegrations =
    activeTab === "all"
      ? integrations
      : integrations.filter((i) => i.category.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Connect your external applications to unlock more ways to manage your money.
        </p>
      </div>

      {/* Active Integrations */}
      <div className="mb-8">
        <h2 className="text-base font-semibold mb-4">Active</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔶</div>
                <div>
                  <p className="text-sm font-medium">Zapier</p>
                  <p className="text-xs text-muted-foreground">Link your automated workflows</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-[10px]">
                  Connected
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Browse All Integrations */}
      <div>
        <h2 className="text-base font-semibold mb-4">Browse all integrations</h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="accounting" className="text-xs">
              Accounting
            </TabsTrigger>
            <TabsTrigger value="team management" className="text-xs">
              Team Management
            </TabsTrigger>
            <TabsTrigger value="other" className="text-xs">
              Other
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-4">
              {filteredIntegrations.map((integration, index) => (
                <Card key={index} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{integration.logo}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-0.5">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">{integration.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {integration.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
