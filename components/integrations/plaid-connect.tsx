"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Banknote, CheckCircle2, Loader2, Shield, Lock, Zap } from "lucide-react"

export function PlaidConnect() {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])

  const handleConnect = async () => {
    setLoading(true)
    try {
      // Get link token
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
      })
      const { linkToken } = await response.json()

      // In a real implementation, you would use Plaid Link here
      // For now, simulate connection
      setTimeout(() => {
        setConnected(true)
        setAccounts([
          {
            id: "acc_1",
            name: "Business Checking",
            mask: "4242",
            type: "depository",
            balance: 125430.5,
          },
          {
            id: "acc_2",
            name: "Savings Account",
            mask: "8888",
            type: "depository",
            balance: 50000.0,
          },
        ])
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Plaid connection error:", error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
            <Banknote className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Plaid Bank Connection</h1>
            <p className="text-muted-foreground">Securely connect your bank accounts for automatic transaction sync</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Why Connect Your Bank?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3">
            <div className="p-2 h-fit rounded-lg bg-emerald-500/10">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Automatic Sync</h3>
              <p className="text-sm text-muted-foreground">Transactions sync automatically every day</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2 h-fit rounded-lg bg-blue-500/10">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">256-bit encryption and OAuth 2.0</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="p-2 h-fit rounded-lg bg-violet-500/10">
              <Lock className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Read-Only Access</h3>
              <p className="text-sm text-muted-foreground">We can never move money or make changes</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Connection Status */}
      {!connected ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                <Banknote className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect Your Bank Account</h3>
              <p className="text-muted-foreground">
                Securely link your bank account to automatically import transactions and simplify bookkeeping
              </p>
            </div>
            <Button onClick={handleConnect} disabled={loading} size="lg" className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Banknote className="h-4 w-4" />
                  Connect with Plaid
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Powered by Plaid • Trusted by millions • Bank-level security
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Connected Accounts</h2>
            <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Connected
            </Badge>
          </div>

          <div className="grid gap-4">
            {accounts.map((account) => (
              <Card key={account.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                      <Banknote className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">••••{account.mask}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">Current Balance</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Banknote className="h-4 w-4" />
              Add Another Account
            </Button>
            <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive">
              Disconnect All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
