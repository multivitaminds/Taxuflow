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
  Filter,
} from "lucide-react"

interface AccountingDashboardClientProps {
  user: any
  invoices: any[]
  expenses: any[]
  customers: any[]
  recentTransactions: any[]
}

export function AccountingDashboardClient({
  user,
  invoices,
  expenses,
  customers,
  recentTransactions,
}: AccountingDashboardClientProps) {
  // Calculate metrics
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.total_amount || 0), 0)

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0)

  const profit = totalRevenue - totalExpenses

  const outstandingInvoices = invoices
    .filter((inv) => inv.status !== "paid" && inv.status !== "cancelled")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.amount_due || 0), 0)

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Accounting</h1>
              <p className="text-muted-foreground">Manage your business finances</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/accounting/revenue">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs text-green-500 font-medium">+12.5%</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/expenses-breakdown">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <span className="text-xs text-red-500 font-medium">+8.2%</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/profit-breakdown">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-xs text-blue-500 font-medium">
                  {profit >= 0 ? "+" : ""}
                  {totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : "0"}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold">${profit.toLocaleString()}</p>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/outstanding">
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-500" />
                </div>
                {overdueInvoices > 0 && (
                  <span className="text-xs text-orange-500 font-medium">{overdueInvoices} overdue</span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">${outstandingInvoices.toLocaleString()}</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/accounting/invoices/new">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">New Invoice</p>
                  <p className="text-sm text-muted-foreground">Create invoice</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/expenses/new">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Add Expense</p>
                  <p className="text-sm text-muted-foreground">Track spending</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/customers/new">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Add Customer</p>
                  <p className="text-sm text-muted-foreground">New client</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/reports">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed hover:border-primary">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">View Reports</p>
                  <p className="text-sm text-muted-foreground">Financial insights</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <Link href="/accounting/invoices">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No invoices yet</p>
                  <Link href="/accounting/invoices/new">
                    <Button size="sm" className="mt-3">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                invoices.slice(0, 5).map((invoice) => (
                  <Link key={invoice.id} href={`/accounting/invoices/${invoice.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            Due {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${Number.parseFloat(invoice.total_amount).toLocaleString()}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            invoice.status === "paid"
                              ? "bg-green-500/10 text-green-500"
                              : invoice.status === "overdue"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-orange-500/10 text-orange-500"
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
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Expenses</h2>
              <Link href="/accounting/expenses">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No expenses yet</p>
                  <Link href="/accounting/expenses/new">
                    <Button size="sm" className="mt-3">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              ) : (
                expenses.slice(0, 5).map((expense) => (
                  <Link key={expense.id} href={`/accounting/expenses/${expense.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded">
                          <Receipt className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(expense.expense_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-500">
                          -${Number.parseFloat(expense.amount).toLocaleString()}
                        </p>
                        {expense.is_tax_deductible && <span className="text-xs text-green-500">Tax deductible</span>}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Cash Flow Chart Placeholder */}
        <Card className="p-6 mt-6">
          <h2 className="text-lg font-semibold mb-6">Cash Flow Overview</h2>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Cash flow chart coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
