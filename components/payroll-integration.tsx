"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, LinkIcon, RefreshCw, CheckCircle2, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PayrollConnection {
  id: string
  provider_name: string
  connection_status: string
  last_synced_at: string
  auto_sync_enabled: boolean
}

export function PayrollIntegration() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [connections, setConnections] = useState<PayrollConnection[]>([])

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      const response = await fetch("/api/payroll/connections")
      const data = await response.json()
      setConnections(data.connections || [])
    } catch (error) {
      console.error("[v0] Failed to load connections:", error)
    }
  }

  const handleConnectPayroll = async (provider: string) => {
    setLoading(true)

    try {
      // Get Plaid link token
      const tokenResponse = await fetch("/api/plaid/create-link-token", {
        method: "POST",
      })
      const { linkToken } = await tokenResponse.json()

      // Open Plaid Link (in production, use Plaid Link SDK)
      // For now, we'll simulate the connection
      const publicToken = "simulated-public-token"

      // Exchange public token for access token
      const exchangeResponse = await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicToken,
          providerName: provider,
        }),
      })

      const result = await exchangeResponse.json()

      if (result.success) {
        toast({
          title: "Payroll Connected",
          description: `Successfully connected to ${provider}`,
        })
        loadConnections()
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSyncPayroll = async (connectionId: string) => {
    setSyncing(true)

    try {
      const response = await fetch("/api/payroll/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectionId }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Sync Complete",
          description: `Created ${result.formsCreated} W-2 form(s)`,
        })
        loadConnections()
      }
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const payrollProviders = [
    { id: "gusto", name: "Gusto", logo: "🟢" },
    { id: "adp", name: "ADP", logo: "🔵" },
    { id: "paychex", name: "Paychex", logo: "🟡" },
    { id: "quickbooks_payroll", name: "QuickBooks Payroll", logo: "🟢" },
    { id: "square_payroll", name: "Square Payroll", logo: "⬛" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-1">Business Financial Management</h3>
              <p className="text-sm text-purple-700">
                Taxu uses Plaid's Business Financial Management platform to securely connect your payroll provider and
                automatically import employee W-2 data, tax withholdings, and retirement contributions. All connections
                are encrypted and comply with SOC 2 Type II standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connect Payroll Provider</CardTitle>
          <CardDescription>Automatically import employee W-2 data from your payroll system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payrollProviders.map((provider) => {
              const connection = connections.find((c) => c.provider_name === provider.id)
              const isConnected = connection?.connection_status === "active"

              return (
                <Card key={provider.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{provider.logo}</div>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          {isConnected && (
                            <Badge variant="outline" className="mt-1">
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                              Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {isConnected ? (
                      <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                          Last synced: {new Date(connection.last_synced_at).toLocaleDateString()}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSyncPayroll(connection.id)}
                          disabled={syncing}
                          className="w-full"
                        >
                          {syncing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnectPayroll(provider.id)}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
