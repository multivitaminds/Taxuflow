"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Globe, Shield } from "lucide-react"
import { useState } from "react"

export default function DeveloperPortalSettingsPage() {
  const [orgName, setOrgName] = useState("My Organization")
  const [webhookUrl, setWebhookUrl] = useState("")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Portal Settings</h1>
        <p className="text-muted-foreground">Manage your developer portal configuration and preferences</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">General</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Your organization name"
            />
          </div>
          <div className="space-y-2">
            <Label>API Version</Label>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono">v2025-01-01</Badge>
              <span className="text-sm text-muted-foreground">Latest stable version</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Account ID</Label>
            <div className="bg-muted rounded-lg p-3 font-mono text-sm">
              acct_demo_123456789
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "API usage alerts", description: "Get notified when approaching rate limits", enabled: true },
            { label: "Webhook failures", description: "Alert on consecutive webhook delivery failures", enabled: true },
            { label: "Security alerts", description: "Suspicious activity or key exposure detected", enabled: true },
            { label: "Product updates", description: "New features and API changes", enabled: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Badge variant={item.enabled ? "default" : "secondary"}>
                {item.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Signing Secret</Label>
            <div className="bg-muted rounded-lg p-3 font-mono text-sm">
              whsec_••••••••••••••••••••
            </div>
            <p className="text-xs text-muted-foreground">
              Used to verify webhook payloads. Roll this secret if you believe it has been compromised.
            </p>
          </div>
          <div className="space-y-2">
            <Label>IP Allowlist</Label>
            <Input placeholder="e.g. 192.168.1.0/24" />
            <p className="text-xs text-muted-foreground">
              Restrict API access to specific IP addresses or CIDR ranges.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
