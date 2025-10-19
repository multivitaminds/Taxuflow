"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"

interface SyncConnectionSetupProps {
  onClose: () => void
  onSuccess: () => void
}

export function SyncConnectionSetup({ onClose, onSuccess }: SyncConnectionSetupProps) {
  const [formData, setFormData] = useState({
    connectionName: "",
    companyFileName: "",
    syncDirection: "bidirectional",
    autoSyncEnabled: false,
    syncFrequency: "daily",
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("qbd_sync_connections").insert({
      user_id: user.id,
      connection_name: formData.connectionName,
      company_file_name: formData.companyFileName,
      sync_direction: formData.syncDirection,
      auto_sync_enabled: formData.autoSyncEnabled,
      sync_frequency: formData.syncFrequency,
      is_active: true,
    })

    setLoading(false)

    if (!error) {
      onSuccess()
      onClose()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect QuickBooks Desktop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="connectionName">Connection Name</Label>
            <Input
              id="connectionName"
              value={formData.connectionName}
              onChange={(e) => setFormData({ ...formData, connectionName: e.target.value })}
              placeholder="My Company QuickBooks"
              required
            />
          </div>

          <div>
            <Label htmlFor="companyFileName">Company File Name</Label>
            <Input
              id="companyFileName"
              value={formData.companyFileName}
              onChange={(e) => setFormData({ ...formData, companyFileName: e.target.value })}
              placeholder="MyCompany.qbw"
              required
            />
          </div>

          <div>
            <Label htmlFor="syncDirection">Sync Direction</Label>
            <Select
              value={formData.syncDirection}
              onValueChange={(value) => setFormData({ ...formData, syncDirection: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="import">Import from QuickBooks</SelectItem>
                <SelectItem value="export">Export to QuickBooks</SelectItem>
                <SelectItem value="bidirectional">Bidirectional Sync</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoSync">Enable Auto-Sync</Label>
            <Switch
              id="autoSync"
              checked={formData.autoSyncEnabled}
              onCheckedChange={(checked) => setFormData({ ...formData, autoSyncEnabled: checked })}
            />
          </div>

          {formData.autoSyncEnabled && (
            <div>
              <Label htmlFor="syncFrequency">Sync Frequency</Label>
              <Select
                value={formData.syncFrequency}
                onValueChange={(value) => setFormData({ ...formData, syncFrequency: value })}
              >
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
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
