"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, TestTube } from "lucide-react"
import { useState } from "react"

export default function WebhooksManagementPage() {
  const [webhooks, setWebhooks] = useState([
    {
      id: "wh_1",
      url: "https://example.com/webhooks/taxu",
      events: ["document.processed", "tax.calculated"],
      status: "active",
      created: "2024-01-15",
    },
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
          <p className="text-muted-foreground">Manage webhook endpoints and view delivery logs</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      <div className="grid gap-6">
        {webhooks.map((webhook) => (
          <Card key={webhook.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-sm font-mono">{webhook.url}</code>
                  <Badge variant={webhook.status === "active" ? "default" : "secondary"}>{webhook.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Created {webhook.created}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Subscribed Events:</p>
              <div className="flex flex-wrap gap-2">
                {webhook.events.map((event) => (
                  <Badge key={event} variant="outline">
                    {event}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Last Delivery</p>
                  <p className="font-medium">2 minutes ago</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Success Rate</p>
                  <p className="font-medium">99.8%</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Deliveries</p>
                  <p className="font-medium">1,234</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Deliveries</h2>
        <div className="space-y-3">
          {[
            { event: "document.processed", status: "success", time: "2 min ago" },
            { event: "tax.calculated", status: "success", time: "5 min ago" },
            { event: "document.processed", status: "failed", time: "10 min ago" },
          ].map((delivery, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{delivery.event}</Badge>
                <span className="text-sm text-muted-foreground">{delivery.time}</span>
              </div>
              <Badge variant={delivery.status === "success" ? "default" : "destructive"}>{delivery.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
