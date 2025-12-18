"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Key, Copy, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function CreateKeyClient() {
  const router = useRouter()
  const [keyName, setKeyName] = useState("")
  const [keyType, setKeyType] = useState<"live" | "test">("test")
  const [permissions, setPermissions] = useState({
    read: true,
    write: true,
    delete: false,
  })
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateKey = async () => {
    if (!keyName.trim()) return

    setIsCreating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a fake API key
    const prefix = keyType === "live" ? "pk_live" : "pk_test"
    const randomKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setCreatedKey(`${prefix}_${randomKey}`)
    setIsCreating(false)
  }

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (createdKey) {
    return (
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6 mx-auto">
            <Key className="w-8 h-8 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">API Key Created!</h1>
          <p className="text-center text-muted-foreground mb-8">
            Save this key securely. You won't be able to see it again.
          </p>

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-semibold">Your API Key</Label>
              <Button size="sm" variant="outline" onClick={handleCopy} className="bg-transparent">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <code className="block p-4 rounded-lg bg-background border border-border font-mono text-sm break-all">
              {createdKey}
            </code>
          </div>

          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-500 mb-1">Important Security Notice</p>
                <p className="text-muted-foreground">
                  Store this key in a secure location. Never expose it in client-side code or public repositories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/developer-portal" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Portal
              </Button>
            </Link>
            <Link href="/api-docs" className="flex-1">
              <Button className="w-full glow-neon-strong">View Documentation</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold">Create New API Key</h1>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="keyName" className="mb-2 block">
              Key Name
            </Label>
            <Input
              id="keyName"
              placeholder="e.g., Production Server, Mobile App, Testing"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Choose a descriptive name to help you identify this key later
            </p>
          </div>

          <div>
            <Label className="mb-3 block">Key Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setKeyType("test")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  keyType === "test"
                    ? "border-accent bg-accent/5"
                    : "border-border bg-background hover:border-accent/30"
                }`}
              >
                <div className="font-semibold mb-1">Test Key</div>
                <div className="text-xs text-muted-foreground">For development and testing</div>
              </button>
              <button
                onClick={() => setKeyType("live")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  keyType === "live"
                    ? "border-accent bg-accent/5"
                    : "border-border bg-background hover:border-accent/30"
                }`}
              >
                <div className="font-semibold mb-1">Live Key</div>
                <div className="text-xs text-muted-foreground">For production use</div>
              </button>
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Permissions</Label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-accent/30 transition-colors">
                <input
                  type="checkbox"
                  checked={permissions.read}
                  onChange={(e) => setPermissions({ ...permissions, read: e.target.checked })}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">Read Access</div>
                  <div className="text-xs text-muted-foreground">View tax returns, documents, and estimates</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-accent/30 transition-colors">
                <input
                  type="checkbox"
                  checked={permissions.write}
                  onChange={(e) => setPermissions({ ...permissions, write: e.target.checked })}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">Write Access</div>
                  <div className="text-xs text-muted-foreground">Create and update tax returns and documents</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-pointer hover:border-accent/30 transition-colors">
                <input
                  type="checkbox"
                  checked={permissions.delete}
                  onChange={(e) => setPermissions({ ...permissions, delete: e.target.checked })}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium">Delete Access</div>
                  <div className="text-xs text-muted-foreground">Remove tax returns and documents</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href="/developer-portal" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleCreateKey}
              disabled={!keyName.trim() || isCreating}
              className="flex-1 glow-neon-strong"
            >
              {isCreating ? "Creating..." : "Create API Key"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
