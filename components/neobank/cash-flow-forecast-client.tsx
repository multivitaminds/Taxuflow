"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Download,
  RefreshCw,
  Target,
  Zap,
  Brain,
  ChevronRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ForecastData {
  month: string
  income: number
  expenses: number
  netCashFlow: number
  confidence: number
}

interface Insight {
  id: string
  type: "opportunity" | "warning" | "info"
  title: string
  description: string
  impact: string
  confidence: number
  actionable: boolean
}

const forecastData: ForecastData[] = [
  { month: "Jan 2025", income: 8500, expenses: 6200, netCashFlow: 2300, confidence: 95 },
  { month: "Feb 2025", income: 8500, expenses: 6400, netCashFlow: 2100, confidence: 92 },
  { month: "Mar 2025", income: 9200, expenses: 6500, netCashFlow: 2700, confidence: 88 },
  { month: "Apr 2025", income: 8800, expenses: 6800, netCashFlow: 2000, confidence: 85 },
  { month: "May 2025", income: 9500, expenses: 7000, netCashFlow: 2500, confidence: 80 },
  { month: "Jun 2025", income: 9500, expenses: 7200, netCashFlow: 2300, confidence: 75 },
]

const insights: Insight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Surplus Expected in March",
    description: "Your projected net cash flow in March will be $2,700, the highest in the next 6 months.",
    impact: "+$2,700",
    confidence: 88,
    actionable: true,
  },
  {
    id: "2",
    type: "warning",
    title: "Low Cash Flow in April",
    description: "April shows the lowest projected net cash flow at $2,000. Consider reducing discretionary spending.",
    impact: "$2,000",
    confidence: 85,
    actionable: true,
  },
  {
    id: "3",
    type: "opportunity",
    title: "Income Growth Trend",
    description: "Your income is projected to grow by 11.7% from January to May, reaching $9,500.",
    impact: "+11.7%",
    confidence: 82,
    actionable: false,
  },
  {
    id: "4",
    type: "warning",
    title: "Rising Expense Trend",
    description: "Expenses are forecasted to increase by 12.9% over the next 6 months. Monitor spending closely.",
    impact: "+12.9%",
    confidence: 78,
    actionable: true,
  },
]

const incomeBreakdown = [
  { category: "Salary", current: 7500, projected: 7800, change: 4.0 },
  { category: "Freelance", current: 800, projected: 1200, change: 50.0 },
  { category: "Investments", current: 200, projected: 500, change: 150.0 },
]

const expenseBreakdown = [
  { category: "Housing", current: 2200, projected: 2200, change: 0 },
  { category: "Transportation", current: 800, projected: 900, change: 12.5 },
  { category: "Food", current: 1200, projected: 1400, change: 16.7 },
  { category: "Utilities", current: 400, projected: 450, change: 12.5 },
  { category: "Entertainment", current: 600, projected: 750, change: 25.0 },
  { category: "Other", current: 1000, projected: 1300, change: 30.0 },
]

export function CashFlowForecastClient() {
  const [activeTab, setActiveTab] = useState("forecast")

  const avgNetFlow = forecastData.reduce((sum, item) => sum + item.netCashFlow, 0) / forecastData.length
  const totalIncome = forecastData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = forecastData.reduce((sum, item) => sum + item.expenses, 0)
  const avgConfidence = forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cash Flow Forecast</h1>
          <p className="text-slate-500 mt-1">AI-powered predictive analytics and income/expense projections</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              Avg Monthly Net Flow
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${avgNetFlow.toFixed(0)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </Badge>
              <span className="text-xs text-slate-500">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              Total Projected Income
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalIncome.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +11.7%
              </Badge>
              <span className="text-xs text-slate-500">6-month period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              Total Projected Expenses
              <TrendingDown className="h-4 w-4 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">${totalExpenses.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.9%
              </Badge>
              <span className="text-xs text-slate-500">6-month period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
              Forecast Confidence
              <Brain className="h-4 w-4 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{avgConfidence.toFixed(0)}%</div>
            <div className="mt-2">
              <Progress value={avgConfidence} className="h-2" />
            </div>
            <p className="text-xs text-slate-500 mt-2">High accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-100">
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                6-Month Cash Flow Forecast
              </CardTitle>
              <CardDescription>AI-powered predictions based on historical patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-slate-900">{item.month}</div>
                        <Badge variant="outline" className="text-xs">
                          {item.confidence}% confidence
                        </Badge>
                      </div>
                      <div
                        className={`text-lg font-bold ${item.netCashFlow >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        ${item.netCashFlow.toLocaleString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Income</div>
                        <div className="font-semibold text-emerald-600">${item.income.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Expenses</div>
                        <div className="font-semibold text-rose-600">${item.expenses.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Net Flow</div>
                        <div
                          className={`font-semibold ${item.netCashFlow >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {item.netCashFlow >= 0 ? "+" : ""}${item.netCashFlow.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={(item.netCashFlow / item.income) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                  Income Breakdown
                </CardTitle>
                <CardDescription>Current vs projected income by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {incomeBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-slate-900">{item.category}</div>
                      <Badge
                        variant="outline"
                        className={
                          item.change > 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-700"
                        }
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Current</div>
                        <div className="font-semibold text-slate-900">${item.current.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Projected</div>
                        <div className="font-semibold text-emerald-600">${item.projected.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownRight className="h-5 w-5 text-rose-600" />
                  Expense Breakdown
                </CardTitle>
                <CardDescription>Current vs projected expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-slate-900">{item.category}</div>
                      <Badge
                        variant="outline"
                        className={
                          item.change > 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-slate-50 text-slate-700"
                        }
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Current</div>
                        <div className="font-semibold text-slate-900">${item.current.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Projected</div>
                        <div className="font-semibold text-rose-600">${item.projected.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Intelligent recommendations based on your cash flow patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-l-4 hover:shadow-lg transition-all cursor-pointer ${
                    insight.type === "opportunity"
                      ? "border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white"
                      : insight.type === "warning"
                        ? "border-l-amber-500 bg-gradient-to-r from-amber-50 to-white"
                        : "border-l-blue-500 bg-gradient-to-r from-blue-50 to-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {insight.type === "opportunity" ? (
                        <Zap className="h-5 w-5 text-emerald-600" />
                      ) : insight.type === "warning" ? (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Target className="h-5 w-5 text-blue-600" />
                      )}
                      <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          insight.type === "opportunity"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : insight.type === "warning"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                        }
                      >
                        {insight.impact}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                  {insight.actionable && (
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      Take Action
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Scenario Planning
              </CardTitle>
              <CardDescription>Explore different financial scenarios and their impact on cash flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 rounded-lg border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">Best Case Scenario</h3>
                  <Badge className="bg-emerald-600">+$3,500/mo</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">15% income increase + 10% expense reduction</p>
                <div className="text-2xl font-bold text-emerald-600">$17,850</div>
                <p className="text-xs text-slate-500 mt-1">Total projected savings over 6 months</p>
              </div>

              <div className="p-6 rounded-lg border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">Expected Scenario</h3>
                  <Badge className="bg-blue-600">+$2,300/mo</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">Current trends continue as forecasted</p>
                <div className="text-2xl font-bold text-blue-600">$13,800</div>
                <p className="text-xs text-slate-500 mt-1">Total projected savings over 6 months</p>
              </div>

              <div className="p-6 rounded-lg border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">Worst Case Scenario</h3>
                  <Badge className="bg-amber-600">+$1,200/mo</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">10% income decrease + 15% expense increase</p>
                <div className="text-2xl font-bold text-amber-600">$7,200</div>
                <p className="text-xs text-slate-500 mt-1">Total projected savings over 6 months</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
