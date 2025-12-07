"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Search, DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"

export function TransactionsReport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Sample transactions data
  const transactions = [
    {
      id: "TXN-001",
      date: "2025-01-15",
      description: "Adobe Creative Cloud",
      category: "Software",
      type: "debit",
      amount: 52.99,
      status: "completed",
      merchant: "Adobe Inc.",
    },
    {
      id: "TXN-002",
      date: "2025-01-14",
      description: "Client Payment - Web Design",
      category: "Income",
      type: "credit",
      amount: 3500.0,
      status: "completed",
      merchant: "Acme Corp",
    },
    {
      id: "TXN-003",
      date: "2025-01-13",
      description: "AWS Cloud Services",
      category: "Infrastructure",
      type: "debit",
      amount: 247.82,
      status: "completed",
      merchant: "Amazon Web Services",
    },
    {
      id: "TXN-004",
      date: "2025-01-12",
      description: "Office Supplies",
      category: "Office",
      type: "debit",
      amount: 127.45,
      status: "completed",
      merchant: "Staples",
    },
    {
      id: "TXN-005",
      date: "2025-01-11",
      description: "Marketing Campaign Payment",
      category: "Marketing",
      type: "debit",
      amount: 1500.0,
      status: "pending",
      merchant: "Google Ads",
    },
  ]

  const stats = {
    totalTransactions: transactions.length,
    totalIncome: transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0),
    netCashFlow:
      transactions.filter((t) => t.type === "credit").reduce((sum, t) => sum + t.amount, 0) -
      transactions.filter((t) => t.type === "debit").reduce((sum, t) => sum + t.amount, 0),
  }

  const handleExport = (format: string) => {
    alert(`Exporting transactions as ${format.toUpperCase()}...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Transactions Report
            </h1>
            <p className="text-lg text-slate-600">Complete transaction history and analysis</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport("pdf")}
              className="bg-white hover:bg-slate-50 border-slate-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("excel")}
              className="bg-white hover:bg-slate-50 border-slate-200"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              className="bg-white hover:bg-slate-50 border-slate-200"
            >
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-slate-200 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Total Transactions</span>
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.totalTransactions}</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-700">Total Income</span>
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-700">${stats.totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-rose-700">Total Expenses</span>
                <TrendingDown className="h-5 w-5 text-rose-600" />
              </div>
              <p className="text-3xl font-bold text-rose-700">${stats.totalExpenses.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card
            className={`border-slate-200 shadow-lg hover:shadow-xl transition-shadow ${
              stats.netCashFlow >= 0
                ? "bg-gradient-to-br from-blue-50 to-white"
                : "bg-gradient-to-br from-orange-50 to-white"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Net Cash Flow</span>
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <p className={`text-3xl font-bold ${stats.netCashFlow >= 0 ? "text-blue-700" : "text-orange-700"}`}>
                ${stats.netCashFlow.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-200"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  size="sm"
                  className={filterType === "all" ? "bg-indigo-600" : ""}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "credit" ? "default" : "outline"}
                  onClick={() => setFilterType("credit")}
                  size="sm"
                  className={filterType === "credit" ? "bg-emerald-600" : ""}
                >
                  Income
                </Button>
                <Button
                  variant={filterType === "debit" ? "default" : "outline"}
                  onClick={() => setFilterType("debit")}
                  size="sm"
                  className={filterType === "debit" ? "bg-rose-600" : ""}
                >
                  Expenses
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Description</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Category</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Merchant</th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-700">Amount</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-sm text-slate-600">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{txn.description}</p>
                          <p className="text-xs text-slate-500">{txn.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">
                          {txn.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{txn.merchant}</td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-sm font-semibold ${txn.type === "credit" ? "text-emerald-600" : "text-slate-900"}`}
                        >
                          {txn.type === "credit" ? "+" : "-"}${txn.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge
                          className={
                            txn.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          {txn.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
