"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingDown, Receipt, Calendar, PieChart, CheckCircle } from "lucide-react"

export function ExpensesBreakdownClient({ expenses }: { expenses: any[] }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0)
  const taxDeductible = expenses
    .filter((exp) => exp.is_tax_deductible)
    .reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0)

  const categoryExpenses = expenses.reduce(
    (acc, exp) => {
      const category = exp.category || "Uncategorized"
      acc[category] = (acc[category] || 0) + Number.parseFloat(exp.amount || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const monthlyExpenses = expenses.reduce(
    (acc, exp) => {
      const month = new Date(exp.expense_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      acc[month] = (acc[month] || 0) + Number.parseFloat(exp.amount || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const topCategories = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/accounting">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Expenses Breakdown</h1>
              <p className="text-muted-foreground mt-1">Detailed expense analysis and categorization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
            </div>
            <p className="text-3xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Tax Deductible</p>
            </div>
            <p className="text-3xl font-bold text-green-600">${taxDeductible.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Receipt className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
            <p className="text-3xl font-bold">{expenses.length}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Expenses by Category
            </h2>
            <div className="space-y-4">
              {topCategories.map(([category, amount]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    <span className="text-lg font-bold text-red-600">${amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(amount / totalExpenses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Expenses
            </h2>
            <div className="space-y-4">
              {Object.entries(monthlyExpenses).map(([month, amount]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{month}</span>
                  <span className="text-lg font-bold text-red-600">${amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
