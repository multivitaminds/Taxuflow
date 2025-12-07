"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  Download,
} from "lucide-react"
import Link from "next/link"

const accountDetails = {
  "1": {
    code: "1000",
    name: "Cash",
    type: "asset",
    balance: 45230.5,
    description: "Primary cash account for operating funds",
    openingBalance: 40000.0,
    currentBalance: 45230.5,
    ytdActivity: 5230.5,
  },
}

const transactions = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Client Payment - Invoice #1045",
    debit: 2500.0,
    credit: 0,
    balance: 45230.5,
    reference: "INV-1045",
  },
  {
    id: 2,
    date: "2024-01-14",
    description: "Office Supplies",
    debit: 0,
    credit: 350.0,
    balance: 42730.5,
    reference: "BILL-892",
  },
  {
    id: 3,
    date: "2024-01-12",
    description: "Client Payment - Invoice #1042",
    debit: 1800.0,
    credit: 0,
    balance: 43080.5,
    reference: "INV-1042",
  },
]

const subAccounts = [
  { id: 1, code: "1010", name: "Petty Cash", balance: 500.0, transactions: 12 },
  { id: 2, code: "1020", name: "Operating Account", balance: 35230.5, transactions: 145 },
  { id: 3, code: "1030", name: "Payroll Account", balance: 9500.0, transactions: 28 },
]

export default function AccountDetailClient({ accountId }: { accountId: string }) {
  const [activeTab, setActiveTab] = useState("overview")
  const account = accountDetails[accountId as keyof typeof accountDetails] || accountDetails["1"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/chart-of-accounts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chart
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{account.name}</h1>
              <Badge variant="outline" className="capitalize">
                {account.type}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Account #{account.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Current Balance</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100">
            ${account.currentBalance.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Opening Balance</p>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            ${account.openingBalance.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">YTD Activity</p>
            <TrendingDown className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            ${account.ytdActivity.toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Transactions</p>
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{transactions.length}</p>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="sub-accounts">Sub-Accounts</TabsTrigger>
          <TabsTrigger value="journal-entries">Journal Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Code</p>
                <p className="font-mono font-medium">{account.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="font-medium capitalize">{account.type}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{account.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("transactions")}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-semibold ${txn.debit > 0 ? "text-green-600" : "text-red-600"}`}>
                      {txn.debit > 0 ? "+" : "-"}${Math.abs(txn.debit || txn.credit).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Transactions</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-right p-4 font-medium">Debit</th>
                    <th className="text-right p-4 font-medium">Credit</th>
                    <th className="text-right p-4 font-medium">Balance</th>
                    <th className="text-left p-4 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer">
                      <td className="p-4 font-mono text-sm">{txn.date}</td>
                      <td className="p-4">{txn.description}</td>
                      <td className="p-4 text-right font-mono text-green-600">
                        {txn.debit > 0 ? `$${txn.debit.toLocaleString()}` : "-"}
                      </td>
                      <td className="p-4 text-right font-mono text-red-600">
                        {txn.credit > 0 ? `$${txn.credit.toLocaleString()}` : "-"}
                      </td>
                      <td className="p-4 text-right font-mono font-semibold">${txn.balance.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge variant="outline">{txn.reference}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sub-accounts" className="mt-6">
          <Card>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Sub-Accounts</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Sub-Account
              </Button>
            </div>
            <div className="p-6 space-y-4">
              {subAccounts.map((sub) => (
                <Link key={sub.id} href={`/accounting/chart-of-accounts/${sub.id}`}>
                  <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{sub.name}</p>
                          <p className="text-sm text-muted-foreground">Account #{sub.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${sub.balance.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{sub.transactions} transactions</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="journal-entries" className="mt-6">
          <Card>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Journal Entries</h3>
              <Link href={`/accounting/chart-of-accounts/${accountId}/journal-entry/new`}>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground text-center py-8">
                No journal entries yet. Create your first entry to get started.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
