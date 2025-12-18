"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, CheckCircle2, ArrowLeft, DollarSign, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function StripeIntegration() {
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(true)
  const router = useRouter()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/integrations")} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Integrations
        </Button>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <CreditCard className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Stripe Integration</h1>
              <Badge className="gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            </div>
            <p className="text-muted-foreground">Accept payments and manage subscriptions</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">$24,580</p>
              <p className="text-sm text-muted-foreground">Revenue (30d)</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10">
              <Users className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">456</p>
              <p className="text-sm text-muted-foreground">Active Customers</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Stripe Account</p>
                  <p className="text-sm text-muted-foreground">acct_1234567890</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Webhook Status</p>
                  <p className="text-sm text-muted-foreground">Receiving events</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Sync</p>
                  <p className="text-sm text-muted-foreground">2 minutes ago</p>
                </div>
                <Button variant="outline" size="sm">
                  Sync Now
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <p className="text-muted-foreground">Payment history and transaction details</p>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
            <p className="text-muted-foreground">Manage recurring billing</p>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Integration Settings</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                View API Keys
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Configure Webhooks
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                Disconnect Stripe
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
