"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  RefreshCw,
  DollarSign,
  Calendar,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Filing {
  id: string
  tax_year: number
  form_type: "W-2" | "1099-NEC" // Added form_type to distinguish filing types
  filing_status: string
  submission_id: string
  irs_status: string | null
  refund_amount: number | null
  filed_at: string | null
  accepted_at: string | null
  rejected_at: string | null
  rejection_reasons: string[] | null
  provider_name: string
  created_at: string
  updated_at: string
}

interface FilingDashboardClientProps {
  user: any
  filings: Filing[]
  isLoading?: boolean
}

export function FilingDashboardClient({ user, filings, isLoading = false }: FilingDashboardClientProps) {
  const [selectedTab, setSelectedTab] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [refreshingFilingId, setRefreshingFilingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const totalFilings = filings.length
  const acceptedFilings = filings.filter((f) => f.filing_status.toLowerCase() === "accepted").length
  const pendingFilings = filings.filter((f) =>
    ["submitted", "pending", "processing"].includes(f.filing_status.toLowerCase()),
  ).length
  const totalRefunds = filings
    .filter((f) => f.refund_amount && f.filing_status.toLowerCase() === "accepted" && f.form_type === "W-2")
    .reduce((sum, f) => sum + (f.refund_amount || 0), 0)

  const filteredFilings = filings.filter((filing) => {
    const status = filing.filing_status.toLowerCase()
    if (selectedTab === "all") return true
    if (selectedTab === "accepted") return status === "accepted"
    if (selectedTab === "pending") return ["submitted", "pending", "processing"].includes(status)
    if (selectedTab === "rejected") return status === "rejected"
    return true
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    router.refresh()

    // Reset refreshing state after a short delay since router.refresh is async but doesn't return a promise
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "Dashboard Refreshed",
        description: "Latest filing statuses loaded.",
      })
    }, 1000)
  }

  const handleRefreshFiling = async (filingId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setRefreshingFilingId(filingId)

    try {
      console.log("[v0] Checking status for filing:", filingId)
      const response = await fetch(`/api/filing/check-status/${filingId}`)

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Received non-JSON response:", text)
        throw new Error("Server returned invalid response. Please try again.")
      }

      const data = await response.json()
      console.log("[v0] Status check response:", data)

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to check status")
      }

      toast({
        title: "Status Updated",
        description: `Current status: ${data.status.toUpperCase()}`,
      })

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error("[v0] Status refresh error:", error)
      toast({
        title: "Status Check Failed",
        description: error instanceof Error ? error.message : "Unable to refresh status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshingFilingId(null)
    }
  }

  useEffect(() => {
    // Clear any existing timer
    if (pollingRef.current) {
      clearTimeout(pollingRef.current)
    }

    const hasPendingFilings = filings.some((f) =>
      ["pending", "submitted", "processing"].includes(f.filing_status.toLowerCase()),
    )

    if (hasPendingFilings) {
      console.log("[v0] Detected pending filings, will auto-refresh status in 3 seconds...")

      pollingRef.current = setTimeout(async () => {
        console.log("[v0] Auto-refreshing pending filing statuses...")

        const pendingFilings = filings.filter((f) =>
          ["pending", "submitted", "processing"].includes(f.filing_status.toLowerCase()),
        )

        // Run checks in parallel
        const statusChecks = pendingFilings.map((filing) =>
          fetch(`/api/filing/check-status/${filing.id}`)
            .then((response) => {
              console.log("[v0] Auto-refreshed status for:", filing.id, response.ok ? "✓" : "✗")
              return response
            })
            .catch((error) => {
              console.error("[v0] Auto-refresh failed for:", filing.id, error)
            }),
        )

        await Promise.all(statusChecks)

        console.log("[v0] Refreshing view to show updated statuses...")
        router.refresh()
      }, 3000)
    }

    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current)
      }
    }
  }, [filings, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f9fc] p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-9 w-64 bg-muted/50 animate-pulse rounded-lg" />
              <div className="h-5 w-96 bg-muted/50 animate-pulse rounded-lg mt-2" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-muted/50 animate-pulse rounded-lg" />
              <div className="h-10 w-32 bg-muted/50 animate-pulse rounded-lg" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="glass-effect border-0 hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted/50 animate-pulse rounded" />
                  <div className="h-4 w-4 bg-muted/50 animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted/50 animate-pulse rounded mb-2" />
                  <div className="h-3 w-20 bg-muted/50 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-effect border-0">
            <CardHeader>
              <div className="h-6 w-32 bg-muted/50 animate-pulse rounded mb-2" />
              <div className="h-4 w-64 bg-muted/50 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Spinner className="h-8 w-8 text-primary" />
                  <p className="text-sm text-muted-foreground">Loading your filings...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-[#0a2540]">Tax Filing Dashboard</h1>
              <BarChart3 className="h-6 w-6 text-[#635bff]" />
            </div>
            <p className="text-pretty text-slate-600 text-lg">Track your tax returns and filing status in real-time</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild className="bg-[#635bff] hover:bg-[#5851df] text-white shadow-sm">
              <Link href="/dashboard/filing/new">
                <FileText className="mr-2 h-4 w-4" />
                New Filing
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card
            className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all cursor-pointer bg-white"
            onClick={() => setSelectedTab("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Filings</CardTitle>
              <div className="p-2 bg-[#635bff]/10 rounded-md">
                <FileText className="h-4 w-4 text-[#635bff]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0a2540]">{totalFilings}</div>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card
            className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all cursor-pointer bg-white"
            onClick={() => setSelectedTab("accepted")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Accepted</CardTitle>
              <div className="p-2 bg-green-100 rounded-md">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0a2540]">{acceptedFilings}</div>
              <p className="text-xs text-slate-500 mt-1">
                {totalFilings > 0 ? Math.round((acceptedFilings / totalFilings) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all cursor-pointer bg-white"
            onClick={() => setSelectedTab("pending")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
              <div className="p-2 bg-yellow-100 rounded-md">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0a2540]">{pendingFilings}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting IRS response</p>
            </CardContent>
          </Card>

          <Card
            className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all cursor-pointer bg-white"
            onClick={() => setSelectedTab("accepted")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Refunds</CardTitle>
              <div className="p-2 bg-green-100 rounded-md">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0a2540]">${totalRefunds.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Accepted returns</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-[0_2px_10px_rgba(0,0,0,0.08)] bg-white" id="filing-history">
          <CardHeader>
            <CardTitle className="text-xl text-[#0a2540]">Filing History</CardTitle>
            <CardDescription className="text-slate-500">
              View and manage all your tax return submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-sm"
                >
                  All ({totalFilings})
                </TabsTrigger>
                <TabsTrigger
                  value="accepted"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-sm"
                >
                  Accepted ({acceptedFilings})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-sm"
                >
                  Pending ({pendingFilings})
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="data-[state=active]:bg-white data-[state=active]:text-[#635bff] data-[state=active]:shadow-sm"
                >
                  Rejected ({filings.filter((f) => f.filing_status.toLowerCase() === "rejected").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                {filteredFilings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                      <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[#0a2540]">No filings found</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-md">
                      {selectedTab === "all"
                        ? "Get started by filing your first tax return"
                        : `No ${selectedTab} filings to display`}
                    </p>
                    {selectedTab === "all" && (
                      <Button asChild size="lg" className="bg-[#635bff] hover:bg-[#5851df] text-white">
                        <Link href="/dashboard/filing/new">
                          <FileText className="mr-2 h-4 w-4" />
                          File Your First Return
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFilings.map((filing) => (
                      <FilingCard
                        key={filing.id}
                        filing={filing}
                        onRefresh={handleRefreshFiling}
                        isRefreshing={refreshingFilingId === filing.id}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FilingCard({
  filing,
  onRefresh,
  isRefreshing,
}: {
  filing: Filing
  onRefresh: (id: string, e: React.MouseEvent) => void
  isRefreshing: boolean
}) {
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    switch (s) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "submitted":
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
            <RefreshCw className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-800">
            {status}
          </Badge>
        )
    }
  }

  const isPending = ["pending", "submitted", "processing"].includes(filing.filing_status.toLowerCase())

  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-[#0a2540]">
                {filing.form_type} - Tax Year {filing.tax_year}
              </h3>
              {getStatusBadge(filing.filing_status)}
              {filing.irs_status && (
                <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                  IRS: {filing.irs_status}
                </Badge>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-slate-500">Filed</p>
                  <p className="font-medium text-[#0a2540]">
                    {filing.filed_at
                      ? formatDistanceToNow(new Date(filing.filed_at), { addSuffix: true })
                      : "Not filed"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-slate-500">Submission ID</p>
                  <p className="font-mono text-xs text-[#0a2540]">{filing.submission_id || "N/A"}</p>
                </div>
              </div>

              {filing.refund_amount && filing.form_type === "W-2" && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-slate-500">Refund Amount</p>
                    <p className="font-semibold text-green-600">${filing.refund_amount.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {filing.rejection_reasons && filing.rejection_reasons.length > 0 && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-md border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">Rejection Reasons:</p>
                  <ul className="text-sm text-red-800 list-disc list-inside mt-1">
                    {filing.rejection_reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {filing.accepted_at && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Accepted {formatDistanceToNow(new Date(filing.accepted_at), { addSuffix: true })}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            {isPending && (
              <Button variant="outline" size="sm" onClick={(e) => onRefresh(filing.id, e)} disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Checking..." : "Check Status"}
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/filing/${filing.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
            {filing.filing_status.toLowerCase() === "accepted" && (
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
