"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const allTransactions = [
  {
    id: "1",
    recipient: "Acme Corporation",
    amount: -5240.0,
    status: "completed",
    method: "ACH",
    date: "Today, 2:45 PM",
    type: "outgoing",
    reference: "Invoice #1234",
    category: "Vendor Payment",
  },
  {
    id: "2",
    recipient: "Sarah Johnson",
    amount: -1250.0,
    status: "pending",
    method: "Wire",
    date: "Today, 11:20 AM",
    type: "outgoing",
    reference: "Contractor payment",
    category: "Contractor Payment",
  },
  {
    id: "3",
    recipient: "Tech Solutions Inc",
    amount: 8500.0,
    status: "completed",
    method: "ACH",
    date: "Yesterday, 3:30 PM",
    type: "incoming",
    reference: "Payment received",
    category: "Client Payment",
  },
  {
    id: "4",
    recipient: "Tax Bucket - Federal",
    amount: -2100.0,
    status: "completed",
    method: "Internal",
    date: "Dec 28, 2024",
    type: "internal",
    reference: "Automated savings",
    category: "Tax Savings",
  },
  {
    id: "5",
    recipient: "Marketing Agency",
    amount: -3200.0,
    status: "completed",
    method: "ACH",
    date: "Dec 27, 2024",
    type: "outgoing",
    reference: "Monthly retainer",
    category: "Marketing",
  },
  {
    id: "6",
    recipient: "Office Supplies Co",
    amount: -845.5,
    status: "completed",
    method: "ACH",
    date: "Dec 26, 2024",
    type: "outgoing",
    reference: "Office equipment",
    category: "Office Supplies",
  },
  {
    id: "7",
    recipient: "Consulting Client",
    amount: 12500.0,
    status: "completed",
    method: "Wire",
    date: "Dec 25, 2024",
    type: "incoming",
    reference: "Consulting fees",
    category: "Client Payment",
  },
  {
    id: "8",
    recipient: "Software Subscription",
    amount: -299.0,
    status: "completed",
    method: "ACH",
    date: "Dec 24, 2024",
    type: "outgoing",
    reference: "Monthly SaaS",
    category: "Software",
  },
]

export function AllTransactionsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

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
      default:
        return <Badge>{status}</Badge>
    }
  }

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const totalIncoming = allTransactions.filter((t) => t.type === "incoming").reduce((sum, t) => sum + t.amount, 0)
  const totalOutgoing = allTransactions
    .filter((t) => t.type === "outgoing")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <Link
            href="/neobank/transactions"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Transfers
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">All Transactions</h1>
              <p className="text-white/80 text-lg">Complete transaction history</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button variant="secondary" className="bg-white text-[#635bff] hover:bg-white/90">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Total Transactions</p>
              <p className="text-3xl font-bold">{allTransactions.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Money In</p>
              <p className="text-3xl font-bold text-emerald-300">
                ${totalIncoming.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Money Out</p>
              <p className="text-3xl font-bold">
                ${totalOutgoing.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters */}
        <Card className="border-slate-200 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-xl">
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction) => (
                <Link
                  key={transaction.id}
                  href={`/neobank/transactions/${transaction.id}`}
                  className="flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center shadow-md flex-shrink-0",
                      transaction.type === "incoming"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                        : transaction.type === "internal"
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-[#635bff] to-[#00d4ff]",
                    )}
                  >
                    {transaction.type === "incoming" ? (
                      <ArrowDownRight className="h-6 w-6 text-white" />
                    ) : transaction.type === "internal" ? (
                      <ArrowLeftRight className="h-6 w-6 text-white" />
                    ) : (
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-base">{transaction.recipient}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{transaction.reference}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.method}
                      </Badge>
                      <span>•</span>
                      <span>{transaction.category}</span>
                    </div>
                  </div>

                  {/* Amount and Date */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={cn(
                        "text-lg font-bold mb-1",
                        transaction.type === "incoming" ? "text-emerald-600" : "text-slate-900",
                      )}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500">{transaction.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
