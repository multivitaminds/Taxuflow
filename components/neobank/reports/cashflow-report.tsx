"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Activity, Calendar, Filter, TrendingUp, TrendingDown } from "lucide-react"
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

const cashflowData = [
  { month: "Jan", inflow: 125000, outflow: 98000, net: 27000, balance: 127000 },
  { month: "Feb", inflow: 132000, outflow: 105000, net: 27000, balance: 154000 },
  { month: "Mar", inflow: 128000, outflow: 112000, net: 16000, balance: 170000 },
  { month: "Apr", inflow: 145000, outflow: 108000, net: 37000, balance: 207000 },
  { month: "May", inflow: 138000, outflow: 115000, net: 23000, balance: 230000 },
  { month: "Jun", inflow: 152000, outflow: 118000, net: 34000, balance: 264000 },
]

const categories = [
  { name: "Operating Activities", inflow: 152000, outflow: 85000, net: 67000, color: "#3b82f6" },
  { name: "Investing Activities", inflow: 0, outflow: 18000, net: -18000, color: "#8b5cf6" },
  { name: "Financing Activities", inflow: 0, outflow: 15000, net: -15000, color: "#ef4444" },
]

export function CashflowReport() {
  const [activeTab, setActiveTab] = useState("summary")

  const currentBalance = cashflowData[cashflowData.length - 1].balance
  const netCashflow = cashflowData[cashflowData.length - 1].net
  const totalInflow = cashflowData.reduce((sum, m) => sum + m.inflow, 0)
  const totalOutflow = cashflowData.reduce((sum, m) => sum + m.outflow, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Cash Flow Report</h1>
            <p className="text-lg text-slate-600">Track inflows, outflows, and net cash position</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Calendar className="h-4 w-4 mr-2" />
              Last 6 Months
            </Button>
            <Button variant="outline" className="bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Current Balance</span>
              </div>
              <h2 className="text-3xl font-bold">${currentBalance.toLocaleString()}</h2>
              <p className="text-xs opacity-80 mt-2">As of today</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Net Cashflow</p>
              <h2 className="text-3xl font-bold text-emerald-600">+${netCashflow.toLocaleString()}</h2>
              <Badge className="mt-2 bg-emerald-100 text-emerald-700">This month</Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <p className="text-sm text-slate-600">Total Inflow</p>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">${totalInflow.toLocaleString()}</h2>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <p className="text-sm text-slate-600">Total Outflow</p>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">${totalOutflow.toLocaleString()}</h2>
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
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis</h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={cashflowData}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `$${val / 1000}k`} />
                        <Tooltip
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "white" }}
                          formatter={(val: number) => [`$${val.toLocaleString()}`, ""]}
                        />
                        <Legend />
                        <Bar dataKey="inflow" fill="#10b981" radius={[8, 8, 0, 0]} name="Inflow" />
                        <Bar dataKey="outflow" fill="#ef4444" radius={[8, 8, 0, 0]} name="Outflow" />
                        <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} name="Balance" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Net Cashflow</h3>
                    <div className="space-y-3">
                      {cashflowData.map((month, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-semibold text-slate-900">{month.month}</p>
                            <p className="text-sm text-slate-600">
                              In: ${month.inflow.toLocaleString()} | Out: ${month.outflow.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${month.net > 0 ? "text-emerald-600" : "text-red-600"}`}>
                              {month.net > 0 ? "+" : ""}${month.net.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-600">Balance: ${month.balance.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">By Category</h3>
                    <div className="space-y-4">
                      {categories.map((cat, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-slate-900">{cat.name}</p>
                            <Badge
                              className={cat.net > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}
                            >
                              {cat.net > 0 ? "+" : ""}${cat.net.toLocaleString()}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div>
                              <p className="text-slate-600">Inflow</p>
                              <p className="font-semibold text-emerald-600">${cat.inflow.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-600">Outflow</p>
                              <p className="font-semibold text-red-600">${cat.outflow.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Month</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Inflow</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Outflow</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Net</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {cashflowData.map((month, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-900">{month.month}</td>
                          <td className="p-4 text-right text-emerald-600 font-semibold">
                            +${month.inflow.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-red-600 font-semibold">
                            -${month.outflow.toLocaleString()}
                          </td>
                          <td className="p-4 text-right font-bold text-slate-900">
                            {month.net > 0 ? "+" : ""}${month.net.toLocaleString()}
                          </td>
                          <td className="p-4 text-right font-bold text-blue-600">${month.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="compare">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["This Month", "Last Month", "Change"].map((period, idx) => (
                    <Card key={idx} className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-base text-slate-700">{period}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {categories.map((cat, catIdx) => (
                          <div key={catIdx} className="flex justify-between">
                            <span className="text-sm text-slate-600">{cat.name.split(" ")[0]}</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {idx === 2 ? `${(Math.random() * 20 - 10).toFixed(1)}%` : `$${cat.net.toLocaleString()}`}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chart">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cashflowData}>
                      <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(val) => `$${val / 1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#balanceGradient)"
                        name="Balance"
                      />
                      <Line type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} name="Net Cashflow" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
