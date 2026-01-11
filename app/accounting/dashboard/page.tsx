"use client"

import { DemoModeBanner } from "@/components/demo-mode-banner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, FileText, Users, ArrowUpRight, ArrowDownRight, Download, Plus } from "lucide-react"
import Link from "next/link"

export default function AccountingDashboardPage() {
  const stats = [
    {
      label: "Total Revenue",
      value: "$125,480",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: "Total Expenses",
      value: "$45,230",
      change: "-3.2%",
      trend: "down",
      icon: DollarSign,
    },
    {
      label: "Outstanding Invoices",
      value: "24",
      change: "+8",
      trend: "up",
      icon: FileText,
    },
    {
      label: "Active Clients",
      value: "156",
      change: "+12",
      trend: "up",
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DemoModeBanner />
      <div className="px-24 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Accounting Dashboard</h1>
            <p className="text-muted-foreground">Manage your books and financial health</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="w-4 h-4" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/accounting/invoices/new">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">Create Invoice</h3>
              <p className="text-sm text-muted-foreground">Generate a new invoice for your clients</p>
            </Card>
          </Link>
          <Link href="/accounting/expenses/new">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">Record Expense</h3>
              <p className="text-sm text-muted-foreground">Track business expenses and receipts</p>
            </Card>
          </Link>
          <Link href="/accounting/reports">
            <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur group">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">View Reports</h3>
              <p className="text-sm text-muted-foreground">Access financial reports and insights</p>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 border-0 bg-white/80 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                    {i}
                  </div>
                  <div>
                    <p className="font-semibold">Transaction #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Jan {i}, 2025</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(Math.random() * 1000).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
