"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
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
  Sparkles,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Filing {
  id: string
  tax_year: number
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

  // Calculate stats
  const totalFilings = filings.length
  const acceptedFilings = filings.filter((f) => f.filing_status === "accepted").length
  const pendingFilings = filings.filter((f) => f.filing_status === "submitted" || f.filing_status === "pending").length
  const totalRefunds = filings
    .filter((f) => f.refund_amount && f.filing_status === "accepted")
    .reduce((sum, f) => sum + (f.refund_amount || 0), 0)

  // Filter filings based on selected tab
  const filteredFilings = filings.filter((filing) => {
    if (selectedTab === "all") return true
    if (selectedTab === "accepted") return filing.filing_status === "accepted"
    if (selectedTab === "pending") return filing.filing_status === "submitted" || filing.filing_status === "pending"
    if (selectedTab === "rejected") return filing.filing_status === "rejected"
    return true
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    // Trigger a page refresh to fetch latest data
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-mesh p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Skeleton */}
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

          {/* Stats Grid Skeleton */}
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

          {/* Filings List Skeleton */}
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
    <div className="min-h-screen gradient-mesh p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-balance text-4xl font-bold tracking-tight">
                <span className="text-gradient">Tax Filing Dashboard</span>
              </h1>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-pretty text-muted-foreground text-lg">
              Track your tax returns and filing status in real-time
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="hover-lift bg-transparent"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button asChild className="hover-lift shadow-lg glow-purple">
              <Link href="/dashboard/filing/new">
                <FileText className="mr-2 h-4 w-4" />
                New Filing
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-effect border-0 hover-lift hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Filings</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{totalFilings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 hover-lift hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{acceptedFilings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalFilings > 0 ? Math.round((acceptedFilings / totalFilings) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 hover-lift hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingFilings}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting IRS response</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 hover-lift hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${totalRefunds.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Accepted returns</p>
            </CardContent>
          </Card>
        </div>

        {/* Filings List */}
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="text-2xl">Filing History</CardTitle>
            <CardDescription className="text-base">View and manage all your tax return submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="glass-effect">
                <TabsTrigger value="all">All ({totalFilings})</TabsTrigger>
                <TabsTrigger value="accepted">Accepted ({acceptedFilings})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingFilings})</TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({filings.filter((f) => f.filing_status === "rejected").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                {filteredFilings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No filings found</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      {selectedTab === "all"
                        ? "Get started by filing your first tax return"
                        : `No ${selectedTab} filings to display`}
                    </p>
                    {selectedTab === "all" && (
                      <Button asChild size="lg" className="hover-lift shadow-lg glow-purple">
                        <Link href="/dashboard/filing/new">
                          <Sparkles className="mr-2 h-4 w-4" />
                          File Your First Return
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFilings.map((filing) => (
                      <FilingCard key={filing.id} filing={filing} />
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

function FilingCard({ filing }: { filing: Filing }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "submitted":
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <RefreshCw className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="glass-effect border-0 hover-lift hover:shadow-2xl transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header Row */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Tax Year {filing.tax_year}</h3>
              {getStatusBadge(filing.filing_status)}
              {filing.irs_status && (
                <Badge variant="outline" className="text-xs">
                  IRS: {filing.irs_status}
                </Badge>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Filed</p>
                  <p className="font-medium">
                    {filing.filed_at
                      ? formatDistanceToNow(new Date(filing.filed_at), { addSuffix: true })
                      : "Not filed"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Submission ID</p>
                  <p className="font-mono text-xs">{filing.submission_id || "N/A"}</p>
                </div>
              </div>

              {filing.refund_amount && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-muted-foreground">Refund Amount</p>
                    <p className="font-semibold text-green-600">${filing.refund_amount.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Rejection Reasons */}
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

            {/* Acceptance Info */}
            {filing.accepted_at && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                <span>Accepted {formatDistanceToNow(new Date(filing.accepted_at), { addSuffix: true })}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/filing/${filing.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
            {filing.filing_status === "accepted" && (
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
