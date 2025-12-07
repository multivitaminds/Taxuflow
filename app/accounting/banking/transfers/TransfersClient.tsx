"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, ArrowLeftRight, Search, Download, Filter } from "lucide-react"

const transfers = [
  {
    id: "1",
    date: "2025-01-15",
    fromAccount: "Business Checking",
    fromAccountNumber: "****1234",
    toAccount: "Payroll Account",
    toAccountNumber: "****9012",
    amount: 5000.0,
    status: "completed",
    note: "Monthly payroll transfer",
    createdBy: "John Doe",
  },
  {
    id: "2",
    date: "2025-01-14",
    fromAccount: "Business Savings",
    fromAccountNumber: "****5678",
    toAccount: "Business Checking",
    toAccountNumber: "****1234",
    amount: 10000.0,
    status: "completed",
    note: "Operating funds transfer",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    date: "2025-01-13",
    fromAccount: "Business Checking",
    fromAccountNumber: "****1234",
    toAccount: "Reserve Account",
    toAccountNumber: "****3456",
    amount: 15000.0,
    status: "pending",
    note: "Quarterly reserve funding",
    createdBy: "John Doe",
  },
]

export default function TransfersClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const totalTransfers = transfers.length
  const totalAmount = transfers.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
  const pendingTransfers = transfers.filter((t) => t.status === "pending").length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <ArrowLeftRight className="h-5 w-5 text-cyan-600" />
            </div>
            <span className="text-sm text-muted-foreground">Total Transfers</span>
          </div>
          <div className="text-3xl font-bold">{totalTransfers}</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <ArrowLeftRight className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-muted-foreground">Total Amount</span>
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <ArrowLeftRight className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">{pendingTransfers}</div>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transfers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/accounting/banking/transfers/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </Link>
        </div>
      </div>

      {/* Transfers List */}
      <Card>
        <div className="p-6 space-y-4">
          {transfers
            .filter(
              (t) =>
                t.fromAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.toAccount.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((transfer) => (
              <div key={transfer.id} className="p-4 rounded-lg border hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-cyan-500/10">
                      <ArrowLeftRight className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {transfer.fromAccount} → {transfer.toAccount}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">{transfer.date}</p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">by {transfer.createdBy}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${transfer.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant={transfer.status === "completed" ? "default" : "secondary"} className="mt-1">
                      {transfer.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pl-16">
                  <span>From: {transfer.fromAccountNumber}</span>
                  <span>→</span>
                  <span>To: {transfer.toAccountNumber}</span>
                </div>

                {transfer.note && <p className="text-sm text-muted-foreground mt-3 pl-16">Note: {transfer.note}</p>}
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
