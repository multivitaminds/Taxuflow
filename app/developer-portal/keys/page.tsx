"use client"

import { DemoModeBanner } from "@/components/demo-mode-banner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react"
import { useState } from "react"

export default function ApiKeysPage() {
  const [showLiveKey, setShowLiveKey] = useState(false)
  const [showTestKey, setShowTestKey] = useState(false)

  const keys = [
    {
      name: "Production Key",
      key: "pk_live_1234567890abcdef",
      type: "live",
      created: "Dec 15, 2024",
      lastUsed: "2 hours ago",
    },
    {
      name: "Development Key",
      key: "pk_test_abcdef1234567890",
      type: "test",
      created: "Dec 10, 2024",
      lastUsed: "5 minutes ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DemoModeBanner />

      <div className="px-24 py-12 mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">API Keys</h1>
            <p className="text-muted-foreground">Manage your API keys and credentials</p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
            <Plus className="w-4 h-4" />
            Create New Key
          </Button>
        </div>

        {/* Keys List */}
        <div className="space-y-6">
          {keys.map((keyData, index) => {
            const isLive = keyData.type === "live"
            const isVisible = isLive ? showLiveKey : showTestKey
            const setVisible = isLive ? setShowLiveKey : setShowTestKey

            return (
              <Card key={index} className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isLive
                          ? "bg-gradient-to-br from-green-600 to-emerald-600"
                          : "bg-gradient-to-br from-blue-600 to-indigo-600"
                      } shadow-lg`}
                    >
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{keyData.name}</h3>
                      <Badge className={isLive ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                        {isLive ? "Live" : "Test"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Key Display */}
                <div className="bg-slate-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">
                      {isVisible ? keyData.key : "••••••••••••••••••••••••••••"}
                    </code>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setVisible(!isVisible)}>
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Created:</span> {keyData.created}
                  </div>
                  <div>
                    <span className="font-medium">Last used:</span> {keyData.lastUsed}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Security Notice */}
        <Card className="p-6 mt-8 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50">
          <h3 className="font-semibold text-lg mb-2">Security Best Practices</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Never share your API keys publicly or commit them to version control</li>
            <li>• Rotate keys regularly to maintain security</li>
            <li>• Use test keys for development and live keys only in production</li>
            <li>• Monitor key usage for any suspicious activity</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
