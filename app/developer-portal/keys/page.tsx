"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Key, Copy, Eye, EyeOff, Trash2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ApiKeysPage() {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({})

  const keys = [
    {
      id: "key_1",
      name: "Production Key",
      prefix: "sk_live_",
      lastFour: "4x7z",
      created: "2024-12-01",
      lastUsed: "2 hours ago",
      environment: "live",
    },
    {
      id: "key_2",
      name: "Test Key",
      prefix: "sk_test_",
      lastFour: "9m2k",
      created: "2024-11-15",
      lastUsed: "5 minutes ago",
      environment: "test",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for authentication. Keep your keys secure and never share them publicly.
          </p>
        </div>
        <Link href="/developer-portal/keys/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Key
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {keys.map((apiKey) => (
          <Card key={apiKey.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{apiKey.name}</h3>
                    <Badge variant={apiKey.environment === "live" ? "default" : "secondary"}>
                      {apiKey.environment}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Created {apiKey.created}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey((prev) => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                >
                  {showKey[apiKey.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 font-mono text-sm">
              {showKey[apiKey.id]
                ? `${apiKey.prefix}${"•".repeat(24)}${apiKey.lastFour}`
                : `${apiKey.prefix}${"•".repeat(28)}`}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Last Used</p>
                  <p className="font-medium">{apiKey.lastUsed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Key ID</p>
                  <p className="font-medium font-mono">{apiKey.id}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-dashed">
        <div className="text-center">
          <Key className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold mb-1">API Key Security</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your secret API keys are only shown once when created. Store them securely using environment
            variables or a secrets manager. Never expose keys in client-side code.
          </p>
        </div>
      </Card>
    </div>
  )
}
