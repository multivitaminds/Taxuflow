"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  Download,
  Flag,
  Receipt,
  MessageSquare,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data - would be fetched based on transactionId
const getTransactionData = (id: string) => {
  const transactions: Record<string, any> = {
    "1": {
      id: "1",
      recipient: "Acme Corporation",
      amount: -5240.0,
      status: "completed",
      method: "ACH",
      date: "Today, 2:45 PM",
      fullDate: "December 30, 2024 at 2:45 PM",
      type: "outgoing",
      reference: "Invoice #1234",
      confirmationNumber: "TXU-20241230-00128",
      fromAccount: "Business Checking ••4291",
      toAccount: "Acme Corp ••7742",
      category: "Vendor Payment",
      description: "Monthly software subscription payment for Q4 2024",
      timeline: [
        { time: "2:45 PM", status: "Initiated", description: "Transfer initiated", completed: true },
        { time: "2:46 PM", status: "Verified", description: "Account verified", completed: true },
        { time: "2:47 PM", status: "Processing", description: "ACH transfer in progress", completed: true },
        { time: "Expected: Dec 31", status: "Complete", description: "Funds will arrive", completed: false },
      ],
    },
    "2": {
      id: "2",
      recipient: "Sarah Johnson",
      amount: -1250.0,
      status: "pending",
      method: "Wire",
      date: "Today, 11:20 AM",
      fullDate: "December 30, 2024 at 11:20 AM",
      type: "outgoing",
      reference: "Contractor payment",
      confirmationNumber: "TXU-20241230-00094",
      fromAccount: "Business Checking ••4291",
      toAccount: "Chase Bank ••2847",
      category: "Contractor Payment",
      description: "Freelance design work for marketing campaign",
      timeline: [
        { time: "11:20 AM", status: "Initiated", description: "Wire initiated", completed: true },
        { time: "11:22 AM", status: "Verified", description: "Identity verified", completed: true },
        { time: "Processing", status: "In Transit", description: "Wire in progress", completed: false },
        { time: "Expected: Today 5 PM", status: "Complete", description: "Same-day arrival", completed: false },
      ],
    },
    "3": {
      id: "3",
      recipient: "Tech Solutions Inc",
      amount: 8500.0,
      status: "completed",
      method: "ACH",
      date: "Yesterday, 3:30 PM",
      fullDate: "December 29, 2024 at 3:30 PM",
      type: "incoming",
      reference: "Payment received",
      confirmationNumber: "TXU-20241229-00342",
      fromAccount: "Tech Solutions ••9384",
      toAccount: "Business Checking ••4291",
      category: "Client Payment",
      description: "Q4 consulting services payment",
      timeline: [
        { time: "3:30 PM", status: "Initiated", description: "Payment sent", completed: true },
        { time: "3:32 PM", status: "Verified", description: "Sender verified", completed: true },
        { time: "3:35 PM", status: "Processing", description: "ACH clearing", completed: true },
        { time: "3:40 PM", status: "Complete", description: "Funds deposited", completed: true },
      ],
    },
  }

  return transactions[id] || transactions["1"]
}

export function TransactionDetailClient({ transactionId }: { transactionId: string }) {
  const transaction = getTransactionData(transactionId)
  const [flagged, setFlagged] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getIcon = () => {
    if (transaction.type === "incoming") {
      return <ArrowDownRight className="h-8 w-8 text-white" />
    } else if (transaction.type === "internal") {
      return <ArrowLeftRight className="h-8 w-8 text-white" />
    } else {
      return <ArrowUpRight className="h-8 w-8 text-white" />
    }
  }

  const getIconBg = () => {
    if (transaction.type === "incoming") {
      return "bg-gradient-to-br from-emerald-500 to-teal-500"
    } else if (transaction.type === "internal") {
      return "bg-gradient-to-br from-amber-500 to-orange-500"
    } else {
      return "bg-gradient-to-br from-[#635bff] to-[#00d4ff]"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] text-white">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <Link
            href="/neobank/transactions"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Link>

          <div className="flex items-start justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg", getIconBg())}>
                {getIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{transaction.recipient}</h1>
                <p className="text-white/80 mb-3">{transaction.reference}</p>
                <div className="flex items-center gap-3">{getStatusBadge(transaction.status)}</div>
              </div>
            </div>

            <div className="text-right">
              <p
                className={cn("text-4xl font-bold mb-1", transaction.type === "incoming" ? "text-white" : "text-white")}
              >
                {transaction.amount > 0 ? "+" : ""}$
                {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-white/70 text-sm">{transaction.fullDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details Card */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Confirmation Number</p>
                    <p className="font-mono font-semibold">{transaction.confirmationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Payment Method</p>
                    <Badge variant="outline" className="font-semibold">
                      {transaction.method}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Category</p>
                    <p className="font-semibold">{transaction.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
                    <p className="font-mono text-sm">{transaction.id}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-slate-500 mb-2">Description</p>
                  <p className="text-slate-700">{transaction.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">From</p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{transaction.fromAccount}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">To</p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{transaction.toAccount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-xl">Transaction Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {transaction.timeline.map((step: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center border-2",
                            step.completed ? "bg-[#635bff] border-[#635bff]" : "bg-white border-slate-300",
                          )}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <Clock className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        {index < transaction.timeline.length - 1 && (
                          <div className={cn("w-0.5 h-12", step.completed ? "bg-[#635bff]" : "bg-slate-200")} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{step.status}</p>
                          <p className="text-sm text-slate-500">{step.time}</p>
                        </div>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Receipt className="h-4 w-4 mr-2" />
                  Get Invoice
                </Button>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start", flagged && "bg-amber-50 border-amber-300")}
                  size="lg"
                  onClick={() => setFlagged(!flagged)}
                >
                  <Flag className={cn("h-4 w-4 mr-2", flagged && "text-amber-600")} />
                  {flagged ? "Flagged" : "Flag Transaction"}
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </CardContent>
            </Card>

            {/* Related Info Card */}
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg">Related Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Merchant Location</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <p className="text-sm">San Francisco, CA</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Tax Category</p>
                  <Badge variant="outline" className="bg-slate-50">
                    Business Expense
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-500 mb-2">Similar Transactions</p>
                  <Link
                    href="/neobank/transactions?merchant=acme"
                    className="text-sm text-[#635bff] hover:underline block"
                  >
                    View 3 similar transactions →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
