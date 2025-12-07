"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Edit, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function BudgetDetailClient({ budgetId }: { budgetId: string }) {
  const budget = {
    id: budgetId,
    name: "Annual Operating Budget",
    period: "2024",
    startDate: "Jan 1, 2024",
    endDate: "Dec 31, 2024",
    status: "Active",
    totalBudgeted: 1250000,
    totalActual: 945000,
    totalVariance: 305000,
    categories: [
      {
        name: "Revenue",
        budgeted: 850000,
        actual: 895000,
        variance: 45000,
        percentUsed: 105.3,
        favorable: true,
        subcategories: [
          { name: "Product Sales", budgeted: 650000, actual: 685000, variance: 35000 },
          { name: "Service Revenue", budgeted: 150000, actual: 160000, variance: 10000 },
          { name: "Other Income", budgeted: 50000, actual: 50000, variance: 0 },
        ],
      },
      {
        name: "Cost of Goods Sold",
        budgeted: 425000,
        actual: 410000,
        variance: 15000,
        percentUsed: 96.5,
        favorable: true,
        subcategories: [
          { name: "Direct Materials", budgeted: 250000, actual: 235000, variance: 15000 },
          { name: "Direct Labor", budgeted: 125000, actual: 125000, variance: 0 },
          { name: "Manufacturing Overhead", budgeted: 50000, actual: 50000, variance: 0 },
        ],
      },
      {
        name: "Operating Expenses",
        budgeted: 275000,
        actual: 285000,
        variance: -10000,
        percentUsed: 103.6,
        favorable: false,
        subcategories: [
          { name: "Salaries & Wages", budgeted: 150000, actual: 155000, variance: -5000 },
          { name: "Rent & Utilities", budgeted: 60000, actual: 62000, variance: -2000 },
          { name: "Office Supplies", budgeted: 25000, actual: 23000, variance: 2000 },
          { name: "Insurance", budgeted: 40000, actual: 45000, variance: -5000 },
        ],
      },
      {
        name: "Marketing",
        budgeted: 125000,
        actual: 118000,
        variance: 7000,
        percentUsed: 94.4,
        favorable: true,
        subcategories: [
          { name: "Digital Advertising", budgeted: 60000, actual: 55000, variance: 5000 },
          { name: "Content Marketing", budgeted: 30000, actual: 28000, variance: 2000 },
          { name: "Events", budgeted: 35000, actual: 35000, variance: 0 },
        ],
      },
      {
        name: "Research & Development",
        budgeted: 150000,
        actual: 142000,
        variance: 8000,
        percentUsed: 94.7,
        favorable: true,
        subcategories: [
          { name: "Product Development", budgeted: 100000, actual: 95000, variance: 5000 },
          { name: "Testing & QA", budgeted: 30000, actual: 28000, variance: 2000 },
          { name: "Technology", budgeted: 20000, actual: 19000, variance: 1000 },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/accounting/budget">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Budgets
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-slate-900">{budget.name}</h1>
                <Badge className="bg-green-100 text-green-700">{budget.status}</Badge>
              </div>
              <p className="text-slate-600">
                {budget.startDate} - {budget.endDate}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Budget
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <p className="text-sm text-slate-600 mb-2">Total Budgeted</p>
            <p className="text-3xl font-bold text-slate-900">${budget.totalBudgeted.toLocaleString()}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-green-500">
            <p className="text-sm text-slate-600 mb-2">Total Actual</p>
            <p className="text-3xl font-bold text-slate-900">${budget.totalActual.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">
              {((budget.totalActual / budget.totalBudgeted) * 100).toFixed(1)}% of budget
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-purple-500">
            <p className="text-sm text-slate-600 mb-2">Variance</p>
            <p className="text-3xl font-bold text-green-600">${budget.totalVariance.toLocaleString()}</p>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Favorable</span>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Budget Summary</h2>
              <div className="space-y-6">
                {budget.categories.map((category, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{category.name}</h3>
                      <Badge className={category.favorable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {category.favorable ? (
                          <TrendingUp className="h-3 w-3 mr-1 inline" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1 inline" />
                        )}
                        {category.variance > 0 ? "+" : ""}${Math.abs(category.variance).toLocaleString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-slate-500">Budgeted</p>
                        <p className="font-semibold">${category.budgeted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Actual</p>
                        <p className="font-semibold">${category.actual.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Variance</p>
                        <p className={`font-semibold ${category.favorable ? "text-green-600" : "text-red-600"}`}>
                          ${Math.abs(category.variance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">% Used</p>
                        <p className="font-semibold">{category.percentUsed.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          category.favorable
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-red-500 to-rose-500"
                        }`}
                        style={{ width: `${Math.min(category.percentUsed, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Detailed Category Breakdown</h2>
              <div className="space-y-6">
                {budget.categories.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{category.name}</h3>
                    <div className="space-y-2 pl-4">
                      {category.subcategories.map((sub, subIdx) => (
                        <div key={subIdx} className="flex items-center justify-between py-2 border-b">
                          <span className="text-slate-700">{sub.name}</span>
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-slate-500">Budget: </span>
                              <span className="font-medium">${sub.budgeted.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Actual: </span>
                              <span className="font-medium">${sub.actual.toLocaleString()}</span>
                            </div>
                            <div>
                              <span
                                className={`font-semibold ${sub.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {sub.variance > 0 ? "+" : ""}${sub.variance.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Progress</h2>
              <div className="space-y-4">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month, idx) => {
                  const monthlyBudget = Math.floor(budget.totalBudgeted / 12)
                  const monthlyActual = Math.floor(budget.totalActual / 9) // 9 months of data
                  const variance = monthlyBudget - monthlyActual

                  return (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{month} 2024</h4>
                        <Badge className={variance >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {variance >= 0 ? "Under Budget" : "Over Budget"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Budgeted</p>
                          <p className="font-semibold">${monthlyBudget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Actual</p>
                          <p className="font-semibold">${monthlyActual.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Variance</p>
                          <p className={`font-semibold ${variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ${Math.abs(variance).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
