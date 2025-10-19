"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"

interface SyncConnection {
  id: string
  connection_name: string
  auto_sync_enabled: boolean
  sync_frequency: string
}

interface SyncSettingsProps {
  connections: SyncConnection[]
  onUpdate: () => void
}

export function SyncSettings({ connections, onUpdate }: SyncSettingsProps) {
  if (connections.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No connections to configure</p>
          <p className="text-sm text-muted-foreground mt-1">Connect QuickBooks Desktop first</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {connections.map((conn) => (
        <Card key={conn.id} className="p-6">
          <h3 className="text-lg font-semibold mb-4">{conn.connection_name}</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoSync">Enable Auto-Sync</Label>
              <Switch id="autoSync" checked={conn.auto_sync_enabled} />
            </div>

            <div>
              <Label htmlFor="syncFrequency">Sync Frequency</Label>
              <Select value={conn.sync_frequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Entities to Sync</h4>
              <div className="space-y-2">
                {["Customers", "Invoices", "Bills", "Products", "Vendors", "Payments"].map((entity) => (
                  <div key={entity} className="flex items-center justify-between">
                    <Label htmlFor={entity.toLowerCase()}>{entity}</Label>
                    <Switch id={entity.toLowerCase()} defaultChecked />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full bg-transparent">
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
