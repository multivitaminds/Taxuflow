"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Calendar, Filter, DollarSign } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"

const monthlyIncome = [
  { month: "Jan", revenue: 125000, recurring: 95000, oneTime: 30000 },
  { month: "Feb", revenue: 132000, recurring: 98000, oneTime: 34000 },
  { month: "Mar", revenue: 128000, recurring: 96000, oneTime: 32000 },
  { month: "Apr", revenue: 145000, recurring: 105000, oneTime: 40000 },
  { month: "May", revenue: 138000, recurring: 102000, oneTime: 36000 },
  { month: "Jun", revenue: 152000, recurring: 108000, oneTime: 44000 },
]

const revenueStreams = [
  { name: "Subscription Revenue", amount: 108000, percentage: 71, growth: 12.5 },
  { name: "Consulting Services", amount: 28000, percentage: 18, growth: 8.3 },
  { name: "One-time Projects", amount: 16000, percentage: 11, growth: -4.2 },
]

const topClients = [
  { name: "Acme Corporation", amount: 45000, invoices: 12, status: "paid" },
  { name: "TechStart Inc.", amount: 38000, invoices: 8, status: "paid" },
  { name: "Global Solutions", amount: 32000, invoices: 6, status: "partial" },
  { name: "Innovation Labs", amount: 24000, invoices: 4, status: "paid" },
  { name: "Future Systems", amount: 18000, invoices: 3, status: "pending" },
]

export function IncomeReport() {
  const [activeTab, setActiveTab] = useState("summary")

  const totalRevenue = monthlyIncome[monthlyIncome.length - 1].revenue
  const monthOverMonth = 10.1

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Income Report</h1>
            <p className="text-lg text-slate-600">Revenue streams and client analytics</p>
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
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Total Revenue</span>
              </div>
              <h2 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h2>
              <p className="text-xs opacity-80 mt-2">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Month over Month</p>
              <h2 className="text-3xl font-bold text-emerald-600">+{monthOverMonth}%</h2>
              <Badge className="mt-2 bg-emerald-100 text-emerald-700">Excellent growth</Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Recurring Revenue</p>
              <h2 className="text-3xl font-bold text-slate-900">$108K</h2>
              <p className="text-sm text-slate-600 mt-2">71% of total</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-2">Active Clients</p>
              <h2 className="text-3xl font-bold text-slate-900">42</h2>
              <Badge className="mt-2 bg-blue-100 text-blue-700">+5 this month</Badge>
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
                  {/* Revenue Trend */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyIncome}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `$${val / 1000}k`} />
                          <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                            formatter={(val: number) => [`$${val.toLocaleString()}`, "Revenue"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue Streams */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Revenue Streams</h3>
                    <div className="space-y-4">
                      {revenueStreams.map((stream, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-slate-900">{stream.name}</p>
                              <p className="text-sm text-slate-600">${stream.amount.toLocaleString()}</p>
                            </div>
                            <Badge
                              className={
                                stream.growth > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              }
                            >
                              {stream.growth > 0 ? "+" : ""}
                              {stream.growth}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                                style={{ width: `${stream.percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600 w-12 text-right">{stream.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Clients */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Clients by Revenue</h3>
                  <div className="space-y-3">
                    {topClients.map((client, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                            {client.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{client.name}</p>
                            <p className="text-sm text-slate-600">{client.invoices} invoices</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">${client.amount.toLocaleString()}</p>
                          <Badge
                            className={
                              client.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : client.status === "partial"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-blue-100 text-blue-700"
                            }
                          >
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Month</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Total Revenue</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Recurring</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">One-time</th>
                        <th className="text-right p-4 text-sm font-semibold text-slate-700">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthlyIncome.map((month, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-900">{month.month}</td>
                          <td className="p-4 text-right font-bold text-slate-900">${month.revenue.toLocaleString()}</td>
                          <td className="p-4 text-right text-slate-600">${month.recurring.toLocaleString()}</td>
                          <td className="p-4 text-right text-slate-600">${month.oneTime.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <Badge className="bg-emerald-100 text-emerald-700">
                              +{(Math.random() * 15 + 3).toFixed(1)}%
                            </Badge>
                          </td>
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
                        {revenueStreams.map((stream, streamIdx) => (
                          <div key={streamIdx} className="flex justify-between">
                            <span className="text-sm text-slate-600">{stream.name.split(" ")[0]}</span>
                            <span className="text-sm font-semibold text-slate-900">
                              {idx === 2 ? `+${stream.growth}%` : `$${stream.amount.toLocaleString()}`}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chart">
                <div className="space-y-6">
                  <div className="h-[350px]">
                    <h3 className="text-lg font-semibold mb-4">Recurring vs One-time Revenue</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyIncome}>
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" tickFormatter={(val) => `$${val / 1000}k`} />
                        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                        <Bar dataKey="recurring" fill="#10b981" radius={[8, 8, 0, 0]} name="Recurring" />
                        <Bar dataKey="oneTime" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="One-time" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
