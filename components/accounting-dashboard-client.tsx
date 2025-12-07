"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Receipt,
  ArrowUpRight,
  Plus,
  Download,
  Wallet,
  BarChart3,
  Building2,
  CreditCard,
  Package,
  AlertCircle,
  Settings2,
  RefreshCw,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"

interface AccountingDashboardClientProps {
  user: any
  invoices: any[]
  expenses: any[]
  customers: any[]
  allInvoices: any[]
}

export function AccountingDashboardClient({
  user,
  invoices,
  expenses,
  customers,
  allInvoices,
}: AccountingDashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    window.location.reload()
  }

  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.total_amount || 0), 0)

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0)

  const profit = totalRevenue - totalExpenses

  const outstandingInvoices = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.amount_due || 0), 0)

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length

  const generateChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      name: month,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      expenses: Math.floor(Math.random() * 3000) + 1000,
    }))
  }

  const chartData = generateChartData()

  const menuItems = [
    {
      title: "Invoices",
      icon: FileText,
      href: "/accounting/invoices",
      description: "Create and manage invoices",
      color: "blue",
      count: invoices.length,
    },
    {
      title: "Expenses",
      icon: Wallet,
      href: "/accounting/expenses",
      description: "Track business expenses",
      color: "red",
      count: expenses.length,
    },
    {
      title: "Customers",
      icon: Users,
      href: "/accounting/customers",
      description: "Manage customer relationships",
      color: "purple",
      count: customers.length,
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/accounting/reports",
      description: "Financial insights & analytics",
      color: "green",
    },
    {
      title: "Vendors",
      icon: Building2,
      href: "/accounting/vendors",
      description: "Manage supplier relationships",
      color: "orange",
    },
    {
      title: "Banking",
      icon: CreditCard,
      href: "/accounting/banking",
      description: "Connect bank accounts",
      color: "cyan",
    },
    {
      title: "Products",
      icon: Package,
      href: "/accounting/products",
      description: "Product catalog management",
      color: "pink",
    },
    {
      title: "Tax Center",
      icon: Receipt,
      href: "/accounting/tax",
      description: "Tax reports & deductions",
      color: "yellow",
    },
  ]

  const colorClasses = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", hover: "hover:bg-blue-100" },
    red: { bg: "bg-red-50", text: "text-red-600", hover: "hover:bg-red-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", hover: "hover:bg-purple-100" },
    green: { bg: "bg-green-50", text: "text-green-600", hover: "hover:bg-green-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", hover: "hover:bg-orange-100" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", hover: "hover:bg-cyan-100" },
    pink: { bg: "bg-pink-50", text: "text-pink-600", hover: "hover:bg-pink-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", hover: "hover:bg-yellow-100" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 pt-6 pb-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-slate-900">Accounting Hub</h1>
            <p className="text-slate-600">Comprehensive financial management for your business</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={handleRefresh}
              className="bg-white border-slate-300 hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/accounting/dashboard/customize">
              <Button variant="outline" size="default" className="bg-white border-slate-300 hover:bg-slate-50">
                <Settings2 className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </Link>
            <Button variant="outline" size="default" className="bg-white border-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Link href="/accounting/invoices/new">
              <Button size="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Last updated: {lastRefresh.toLocaleTimeString()} - {lastRefresh.toLocaleDateString()}
          </p>
          <Link href="/accounting/dashboard/customize">
            <Button variant="link" size="sm" className="text-blue-600">
              Customize your dashboard layout →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs text-green-700 font-semibold bg-green-200 px-3 py-1 rounded-full">+12.5%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-green-700 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">This month</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-xs text-red-700 font-semibold bg-red-200 px-3 py-1 rounded-full">+8.2%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-red-700 font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-900">${totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-red-600">This month</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  profit >= 0 ? "text-blue-700 bg-blue-200" : "text-red-700 bg-red-200"
                }`}
              >
                {profit >= 0 ? "+" : ""}
                {totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0"}%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-700 font-medium">Net Profit</p>
              <p className="text-3xl font-bold text-blue-900">${profit.toLocaleString()}</p>
              <p className="text-xs text-blue-600">Profit margin</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              {overdueInvoices > 0 && (
                <span className="text-xs text-orange-700 font-semibold bg-orange-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {overdueInvoices} overdue
                </span>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-orange-700 font-medium">Outstanding</p>
              <p className="text-3xl font-bold text-orange-900">${outstandingInvoices.toLocaleString()}</p>
              <p className="text-xs text-orange-600">Pending payment</p>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Financial Overview</h2>
              <p className="text-sm text-slate-500">Revenue vs Expenses (Last 6 months)</p>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="h-[300px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg animate-pulse">
                <div className="h-4 w-4 bg-slate-200 rounded-full" />
              </div>
            )}
          </div>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const colors = colorClasses[item.color as keyof typeof colorClasses]
              return (
                <Link key={item.title} href={item.href}>
                  <Card className="p-5 bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl ${colors.bg} ${colors.hover} transition-colors`}>
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                      {item.count !== undefined && (
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
              <Link href="/accounting/invoices">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="font-medium mb-2">No invoices yet</p>
                  <p className="text-sm mb-4">Create your first invoice to get started</p>
                  <Link href="/accounting/invoices/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                invoices.slice(0, 5).map((invoice) => (
                  <Link key={invoice.id} href={`/accounting/invoices/${invoice.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-all border border-slate-100 hover:border-blue-200 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{invoice.invoice_number}</p>
                          <p className="text-sm text-slate-500">
                            Due {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          ${Number.parseFloat(invoice.total_amount).toLocaleString()}
                        </p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : invoice.status === "overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>

          {/* Recent Expenses */}
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Expenses</h2>
              <Link href="/accounting/expenses">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg">
                  <Receipt className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="font-medium mb-2">No expenses yet</p>
                  <p className="text-sm mb-4">Start tracking your business expenses</p>
                  <Link href="/accounting/expenses/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              ) : (
                expenses.slice(0, 5).map((expense) => (
                  <Link key={expense.id} href={`/accounting/expenses/${expense.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-all border border-slate-100 hover:border-red-200 hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Receipt className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{expense.description}</p>
                          <p className="text-sm text-slate-500">{new Date(expense.entry_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">-${Number.parseFloat(expense.amount).toLocaleString()}</p>
                        {expense.category && (
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {expense.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
