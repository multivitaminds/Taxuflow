"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LinkIcon, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickBooksSyncProps {
  userId: string
}

interface SyncStatus {
  connected: boolean
  lastSync: string | null
  transactionCount: number
  categorizedCount: number
}

export function QuickBooksSync({ userId }: QuickBooksSyncProps) {
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
          description: `Synced ${data.transactionCount} transactions`,
        })
        fetchSyncStatus()
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
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QuickBooks Integration</CardTitle>
          <CardDescription>
            Sync your QuickBooks data to automatically categorize transactions for taxes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!syncStatus.connected ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">QuickBooks Not Connected</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Connect your QuickBooks account to automatically import and categorize transactions
              </p>
              <Button onClick={handleConnect}>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect QuickBooks
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold">QuickBooks Connected</p>
                    <p className="text-sm text-muted-foreground">
                      Last synced: {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>
                <Button onClick={handleSync} disabled={isSyncing} variant="outline">
                  {isSyncing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Sync Now
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{syncStatus.transactionCount}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Categorized for Tax</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{syncStatus.categorizedCount}</p>
                  </CardContent>
                </Card>
              </div>

              {syncStatus.categorizedCount > 0 && (
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Ready to file! Your transactions have been categorized and are ready for tax filing.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {syncStatus.connected && syncStatus.categorizedCount > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSubmitFiling} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Tax Filing
          </Button>
        </div>
      )}
    </div>
  )
}
