"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Calendar, PieChart } from "lucide-react"

export function ProfitBreakdownClient({ invoices, expenses }: { invoices: any[]; expenses: any[] }) {
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number.parseFloat(inv.total_amount || 0), 0)

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0)
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  const monthlyProfit = invoices
    .filter((inv) => inv.status === "paid")
    .reduce(
      (acc, inv) => {
        const month = new Date(inv.paid_date || inv.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
        acc[month] = (acc[month] || 0) + Number.parseFloat(inv.total_amount || 0)
        return acc
      },
      {} as Record<string, number>,
    )

  expenses.forEach((exp) => {
    const month = new Date(exp.expense_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    monthlyProfit[month] = (monthlyProfit[month] || 0) - Number.parseFloat(exp.amount || 0)
  })

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
              <h1 className="text-3xl font-bold">Profit & Loss Breakdown</h1>
              <p className="text-muted-foreground mt-1">Comprehensive profit analysis and trends</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          </Card>

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
              <div className={`p-2 ${netProfit >= 0 ? "bg-blue-500/10" : "bg-red-500/10"} rounded-lg`}>
                <DollarSign className={`h-5 w-5 ${netProfit >= 0 ? "text-blue-500" : "text-red-500"}`} />
              </div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
            </div>
            <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-blue-600" : "text-red-600"}`}>
              ${netProfit.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <PieChart className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">{profitMargin.toFixed(1)}%</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Profit & Loss
          </h2>
          <div className="space-y-4">
            {Object.entries(monthlyProfit)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([month, profit]) => (
                <div key={month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{month}</span>
                    <span className={`text-lg font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {profit >= 0 ? "+" : ""}${profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${profit >= 0 ? "bg-green-500" : "bg-red-500"} h-2 rounded-full`}
                      style={{
                        width: `${Math.min((Math.abs(profit) / Math.max(...Object.values(monthlyProfit).map(Math.abs))) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
