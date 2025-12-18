"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { DollarSign, TrendingUp, FileText, Users, Receipt, ArrowUpRight, Plus, BarChart3 } from "lucide-react"
import { FinancialTrendGraph } from "@/components/financial-trend-graph"
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
  const router = useRouter()
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

  const unpaidTotal = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.total_amount || 0), 0)

  const unpaidCount = invoices.filter((inv) => inv.status !== "paid").length

  const revenueGrowth = Math.floor(Math.random() * 20) - 10 // Simulated revenue growth
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0" // Net profit margin

  const generateChartData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      name: month,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      expenses: Math.floor(Math.random() * 3000) + 1000,
    }))
  }

  const chartData = generateChartData()

  return (
    <div className="p-8 pt-3.5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Accounting Dashboard</h1>
        <p className="text-slate-600">Manage your business finances in one place</p>
      </div>

      {/* Financial Trend Graph */}
      <div className="mb-6">
        <FinancialTrendGraph
          title="Revenue vs Expenses (Last 6 months)"
          metrics={[
            {
              label: "Total Revenue",
              value: totalRevenue,
              change: `+${revenueGrowth}% from last month`,
              color: "#22c55e",
            },
            { label: "Total Expenses", value: totalExpenses, color: "#ef4444" },
            { label: "Net Profit", value: profit, change: `${profitMargin}% margin`, color: "#3b82f6" },
          ]}
          graphData={chartData.map((item) => ({
            name: item.name,
            revenue: item.revenue,
            expenses: item.expenses,
          }))}
          graphKeys={[
            { key: "revenue", color: "#22c55e", label: "Revenue" },
            { key: "expenses", color: "#ef4444", label: "Expenses" },
          ]}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Total Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />+{revenueGrowth}% from last month
          </p>
        </Card>

        <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Outstanding</span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">${unpaidTotal.toLocaleString()}</p>
          <p className="text-sm text-slate-500 mt-2">{unpaidCount} unpaid invoices</p>
        </Card>

        <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Total Customers</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{customers.length}</p>
          <p className="text-sm text-slate-500 mt-2">Active clients</p>
        </Card>

        <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Profit Margin</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{profitMargin}%</p>
          <p className="text-sm text-slate-500 mt-2">Net profit margin</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/accounting/invoices/new")}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Create Invoice</h3>
            <p className="text-sm text-slate-600">Generate a new invoice</p>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-purple-50 to-white border-purple-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/accounting/expenses/new")}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Add Expense</h3>
            <p className="text-sm text-slate-600">Record a new expense</p>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/accounting/customers/new")}
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Add Customer</h3>
            <p className="text-sm text-slate-600">Create a new customer</p>
          </Card>

          <Card
            className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/accounting/reports")}
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">View Reports</h3>
            <p className="text-sm text-slate-600">Financial reports</p>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
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
                        <p className="text-sm text-slate-500">Due {new Date(invoice.due_date).toLocaleDateString()}</p>
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
  )
}
