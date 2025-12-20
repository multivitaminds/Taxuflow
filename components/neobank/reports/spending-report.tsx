"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, TrendingDown, Calendar, Filter, Share2 } from "lucide-react"
import {
  Pie,
  PieChart as RePieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"

const categoryData = [
  { name: "Software & SaaS", value: 8450, color: "#3b82f6", percentage: 35 },
  { name: "Office & Rent", value: 5280, color: "#8b5cf6", percentage: 22 },
  { name: "Marketing", value: 3620, color: "#10b981", percentage: 15 },
  { name: "Travel", value: 2890, color: "#f59e0b", percentage: 12 },
  { name: "Meals & Entertainment", value: 2170, color: "#ef4444", percentage: 9 },
  { name: "Other", value: 1690, color: "#6b7280", percentage: 7 },
]

const monthlyTrend = [
  { month: "Jan", amount: 21450 },
  { month: "Feb", amount: 19280 },
  { month: "Mar", amount: 24120 },
  { month: "Apr", amount: 24100 },
  { month: "May", amount: 22680 },
  { month: "Jun", amount: 24100 },
]

const topMerchants = [
  { name: "Vercel Inc.", category: "Software", amount: 2400, txCount: 12 },
  { name: "AWS Services", category: "Cloud Infrastructure", amount: 1850, txCount: 1 },
  { name: "Adobe Creative Cloud", category: "Software", amount: 1299, txCount: 1 },
  { name: "Google Workspace", category: "Software", amount: 840, txCount: 1 },
  { name: "WeWork", category: "Office", amount: 3200, txCount: 1 },
]

export function SpendingReport() {
  const [timeRange, setTimeRange] = useState("last-30-days")
  const [activeTab, setActiveTab] = useState("summary")

  const totalSpending = categoryData.reduce((sum, cat) => sum + cat.value, 0)

  const handleExportPDF = () => {
    console.log("[v0] Exporting spending report as PDF...")
    // TODO: Implement PDF generation
  }

  const handleExportExcel = () => {
    console.log("[v0] Exporting spending report as Excel...")
    // TODO: Implement Excel export
  }

  const handleExportCSV = () => {
    console.log("[v0] Exporting spending report as CSV...")
    // TODO: Implement CSV export
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Spending Report</h1>
            <p className="text-lg text-slate-600">Track and analyze your business expenses</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Calendar className="h-4 w-4 mr-2" />
              {timeRange === "last-30-days" ? "Last 30 Days" : "Custom Range"}
            </Button>
            <Button variant="outline" className="bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="bg-white" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Total Spending</span>
              </div>
              <h2 className="text-3xl font-bold">${totalSpending.toLocaleString()}</h2>
              <p className="text-xs opacity-80 mt-2">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Average Daily</p>
              <h2 className="text-3xl font-bold text-slate-900">${(totalSpending / 30).toFixed(0)}</h2>
              <Badge className="mt-2 bg-red-100 text-red-700">-12% vs last month</Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Top Category</p>
              <h2 className="text-2xl font-bold text-slate-900">Software</h2>
              <p className="text-sm text-slate-600 mt-2">${categoryData[0].value.toLocaleString()} (35%)</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Transactions</p>
              <h2 className="text-3xl font-bold text-slate-900">247</h2>
              <Badge className="mt-2 bg-blue-100 text-blue-700">+8% vs last month</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Report Tabs */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-100 mb-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
                <TabsTrigger value="chart">Charts</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percentage }) => `${name} (${percentage}%)`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Trend */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyTrend}>
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `$${val / 1000}k`} />
                          <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                            formatter={(val: number) => [`$${val.toLocaleString()}`, "Spending"]}
                          />
                          <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Merchants */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Merchants</h3>
                  <div className="space-y-3">
                    {topMerchants.map((merchant, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {merchant.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{merchant.name}</p>
                            <p className="text-sm text-slate-600">
                              {merchant.category} • {merchant.txCount} transactions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">${merchant.amount.toLocaleString()}</p>
                          <Badge variant="secondary" className="text-xs">
                            {((merchant.amount / totalSpending) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Category</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Amount</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">% of Total</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Transactions</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Avg per Transaction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {categoryData.map((cat, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                              <span className="font-medium text-slate-900">{cat.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right font-bold text-slate-900">${cat.value.toLocaleString()}</td>
                          <td className="p-4 text-right text-slate-600">{cat.percentage}%</td>
                          <td className="p-4 text-right text-slate-600">{Math.floor(Math.random() * 50) + 10}</td>
                          <td className="p-4 text-right text-slate-600">
                            ${(cat.value / (Math.floor(Math.random() * 50) + 10)).toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="compare" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["This Month", "Last Month", "Change"].map((period, idx) => (
                    <Card key={idx} className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-700">{period}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categoryData.slice(0, 3).map((cat, catIdx) => (
                          <div key={catIdx} className="flex justify-between">
                            <span className="text-sm text-slate-600">{cat.name}</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {idx === 2
                                ? `${(Math.random() * 20 - 10).toFixed(1)}%`
                                : `$${(cat.value + (idx === 1 ? -1000 : 0)).toLocaleString()}`}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chart" className="space-y-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(val) => `$${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                        formatter={(val: number) => [`$${val.toLocaleString()}`, "Spending"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="bg-white border-slate-200 shadow">
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700">
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button
                onClick={handleExportExcel}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
