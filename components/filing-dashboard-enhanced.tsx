"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
  DollarSign,
  Calendar,
  PlusCircle,
  Upload,
  Eye,
  ArrowRight,
  Wallet,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Filing {
  id: string
  tax_year: number
  form_type: "W-2" | "1099-NEC"
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

interface FilingDashboardEnhancedProps {
  user: any
  filings: Filing[]
  isLoading?: boolean
}

export function FilingDashboardEnhanced({ user, filings, isLoading = false }: FilingDashboardEnhancedProps) {
  const [selectedTab, setSelectedTab] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

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
    setTimeout(() => {
      setRefreshing(false)
      toast({
        title: "✅ Dashboard Refreshed",
        description: "Latest filing statuses loaded.",
      })
    }, 1000)
  }

  const handleStatCardClick = (tab: string) => {
    setSelectedTab(tab)
    const filingsTable = document.getElementById("filings-table")
    if (filingsTable) {
      filingsTable.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500">Loading your filings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pr-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tax Filing Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage all your tax filings and track their status</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-slate-200 bg-transparent"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Link href="/dashboard/filing/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Filing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="border-slate-200 bg-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleStatCardClick("all")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">Total Filings</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalFilings}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card
          className="border-green-200 bg-green-50 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleStatCardClick("accepted")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700">Accepted</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{acceptedFilings}</div>
            <p className="text-xs text-green-600 mt-1">Successfully processed</p>
          </CardContent>
        </Card>

        <Card
          className="border-amber-200 bg-amber-50 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleStatCardClick("pending")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-amber-700">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{pendingFilings}</div>
            <p className="text-xs text-amber-600 mt-1">In processing</p>
          </CardContent>
        </Card>

        <Card
          className="border-indigo-200 bg-indigo-50 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => handleStatCardClick("accepted")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-indigo-700">Total Refunds</CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-700">${totalRefunds.toLocaleString()}</div>
            <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Auto-deposited to Taxu Bank
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Ready to file your taxes?</h3>
                <p className="text-sm text-slate-600">
                  Upload documents or manually enter your information to get started
                </p>
              </div>
            </div>
            <Link href="/dashboard/filing/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Start Filing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Filings Table */}
      <Card id="filings-table" className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All ({totalFilings})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="data-[state=active]:bg-white">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Accepted ({acceptedFilings})
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white">
                <Clock className="h-4 w-4 mr-1" />
                Pending ({pendingFilings})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-white">
                <XCircle className="h-4 w-4 mr-1" />
                Rejected
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {filteredFilings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-slate-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No filings yet</h3>
              <p className="text-slate-500 mb-6">
                {selectedTab === "all"
                  ? "Start your first tax filing to see it appear here"
                  : `No ${selectedTab} filings found`}
              </p>
              <Link href="/dashboard/filing/new">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create First Filing
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFilings.map((filing) => {
                const status = filing.filing_status.toLowerCase()
                const isAccepted = status === "accepted"
                const isPending = ["submitted", "pending", "processing"].includes(status)
                const isRejected = status === "rejected"

                return (
                  <Link key={filing.id} href={`/dashboard/filing/${filing.id}`}>
                    <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={cn(
                              "p-3 rounded-lg",
                              isAccepted && "bg-green-100",
                              isPending && "bg-amber-100",
                              isRejected && "bg-red-100",
                            )}
                          >
                            {isAccepted && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                            {isPending && <Clock className="h-5 w-5 text-amber-600 animate-pulse" />}
                            {isRejected && <XCircle className="h-5 w-5 text-red-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900">
                                {filing.form_type} - Tax Year {filing.tax_year}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs",
                                  isAccepted && "bg-green-100 text-green-700",
                                  isPending && "bg-amber-100 text-amber-700",
                                  isRejected && "bg-red-100 text-red-700",
                                )}
                              >
                                {filing.filing_status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Filed {formatDistanceToNow(new Date(filing.filed_at || filing.created_at))} ago
                              </span>
                              <span>ID: {filing.submission_id || "Pending"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {filing.refund_amount && isAccepted && (
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                ${filing.refund_amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Wallet className="h-3 w-3" />
                                Deposited to Taxu Bank
                              </div>
                            </div>
                          )}
                          <Button variant="ghost" size="sm" className="text-indigo-600">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
