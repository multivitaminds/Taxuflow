"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Key, Trash2, RotateCw, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function KeySettingsClient({ keyId }: { keyId: string }) {
  const router = useRouter()
  const [keyName, setKeyName] = useState(keyId === "production" ? "Production Key" : "Test Key")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showRotateConfirm, setShowRotateConfirm] = useState(false)

  const keyData = {
    key: keyId === "production" ? "pk_live_••••••••••••••••3x9K" : "pk_test_••••••••••••••••7mP2",
    created: keyId === "production" ? "Jan 15, 2025" : "Jan 10, 2025",
    lastUsed: keyId === "production" ? "2 hours ago" : "5 minutes ago",
    status: "active",
    type: keyId === "production" ? "live" : "test",
  }

  const handleSave = () => {
    // Simulate save
    console.log("Saving key settings:", keyName)
  }

  const handleRotate = () => {
    console.log("Rotating key")
    setShowRotateConfirm(false)
    // Redirect after rotation
    setTimeout(() => router.push("/developer-portal"), 1000)
  }

  const handleDelete = () => {
    console.log("Deleting key")
    setShowDeleteConfirm(false)
    // Redirect after deletion
    setTimeout(() => router.push("/developer-portal"), 1000)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-8 h-8 text-accent" />
            <div>
              <h1 className="text-3xl font-bold">API Key Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your {keyData.type === "live" ? "production" : "test"} API key
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="keyName" className="mb-2 block">
                Key Name
              </Label>
              <Input
                id="keyName"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="bg-background"
              />
            </div>

            <div>
              <Label className="mb-2 block">API Key</Label>
              <code className="block p-4 rounded-lg bg-background border border-border font-mono text-sm">
                {keyData.key}
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Created {keyData.created} • Last used {keyData.lastUsed}
              </p>
            </div>

            <div>
              <Label className="mb-2 block">Status</Label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                  {keyData.status}
                </span>
              </div>
            </div>

            <Button onClick={handleSave} className="glow-neon-strong">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-500/30 bg-card p-8">
          <h2 className="text-xl font-bold text-red-500 mb-6">Danger Zone</h2>

          <div className="space-y-4">
            {/* Rotate Key */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
              <div>
                <h3 className="font-semibold mb-1">Rotate API Key</h3>
                <p className="text-sm text-muted-foreground">Generate a new key and invalidate the current one</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowRotateConfirm(true)}
                className="bg-transparent border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
            </div>

            {/* Delete Key */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background">
              <div>
                <h3 className="font-semibold mb-1">Delete API Key</h3>
                <p className="text-sm text-muted-foreground">Permanently remove this key</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Rotate Confirmation Modal */}
      {showRotateConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl border border-border bg-card p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <h3 className="text-xl font-bold">Rotate API Key?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              This will generate a new key and immediately invalidate the current one. Any applications using the old
              key will stop working.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRotateConfirm(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleRotate} className="flex-1 bg-amber-500 hover:bg-amber-600">
                Rotate Key
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl border border-red-500/30 bg-card p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold">Delete API Key?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. Any applications using this key will immediately stop working.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600">
                Delete Key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
