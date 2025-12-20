"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, AlertCircle, Download, Filter, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

const spendingData = [
  { month: "Jan", amount: 12500 },
  { month: "Feb", amount: 15000 },
  { month: "Mar", amount: 11000 },
  { month: "Apr", amount: 18500 },
  { month: "May", amount: 14000 },
  { month: "Jun", amount: 21000 },
]

const categoryData = [
  { name: "Software", value: 35, color: "#635bff" },
  { name: "Office", value: 20, color: "#00d4ff" },
  { name: "Travel", value: 15, color: "#32d74b" },
  { name: "Marketing", value: 20, color: "#ffcc00" },
  { name: "Other", value: 10, color: "#8f96a3" },
]

const recentTransactions = [
  { id: 1, merchant: "Vercel Inc.", amount: 20.0, date: "Jun 15", category: "Software", deductible: true },
  { id: 2, merchant: "Uber Rides", amount: 45.5, date: "Jun 14", category: "Travel", deductible: true },
  { id: 3, merchant: "Starbucks", amount: 12.4, date: "Jun 13", category: "Meals", deductible: false }, // AI flagged as likely personal
  { id: 4, merchant: "Adobe Creative Cloud", amount: 54.99, date: "Jun 12", category: "Software", deductible: true },
  { id: 5, merchant: "WeWork", amount: 450.0, date: "Jun 10", category: "Office", deductible: true },
]

export function SpendingAnalytics() {
  const [timeRange, setTimeRange] = useState("6m")

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spending Analytics</h1>
          <p className="text-slate-500 mt-1">Track your expenses and identify tax deductions automatically.</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white text-[#0a2540] border-slate-200">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Spending Trend */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Total expenses across all cards and accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635bff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#635bff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#888888" fontSize={12} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(val?: number) => [`$${(val ?? 0).toLocaleString()}`, "Spent"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#635bff"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Stats */}
        <Card className="bg-[#635bff] text-white border-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-200">Total Tax Deductions</CardDescription>
            <CardTitle className="text-3xl">$12,450.00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-green-100">+15% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription>Potential Savings</CardDescription>
            <CardTitle className="text-3xl text-[#0a2540]">$3,200.00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span>3 unverified deductions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription>Burn Rate</CardDescription>
            <CardTitle className="text-3xl text-[#0a2540]">
              $18.5k<span className="text-sm font-normal text-slate-400">/mo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span>2% lower than average</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List with Tax Toggles */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Verify auto-categorized tax deductions</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b text-xs font-medium text-slate-500 uppercase">
              <div className="col-span-5">Merchant</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-3 text-right">Tax Status</div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((txn) => (
                <div
                  key={txn.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Receipt className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#0a2540]">{txn.merchant}</p>
                      <p className="text-xs text-slate-500">{txn.date}</p>
                    </div>
                  </div>
                  <div className="col-span-2 font-medium">${txn.amount.toFixed(2)}</div>
                  <div className="col-span-2">
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal bg-slate-100 text-slate-600 hover:bg-slate-200"
                    >
                      {txn.category}
                    </Badge>
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <Badge
                      variant="outline"
                      className={cn(
                        "cursor-pointer transition-all",
                        txn.deductible
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100",
                      )}
                    >
                      {txn.deductible ? "Tax Deductible" : "Personal"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
