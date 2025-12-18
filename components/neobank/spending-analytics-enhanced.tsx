"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Line,
  Legend,
} from "recharts"
import {
  TrendingUp,
  AlertCircle,
  Receipt,
  Sparkles,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Declare categoryData variable
const categoryData = [
  { name: "Marketing", value: 45, color: "#FF6347" },
  { name: "Technology", value: 30, color: "#4682B4" },
  { name: "Operations", value: 15, color: "#228B22" },
  { name: "Miscellaneous", value: 10, color: "#FFD700" },
]

const spendingTrendData = [
  { month: "Jan", amount: 12500, budget: 15000 },
  { month: "Feb", amount: 15000, budget: 15000 },
  { month: "Mar", amount: 11000, budget: 15000 },
  { month: "Apr", amount: 18500, budget: 15000 },
  { month: "May", amount: 14000, budget: 15000 },
  { month: "Jun", amount: 21000, budget: 15000 },
]

const yearOverYearData = [
  { month: "Jan", current: 12500, previous: 11200 },
  { month: "Feb", current: 15000, previous: 13800 },
  { month: "Mar", current: 11000, previous: 12500 },
  { month: "Apr", current: 18500, previous: 16000 },
  { month: "May", current: 14000, previous: 13200 },
  { month: "Jun", current: 21000, previous: 18500 },
]

const topMerchantsData = [
  { name: "Adobe Creative Cloud", amount: 654, transactions: 12, trend: "+5%" },
  { name: "AWS Services", amount: 1240, transactions: 8, trend: "+12%" },
  { name: "WeWork Office Space", amount: 2700, transactions: 6, trend: "0%" },
  { name: "Google Workspace", amount: 420, transactions: 12, trend: "-3%" },
  { name: "Slack Premium", amount: 360, transactions: 12, trend: "0%" },
]

const recurringExpenses = [
  { name: "Software Subscriptions", amount: 2340, frequency: "Monthly", nextDate: "Jul 1" },
  { name: "Office Rent", amount: 2700, frequency: "Monthly", nextDate: "Jul 1" },
  { name: "Insurance Premium", amount: 850, frequency: "Monthly", nextDate: "Jul 5" },
  { name: "Cloud Services", amount: 1240, frequency: "Monthly", nextDate: "Jul 10" },
]

const taxDeductibleTransactions = [
  {
    id: 1,
    merchant: "Adobe Creative Cloud",
    amount: 54.99,
    date: "Jun 15",
    category: "Software",
    verified: true,
    savedAmount: 16.5,
  },
  {
    id: 2,
    merchant: "Uber for Business",
    amount: 45.5,
    date: "Jun 14",
    category: "Travel",
    verified: true,
    savedAmount: 13.65,
  },
  { id: 3, merchant: "WeWork", amount: 450.0, date: "Jun 10", category: "Office", verified: true, savedAmount: 135.0 },
  { id: 4, merchant: "Starbucks", amount: 12.4, date: "Jun 13", category: "Meals", verified: false, savedAmount: 0 },
  {
    id: 5,
    merchant: "AWS Services",
    amount: 124.0,
    date: "Jun 12",
    category: "Software",
    verified: true,
    savedAmount: 37.2,
  },
]

export function SpendingAnalyticsEnhanced() {
  const [timeRange, setTimeRange] = useState("6m")
  const [activeTab, setActiveTab] = useState("overview")
  const [comparisonPeriod, setComparisonPeriod] = useState("yoy")

  const aiInsights = [
    {
      id: 1,
      type: "opportunity",
      title: "Switch to Annual Billing",
      description: "Save $240/year by switching Adobe to annual billing",
      impact: "$240",
      confidence: 95,
      action: "Review",
    },
    {
      id: 2,
      type: "warning",
      title: "Unusual Spending Pattern",
      description: "Marketing spend is 45% higher than usual this month",
      impact: "+$850",
      confidence: 88,
      action: "Investigate",
    },
    {
      id: 3,
      type: "info",
      title: "Tax Deduction Opportunity",
      description: "3 unverified transactions may qualify as business expenses",
      impact: "$420",
      confidence: 92,
      action: "Verify",
    },
  ]

  const totalVerifiedDeductions = taxDeductibleTransactions
    .filter((t) => t.verified)
    .reduce((sum, t) => sum + t.savedAmount, 0)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Spending Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">AI-powered insights and tax optimization for your spending</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-8 text-xs bg-transparent">
            Export Report
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white h-8 text-xs">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[700px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-[#635bff] to-[#8f8bf5] text-white border-none cursor-pointer hover:scale-105 transition-transform">
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-200 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Spending
                </CardDescription>
                <CardTitle className="text-3xl">$21,450</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUpRight className="h-4 w-4 text-green-300" />
                  <span className="text-green-100">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 cursor-pointer hover:shadow-lg transition-all hover:border-green-300">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Tax Deductions
                </CardDescription>
                <CardTitle className="text-3xl text-[#0a2540]">$12,450</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+15% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 cursor-pointer hover:shadow-lg transition-all hover:border-blue-300">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Burn Rate
                </CardDescription>
                <CardTitle className="text-3xl text-[#0a2540]">
                  $18.5k<span className="text-sm font-normal text-slate-400">/mo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                  <span>2% lower than average</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 cursor-pointer hover:shadow-lg transition-all hover:border-orange-300">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Potential Savings
                </CardDescription>
                <CardTitle className="text-3xl text-[#0a2540]">$3,200</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-orange-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>3 opportunities found</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>Monthly spending vs budget over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendingTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                        formatter={(val: number) => [`$${val.toLocaleString()}`, "Amount"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#635bff"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                      <Line
                        type="monotone"
                        dataKey="budget"
                        stroke="#ff6b6b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Top Merchants</CardTitle>
                <CardDescription>Highest spending by vendor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topMerchantsData.slice(0, 5).map((merchant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{merchant.name}</p>
                        <p className="text-xs text-slate-500">{merchant.transactions} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${merchant.amount}</p>
                        <Badge
                          variant="secondary"
                          className={cn("text-xs", merchant.trend.startsWith("+") ? "text-red-600" : "text-green-600")}
                        >
                          {merchant.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recurring Expenses</CardTitle>
                  <CardDescription>Upcoming automatic payments</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  ${recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}/mo
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recurringExpenses.map((expense, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-[#635bff] hover:shadow-md transition-all cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{expense.name}</p>
                      <p className="text-sm text-slate-500">
                        {expense.frequency} • Next: {expense.nextDate}
                      </p>
                    </div>
                    <p className="font-bold text-lg">${expense.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Last 6 months breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="font-bold">{category.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${category.value}%`, backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Visual breakdown of spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {aiInsights.map((insight) => (
              <Card
                key={insight.id}
                className={cn(
                  "border-l-4 hover:shadow-lg transition-all cursor-pointer",
                  insight.type === "opportunity" && "border-l-green-500 bg-green-50/50",
                  insight.type === "warning" && "border-l-orange-500 bg-orange-50/50",
                  insight.type === "info" && "border-l-blue-500 bg-blue-50/50",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-5 w-5 text-[#635bff]" />
                        <h3 className="font-bold text-lg text-[#0a2540]">{insight.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{insight.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600">{insight.impact}</span>
                        </div>
                        <Button size="sm" className="bg-[#635bff] hover:bg-[#4f46e5]">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0a2540]">Tax Savings This Month</h3>
                  <p className="text-slate-600">Based on verified business expenses</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">${totalVerifiedDeductions.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">Estimated tax savings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tax Deductible Transactions</CardTitle>
                <CardDescription>Verify AI-categorized business expenses</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200">
                <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b text-xs font-medium text-slate-500 uppercase">
                  <div className="col-span-4">Merchant</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Tax Saved</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {taxDeductibleTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors"
                    >
                      <div className="col-span-4 flex items-center gap-3">
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
                      <div className="col-span-2 font-bold text-green-600">${txn.savedAmount.toFixed(2)}</div>
                      <div className="col-span-2 flex justify-end">
                        <Badge
                          variant="outline"
                          className={cn(
                            "cursor-pointer transition-all",
                            txn.verified
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
                          )}
                        >
                          {txn.verified ? "Verified" : "Needs Review"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Period Comparison</h2>
              <p className="text-slate-500">Analyze spending trends over time</p>
            </div>
            <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Compare to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yoy">Year over Year</SelectItem>
                <SelectItem value="mom">Month over Month</SelectItem>
                <SelectItem value="qoq">Quarter over Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Spending Comparison</CardTitle>
              <CardDescription>Current period vs previous period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearOverYearData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      formatter={(val: number) => [`$${val.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="current" fill="#635bff" name="This Year" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="previous" fill="#cbd5e1" name="Last Year" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardDescription>Average Increase</CardDescription>
                <CardTitle className="text-3xl text-[#0a2540]">+14.2%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">Compared to previous period</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardDescription>Highest Growth</CardDescription>
                <CardTitle className="text-3xl text-[#0a2540]">Software</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">+28% increase in spending</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardDescription>Biggest Savings</CardDescription>
                <CardTitle className="text-3xl text-[#0a2540]">Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">-18% decrease in costs</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
