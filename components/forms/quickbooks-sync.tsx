"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LinkIcon, RefreshCw, CheckCircle2, AlertCircle, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickBooksSyncProps {
  userId: string
  onSyncComplete?: (data: any) => void
}

interface SyncStatus {
  connected: boolean
  lastSync: string | null
  transactionCount: number
  categorizedCount: number
}

export function QuickBooksSync({ userId, onSyncComplete }: QuickBooksSyncProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchSyncStatus()
  }, [])

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch(`/api/quickbooks/sync-status?userId=${userId}`)
      const data = await response.json()
      setSyncStatus(data)
    } catch (error) {
      console.error("Failed to fetch sync status:", error)
    }
  }

  const handleConnect = () => {
    window.location.href = `/api/quickbooks/connect?userId=${userId}`
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/quickbooks/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sync Complete",
          description: `Synced ${data.transactionCount} transactions and categorized them for taxes`,
        })
        fetchSyncStatus()

        if (onSyncComplete && data.extractedData) {
          onSyncComplete(data.extractedData)
        }
      }
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync QuickBooks data",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSubmitFiling = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/filing/submit-quickbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Filing Submitted",
          description: "Your tax filing has been submitted successfully",
        })
        router.push("/dashboard/filing")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit tax filing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!syncStatus) {
    return (
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-orange-500/5">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-orange-500/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            QuickBooks Integration
          </CardTitle>
          <CardDescription>
            Sync your QuickBooks data to automatically categorize transactions for taxes using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!syncStatus.connected ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-purple-500/10 p-4">
                <AlertCircle className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">QuickBooks Not Connected</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Connect your QuickBooks account to automatically import and categorize transactions
              </p>
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect QuickBooks
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/20 p-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">QuickBooks Connected</p>
                    <p className="text-sm text-muted-foreground">
                      Last synced: {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSync}
                  disabled={isSyncing}
                  variant="outline"
                  className="border-green-500/20 bg-transparent"
                >
                  {isSyncing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Sync Now
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{syncStatus.transactionCount}</p>
                    <p className="text-xs text-muted-foreground">Synced from QuickBooks</p>
                  </CardContent>
                </Card>
                <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">AI Categorized</CardTitle>
                    <TrendingDown className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">{syncStatus.categorizedCount}</p>
                    <p className="text-xs text-muted-foreground">Ready for tax filing</p>
                  </CardContent>
                </Card>
              </div>

              {syncStatus.categorizedCount > 0 && (
                <div className="rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Ready to file! Your transactions have been categorized and are ready for tax filing.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {syncStatus.connected && syncStatus.categorizedCount > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitFiling}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Tax Filing
          </Button>
        </div>
      )}
    </div>
  )
}
