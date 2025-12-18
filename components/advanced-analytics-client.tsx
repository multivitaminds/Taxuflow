"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"

export function AdvancedAnalyticsClient() {
  const [dateRange, setDateRange] = useState("30d")

  const kpis = [
    {
      title: "Total Revenue",
      value: "$524,892",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Net Profit",
      value: "$187,234",
      change: "+18.2%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Customers",
      value: "1,247",
      change: "+12.8%",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg Order Value",
      value: "$421",
      change: "-5.3%",
      trend: "down",
      icon: ShoppingCart,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const revenueByCategory = [
    { category: "Products", amount: 285420, percentage: 54.4 },
    { category: "Services", amount: 156890, percentage: 29.9 },
    { category: "Consulting", amount: 82582, percentage: 15.7 },
  ]

  const topCustomers = [
    { name: "Acme Corporation", revenue: 45820, trend: "up", change: "+15%" },
    { name: "TechStart Inc", revenue: 38540, trend: "up", change: "+8%" },
    { name: "Global Solutions", revenue: 32180, trend: "down", change: "-3%" },
    { name: "Innovation Labs", revenue: 28920, trend: "up", change: "+22%" },
    { name: "Digital Ventures", revenue: 24560, trend: "up", change: "+11%" },
  ]

  const expenseBreakdown = [
    { category: "Salaries", amount: 185000, percentage: 42.5, color: "bg-blue-500" },
    { category: "Operations", amount: 98500, percentage: 22.6, color: "bg-green-500" },
    { category: "Marketing", amount: 76200, percentage: 17.5, color: "bg-purple-500" },
    { category: "Technology", amount: 54800, percentage: 12.6, color: "bg-orange-500" },
    { category: "Other", amount: 21000, percentage: 4.8, color: "bg-gray-500" },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time business intelligence and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              {kpi.trend === "up" ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {kpi.change} from last period
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Chart visualization will appear here</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="p-6">
            <p className="text-muted-foreground">Revenue analytics coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card className="p-6">
            <p className="text-muted-foreground">Expense analytics coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/accounting/reports/profit-loss">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="font-semibold">Profit & Loss</p>
            <p className="text-sm text-muted-foreground mt-1">View detailed P&L statement</p>
          </Card>
        </Link>

        <Link href="/accounting/reports/balance-sheet">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="font-semibold">Balance Sheet</p>
            <p className="text-sm text-muted-foreground mt-1">Assets & liabilities overview</p>
          </Card>
        </Link>

        <Link href="/accounting/reports/cash-flow">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <p className="font-semibold">Cash Flow</p>
            <p className="text-sm text-muted-foreground mt-1">Cash movement analysis</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
