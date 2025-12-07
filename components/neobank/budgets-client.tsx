"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Zap,
  Heart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export function BudgetsClient() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const overallStats = {
    totalBudget: 8500,
    totalSpent: 6234,
    remaining: 2266,
    percentUsed: 73,
  }

  const budgets = [
    {
      id: 1,
      category: "Groceries",
      icon: ShoppingCart,
      budget: 800,
      spent: 645,
      color: "emerald",
      trend: "+5%",
      transactions: 23,
    },
    {
      id: 2,
      category: "Housing",
      icon: Home,
      budget: 2500,
      spent: 2500,
      color: "blue",
      trend: "0%",
      transactions: 1,
    },
    {
      id: 3,
      category: "Transportation",
      icon: Car,
      budget: 600,
      spent: 523,
      color: "purple",
      trend: "+12%",
      transactions: 18,
    },
    {
      id: 4,
      category: "Dining",
      icon: Utensils,
      budget: 500,
      spent: 612,
      color: "orange",
      trend: "+22%",
      transactions: 31,
      over: true,
    },
    {
      id: 5,
      category: "Utilities",
      icon: Zap,
      budget: 300,
      spent: 287,
      color: "yellow",
      trend: "-4%",
      transactions: 5,
    },
    {
      id: 6,
      category: "Healthcare",
      icon: Heart,
      budget: 400,
      spent: 156,
      color: "red",
      trend: "-8%",
      transactions: 3,
    },
  ]

  const upcomingBills = [
    { name: "Rent Payment", amount: 2500, date: "May 1", category: "Housing", status: "pending" },
    { name: "Car Insurance", amount: 185, date: "May 5", category: "Transportation", status: "pending" },
    { name: "Internet", amount: 79, date: "May 10", category: "Utilities", status: "pending" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Budget Management</h1>
          <p className="text-slate-600">Track spending and stay within your budget limits</p>
        </div>
        <Link href="/neobank/budgets/new">
          <Button className="bg-[#635bff] hover:bg-[#5146e5] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#635bff]">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Total Budget</CardDescription>
            <CardTitle className="text-2xl">${overallStats.totalBudget.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-slate-600">
              <Calendar className="h-3 w-3 mr-1" />
              This Month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Total Spent</CardDescription>
            <CardTitle className="text-2xl">${overallStats.totalSpent.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-orange-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {overallStats.percentUsed}% of budget
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Remaining</CardDescription>
            <CardTitle className="text-2xl">${overallStats.remaining.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {100 - overallStats.percentUsed}% available
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Over Budget</CardDescription>
            <CardTitle className="text-2xl">1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-red-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              Needs attention
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="bills">Upcoming Bills</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {budgets.map((budget) => {
            const percentUsed = (budget.spent / budget.budget) * 100
            const remaining = budget.budget - budget.spent
            const Icon = budget.icon

            return (
              <Card
                key={budget.id}
                className="hover:shadow-lg transition-all cursor-pointer group border-l-4"
                style={{ borderLeftColor: budget.over ? "#ef4444" : "#94a3b8" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-${budget.color}-100`}>
                        <Icon className={`h-6 w-6 text-${budget.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a2540] text-lg">{budget.category}</h3>
                        <p className="text-sm text-slate-600">{budget.transactions} transactions this month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#0a2540]">${budget.spent.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">of ${budget.budget.toLocaleString()}</div>
                      <Badge
                        variant="secondary"
                        className={
                          budget.trend.startsWith("+") ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                        }
                      >
                        {budget.trend} vs last month
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {remaining >= 0
                          ? `$${remaining.toLocaleString()} remaining`
                          : `$${Math.abs(remaining).toLocaleString()} over`}
                      </span>
                      <span className={`font-medium ${budget.over ? "text-red-600" : "text-slate-900"}`}>
                        {Math.round(percentUsed)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentUsed, 100)}
                      className="h-2"
                      indicatorClassName={budget.over ? "bg-red-500" : "bg-[#635bff]"}
                    />
                  </div>

                  {budget.over && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-red-900 font-medium">Over budget alert</p>
                        <p className="text-red-700">
                          You've exceeded your budget by ${Math.abs(remaining).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link href={`/neobank/budgets/${budget.id}`}>
                    <Button variant="ghost" className="w-full mt-4 group-hover:bg-slate-100">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Budget Timeline</CardTitle>
              <CardDescription>Track your spending patterns throughout the month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-slate-400">
                Timeline visualization coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          {upcomingBills.map((bill, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a2540]">{bill.name}</h3>
                    <p className="text-sm text-slate-600">Due {bill.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#0a2540]">${bill.amount.toLocaleString()}</div>
                  <Badge variant="secondary">{bill.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
