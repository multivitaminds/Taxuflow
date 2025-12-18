"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  PieChart,
  BarChart3,
  LineChart,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ReportsHub() {
  const [activeView, setActiveView] = useState("summary")

  // Mock data - replace with actual data from your backend
  const reportCategories = [
    {
      id: "spending",
      title: "Spending Analysis",
      icon: PieChart,
      color: "bg-blue-500",
      value: "$48,234",
      change: "+12.5%",
      trend: "up",
      description: "Total spending this month",
    },
    {
      id: "income",
      title: "Income Report",
      icon: TrendingUp,
      color: "bg-green-500",
      value: "$125,480",
      change: "+8.3%",
      trend: "up",
      description: "Revenue generated",
    },
    {
      id: "cashflow",
      title: "Cash Flow",
      icon: BarChart3,
      color: "bg-purple-500",
      value: "$77,246",
      change: "-3.2%",
      trend: "down",
      description: "Net cash flow",
    },
    {
      id: "transactions",
      title: "Transaction Volume",
      icon: LineChart,
      color: "bg-orange-500",
      value: "1,247",
      change: "+18.7%",
      trend: "up",
      description: "Total transactions",
    },
  ]

  const monthlyData = [
    { month: "Jan", spending: 42000, income: 115000, savings: 73000 },
    { month: "Feb", spending: 38000, income: 108000, savings: 70000 },
    { month: "Mar", spending: 45000, income: 122000, savings: 77000 },
    { month: "Apr", spending: 48000, income: 125000, savings: 77000 },
  ]

  const topCategories = [
    { name: "Business Services", amount: 12450, percentage: 25.8, color: "bg-blue-500" },
    { name: "Rent & Utilities", amount: 8900, percentage: 18.4, color: "bg-purple-500" },
    { name: "Marketing", amount: 7200, percentage: 14.9, color: "bg-green-500" },
    { name: "Payroll", amount: 6800, percentage: 14.1, color: "bg-orange-500" },
    { name: "Other", amount: 12884, percentage: 26.8, color: "bg-slate-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Reports & Analytics</h1>
            <p className="text-lg text-slate-600">Comprehensive financial insights and analysis</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" className="bg-white">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Link href="/neobank/reports/custom">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Custom Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportCategories.map((category) => (
            <Link key={category.id} href={`/neobank/reports/${category.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-lg", category.color)}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "flex items-center gap-1",
                        category.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
                      )}
                    >
                      {category.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {category.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-slate-600 mb-1">{category.title}</h3>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{category.value}</p>
                  <p className="text-xs text-slate-500">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Report Tabs */}
        <Card className="border-slate-200 shadow-lg bg-white">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900">Financial Overview</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
              <TabsList className="bg-slate-100 p-1 rounded-lg">
                <TabsTrigger value="summary" className="data-[state=active]:bg-white">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="detailed" className="data-[state=active]:bg-white">
                  Detailed
                </TabsTrigger>
                <TabsTrigger value="compare" className="data-[state=active]:bg-white">
                  Compare
                </TabsTrigger>
                <TabsTrigger value="chart" className="data-[state=active]:bg-white">
                  Charts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                {/* Summary View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {monthlyData.map((data, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{data.month}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-red-600">-${(data.spending / 1000).toFixed(1)}k</span>
                              <span className="text-sm text-green-600">+${(data.income / 1000).toFixed(1)}k</span>
                              <span className="text-sm font-semibold text-slate-900">
                                ${(data.savings / 1000).toFixed(1)}k
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Top Spending Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topCategories.map((cat, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-700">{cat.name}</span>
                              <span className="text-slate-900 font-semibold">${cat.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all", cat.color)}
                                  style={{ width: `${cat.percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-600 w-12 text-right">{cat.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                {/* Detailed View */}
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Category</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Description</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Amount</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { date: "Apr 15", category: "Marketing", desc: "Facebook Ads", amount: -1200, balance: 77246 },
                        { date: "Apr 14", category: "Income", desc: "Client Payment", amount: 5000, balance: 78446 },
                        { date: "Apr 13", category: "Utilities", desc: "Office Rent", amount: -2800, balance: 73446 },
                        { date: "Apr 12", category: "Payroll", desc: "Staff Salaries", amount: -6800, balance: 76246 },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-sm text-slate-600">{row.date}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="text-xs">
                              {row.category}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-slate-700">{row.desc}</td>
                          <td
                            className={cn(
                              "p-4 text-sm font-medium text-right",
                              row.amount > 0 ? "text-green-600" : "text-slate-900",
                            )}
                          >
                            {row.amount > 0 ? "+" : ""}${Math.abs(row.amount).toLocaleString()}
                          </td>
                          <td className="p-4 text-sm font-semibold text-right text-slate-900">
                            ${row.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="compare" className="space-y-4">
                {/* Compare View */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["This Month", "Last Month", "Change"].map((period, idx) => (
                    <Card key={idx} className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-700">{period}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Income</span>
                          <span className="text-sm font-semibold text-green-600">
                            {idx === 2 ? "+8.3%" : `$${(125 - idx * 10).toFixed(1)}k`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Expenses</span>
                          <span className="text-sm font-semibold text-red-600">
                            {idx === 2 ? "+12.5%" : `$${(48 + idx * 6).toFixed(1)}k`}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="text-sm font-medium text-slate-700">Net</span>
                          <span className="text-sm font-bold text-slate-900">
                            {idx === 2 ? "+5.2%" : `$${(77 - idx * 4).toFixed(1)}k`}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                {/* Chart View Placeholder */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-12 text-center">
                  <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium mb-2">Interactive Charts Coming Soon</p>
                  <p className="text-sm text-slate-500">Visualize your financial data with dynamic charts and graphs</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/neobank/reports/custom">
            <Card className="group hover:shadow-lg transition-all cursor-pointer border-slate-200 bg-white">
              <CardContent className="p-6">
                <FileText className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-2">Custom Report Builder</h3>
                <p className="text-sm text-slate-600">Create tailored reports with custom metrics</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/neobank/insights">
            <Card className="group hover:shadow-lg transition-all cursor-pointer border-slate-200 bg-white">
              <CardContent className="p-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-2">Business Insights</h3>
                <p className="text-sm text-slate-600">AI-powered financial intelligence</p>
              </CardContent>
            </Card>
          </Link>

          <Button variant="outline" className="h-auto p-6 flex-col items-start hover:bg-slate-50 bg-transparent">
            <Download className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Export Center</h3>
            <p className="text-sm text-slate-600 text-left">Download reports in multiple formats</p>
          </Button>
        </div>
      </div>
    </div>
  )
}
