"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  Search,
  Download,
  Settings,
  TrendingUp,
} from "lucide-react"

const connectedAccounts = [
  {
    id: 1,
    bank: "Chase Business Checking",
    accountNumber: "****4521",
    balance: 45230.5,
    lastSync: "2 hours ago",
    status: "connected",
    unreviewed: 12,
  },
  {
    id: 2,
    bank: "American Express Business",
    accountNumber: "****8901",
    balance: -2340.0,
    lastSync: "1 day ago",
    status: "connected",
    unreviewed: 5,
  },
  {
    id: 3,
    bank: "Wells Fargo Savings",
    accountNumber: "****7623",
    balance: 125000.0,
    lastSync: "3 hours ago",
    status: "connected",
    unreviewed: 0,
  },
]

const recentTransactions = [
  {
    id: 1,
    date: "2025-01-15",
    description: "ACME Corp - Invoice #1234",
    amount: 2500.0,
    category: "Revenue",
    status: "categorized",
    account: "Chase",
  },
  {
    id: 2,
    date: "2025-01-15",
    description: "AWS Services",
    amount: -450.0,
    category: "Software & Subscriptions",
    status: "categorized",
    account: "Amex",
  },
  {
    id: 3,
    date: "2025-01-14",
    description: "Office Depot",
    amount: -125.5,
    category: null,
    status: "needs-review",
    account: "Chase",
  },
  {
    id: 4,
    date: "2025-01-14",
    description: "Client Payment - Wire Transfer",
    amount: 5000.0,
    category: null,
    status: "needs-review",
    account: "Chase",
  },
  {
    id: 5,
    date: "2025-01-13",
    description: "Google Workspace",
    amount: -30.0,
    category: "Software & Subscriptions",
    status: "categorized",
    account: "Amex",
  },
]

export default function BankFeedsClient() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/accounting/bank-feeds/reconciliation">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unreconciled</p>
                <p className="text-2xl font-bold">17</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-500/10">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/accounting/bank-feeds/rules">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/accounting/bank-feeds/analytics">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Matched</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </Card>
        </Link>
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">342</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Connected Accounts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Connected Accounts</h2>
          <div className="flex gap-2">
            <Link href="/accounting/bank-feeds/rules">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Manage Rules
              </Button>
            </Link>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Bank Account
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {connectedAccounts.map((account) => (
            <Link key={account.id} href={`/accounting/bank-feeds/${account.id}/reconcile`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {account.accountNumber.includes("****") && account.bank.includes("Express") ? (
                        <CreditCard className="h-5 w-5 text-primary" />
                      ) : (
                        <Building2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{account.bank}</p>
                      <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                    </div>
                  </div>
                  <Badge variant={account.status === "connected" ? "default" : "secondary"}>{account.status}</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold">
                      ${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last synced {account.lastSync}</span>
                    {account.unreviewed > 0 && (
                      <Badge variant="outline" className="text-orange-600">
                        {account.unreviewed} to review
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Description</th>
                  <th className="text-left p-4 font-medium">Account</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                  <th className="text-center p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm">{txn.date}</td>
                    <td className="p-4 font-medium">{txn.description}</td>
                    <td className="p-4 text-sm text-muted-foreground">{txn.account}</td>
                    <td className="p-4">
                      {txn.category ? (
                        <Badge variant="outline">{txn.category}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Uncategorized</span>
                      )}
                    </td>
                    <td
                      className={`p-4 text-right font-mono font-medium ${txn.amount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {txn.amount > 0 ? "+" : ""}$
                      {Math.abs(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      {txn.status === "categorized" ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Categorized
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-orange-600">
                          <AlertCircle className="h-3 w-3" />
                          Needs Review
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {txn.status === "needs-review" ? (
                        <Link href={`/accounting/bank-feeds/transaction/${txn.id}`}>
                          <Button size="sm">Review</Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
