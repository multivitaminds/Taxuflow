"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, PieChart, Plus, Download, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function BudgetManagementClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Budgeting & Forecasting</h1>
              <p className="text-slate-600">Create budgets, track variance, and forecast financial performance</p>
            </div>
            <div className="flex gap-3">
              <Link href="/accounting/budget/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </Link>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {["2024", "2023", "2022"].map((year) => (
              <Button
                key={year}
                variant={selectedPeriod === year ? "default" : "outline"}
                onClick={() => setSelectedPeriod(year)}
                size="sm"
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Link href="/accounting/budget/overview">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">Annual</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">$1,250,000</div>
              <div className="text-sm text-slate-600 mb-2">Total Budget</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12% vs last year</span>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/budget/variance">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-8 w-8 text-green-600" />
                <Badge className="bg-green-100 text-green-700">Favorable</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">$45,200</div>
              <div className="text-sm text-slate-600 mb-2">Variance (YTD)</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>3.6% under budget</span>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/budget/forecast">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">Projected</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">$1,385,000</div>
              <div className="text-sm text-slate-600 mb-2">Year-End Forecast</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+10.8% projected growth</span>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/budget/scenarios">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
              <div className="flex items-center justify-between mb-2">
                <PieChart className="h-8 w-8 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">Active</Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">3</div>
              <div className="text-sm text-slate-600 mb-2">Scenarios</div>
              <div className="text-sm text-slate-500">Best, Base, Worst</div>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="budgets" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="budgets">Active Budgets</TabsTrigger>
            <TabsTrigger value="variance">Variance Analysis</TabsTrigger>
            <TabsTrigger value="forecast">Cash Flow Forecast</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="budgets">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Active Budgets</h2>
              <div className="space-y-4">
                {[
                  {
                    name: "Annual Operating Budget",
                    period: "2024",
                    budgeted: 1250000,
                    actual: 945000,
                    variance: 305000,
                    status: "On Track",
                  },
                  {
                    name: "Marketing Budget",
                    period: "Q4 2024",
                    budgeted: 125000,
                    actual: 118000,
                    variance: 7000,
                    status: "Under Budget",
                  },
                  {
                    name: "R&D Budget",
                    period: "2024",
                    budgeted: 450000,
                    actual: 385000,
                    variance: 65000,
                    status: "Under Budget",
                  },
                ].map((budget, idx) => (
                  <Link key={idx} href={`/accounting/budget/${idx + 1}`}>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900">{budget.name}</h3>
                            <Badge variant="outline">{budget.period}</Badge>
                            <Badge
                              className={
                                budget.status === "On Track"
                                  ? "bg-green-100 text-green-700"
                                  : budget.status === "Under Budget"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                              }
                            >
                              {budget.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">Budgeted</p>
                              <p className="font-semibold">${budget.budgeted.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Actual</p>
                              <p className="font-semibold">${budget.actual.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Variance</p>
                              <p className="font-semibold text-green-600">${budget.variance.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">% Used</p>
                              <p className="font-semibold">{((budget.actual / budget.budgeted) * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full"
                              style={{ width: `${(budget.actual / budget.budgeted) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="variance">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Variance Analysis by Category</h2>
              <div className="space-y-4">
                {[
                  { category: "Revenue", budgeted: 850000, actual: 895000, variance: 45000, favorable: true },
                  {
                    category: "Cost of Goods Sold",
                    budgeted: 425000,
                    actual: 410000,
                    variance: 15000,
                    favorable: true,
                  },
                  {
                    category: "Operating Expenses",
                    budgeted: 275000,
                    actual: 285000,
                    variance: -10000,
                    favorable: false,
                  },
                  { category: "Marketing", budgeted: 125000, actual: 118000, variance: 7000, favorable: true },
                  { category: "R&D", budgeted: 150000, actual: 142000, variance: 8000, favorable: true },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{item.category}</h3>
                      <Badge className={item.favorable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {item.favorable ? "Favorable" : "Unfavorable"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Budgeted</p>
                        <p className="font-semibold">${item.budgeted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Actual</p>
                        <p className="font-semibold">${item.actual.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Variance</p>
                        <p className={`font-semibold ${item.favorable ? "text-green-600" : "text-red-600"}`}>
                          {item.variance > 0 ? "+" : ""}
                          {item.variance.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">% Variance</p>
                        <p className={`font-semibold ${item.favorable ? "text-green-600" : "text-red-600"}`}>
                          {((item.variance / item.budgeted) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">12-Month Cash Flow Forecast</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <p className="text-sm text-green-700 mb-1">Projected Cash Inflows</p>
                    <p className="text-2xl font-bold text-green-900">$1,450,000</p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                    <p className="text-sm text-red-700 mb-1">Projected Cash Outflows</p>
                    <p className="text-2xl font-bold text-red-900">$1,165,000</p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <p className="text-sm text-blue-700 mb-1">Net Cash Flow</p>
                    <p className="text-2xl font-bold text-blue-900">$285,000</p>
                  </Card>
                </div>

                <div className="space-y-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-slate-600">{month}</div>
                      <div className="flex-1 flex gap-2">
                        <div className="flex-1 bg-green-100 rounded-full h-8 flex items-center justify-end px-3">
                          <span className="text-sm font-medium text-green-800">
                            ${(120000 + idx * 2000).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex-1 bg-red-100 rounded-full h-8 flex items-center justify-end px-3">
                          <span className="text-sm font-medium text-red-800">
                            ${(95000 + idx * 1500).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Scenario Planning</h2>
              <div className="grid gap-4">
                {[
                  {
                    name: "Best Case Scenario",
                    revenue: 1850000,
                    expenses: 1250000,
                    profit: 600000,
                    probability: "20%",
                    color: "green",
                  },
                  {
                    name: "Base Case Scenario",
                    revenue: 1450000,
                    expenses: 1165000,
                    profit: 285000,
                    probability: "60%",
                    color: "blue",
                  },
                  {
                    name: "Worst Case Scenario",
                    revenue: 1150000,
                    expenses: 1050000,
                    profit: 100000,
                    probability: "20%",
                    color: "red",
                  },
                ].map((scenario, idx) => (
                  <Card key={idx} className={`p-6 border-l-4 border-l-${scenario.color}-500`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{scenario.name}</h3>
                      <Badge className={`bg-${scenario.color}-100 text-${scenario.color}-700`}>
                        {scenario.probability} Probability
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Revenue</p>
                        <p className="text-xl font-bold text-slate-900">${scenario.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Expenses</p>
                        <p className="text-xl font-bold text-slate-900">${scenario.expenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Net Profit</p>
                        <p className={`text-xl font-bold text-${scenario.color}-600`}>
                          ${scenario.profit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
