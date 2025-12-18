"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Receipt,
  CreditCard,
  Users,
  Package,
  Clock,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BooksClient() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const quickStats = [
    {
      title: "Revenue",
      value: "$487,320",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/accounting/books/revenue",
    },
    {
      title: "Expenses",
      value: "$234,890",
      change: "+5.2%",
      trend: "up",
      icon: TrendingDown,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      href: "/accounting/books/expenses",
    },
    {
      title: "Net Income",
      value: "$252,430",
      change: "+18.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/accounting/books/net-income",
    },
    {
      title: "Profit Margin",
      value: "51.8%",
      change: "+2.1%",
      trend: "up",
      icon: PieChart,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      href: "/accounting/books/margins",
    },
  ]

  const accountingModules = [
    {
      title: "Invoices",
      description: "Create and track customer invoices",
      icon: FileText,
      count: 156,
      pending: 23,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/accounting/invoices",
    },
    {
      title: "Bills",
      description: "Manage vendor bills and payments",
      icon: Receipt,
      count: 89,
      pending: 12,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      href: "/accounting/bills",
    },
    {
      title: "Expenses",
      description: "Track business expenses",
      icon: CreditCard,
      count: 234,
      pending: 45,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/accounting/expenses",
    },
    {
      title: "Customers",
      description: "Manage customer relationships",
      icon: Users,
      count: 342,
      pending: 0,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/accounting/customers",
    },
    {
      title: "Vendors",
      description: "Track vendor information",
      icon: Package,
      count: 127,
      pending: 0,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/accounting/vendors",
    },
    {
      title: "Products",
      description: "Manage products and services",
      icon: Package,
      count: 89,
      pending: 0,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      href: "/accounting/products",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "invoice",
      title: "Invoice #INV-1234 paid",
      customer: "Acme Corp",
      amount: "$12,500",
      status: "completed",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "bill",
      title: "Bill #BILL-5678 received",
      vendor: "Office Supplies Inc",
      amount: "$3,240",
      status: "pending",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "expense",
      title: "Expense submitted",
      customer: "Travel - Conference",
      amount: "$1,850",
      status: "approved",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "invoice",
      title: "Invoice #INV-1235 sent",
      customer: "TechStart LLC",
      amount: "$8,900",
      status: "sent",
      time: "1 day ago",
    },
  ]

  const upcomingPayments = [
    {
      id: 1,
      type: "payable",
      description: "Office Rent - Q1 2024",
      amount: "$15,000",
      dueDate: "2024-01-15",
      daysUntil: 3,
      vendor: "Property Management LLC",
    },
    {
      id: 2,
      type: "payable",
      description: "Software Subscriptions",
      amount: "$4,500",
      dueDate: "2024-01-18",
      daysUntil: 6,
      vendor: "Various Vendors",
    },
    {
      id: 3,
      type: "receivable",
      description: "Invoice #INV-1230",
      amount: "$22,000",
      dueDate: "2024-01-20",
      daysUntil: 8,
      vendor: "Enterprise Client Co",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Books</h1>
            <p className="mt-2 text-slate-600">Comprehensive accounting and financial management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/accounting/books/reports")}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button onClick={() => router.push("/accounting/books/reconcile")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Reconcile
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                        <div className="mt-2 flex items-center gap-1">
                          <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="text-xs">
                            {stat.change}
                          </Badge>
                          <span className="text-xs text-slate-500">vs last {selectedPeriod}</span>
                        </div>
                      </div>
                      <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Accounting Modules Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Accounting Modules</CardTitle>
                <CardDescription>Access all your accounting tools and records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {accountingModules.map((module) => {
                    const Icon = module.icon
                    return (
                      <Link key={module.title} href={module.href}>
                        <Card className="group cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`rounded-lg p-3 ${module.bgColor}`}>
                                <Icon className={`h-6 w-6 ${module.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-slate-900">{module.title}</h3>
                                  <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                                <p className="mt-1 text-sm text-slate-600">{module.description}</p>
                                <div className="mt-3 flex items-center gap-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {module.count} total
                                  </Badge>
                                  {module.pending > 0 && (
                                    <Badge variant="outline" className="text-xs text-amber-600">
                                      {module.pending} pending
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity & Upcoming Payments */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/accounting/books/activity")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="group flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50"
                      onClick={() =>
                        router.push(
                          `/accounting/${activity.type === "invoice" ? "invoices" : activity.type === "bill" ? "bills" : "expenses"}/${activity.id}`,
                        )
                      }
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{activity.title}</h4>
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : activity.status === "approved"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{activity.customer}</p>
                        <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                      </div>
                      <p className="font-semibold text-slate-900">{activity.amount}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Payments</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => router.push("/accounting/books/payments")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="group flex cursor-pointer items-start justify-between rounded-lg border p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50"
                      onClick={() => router.push(`/accounting/books/payment/${payment.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{payment.description}</h4>
                          {payment.daysUntil <= 5 && (
                            <Badge variant="destructive" className="text-xs">
                              Due soon
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{payment.vendor}</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Due {payment.dueDate} ({payment.daysUntil} days)
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold text-slate-900">{payment.amount}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Accounting Modules</CardTitle>
                <CardDescription>Complete access to your accounting system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {accountingModules.map((module) => {
                    const Icon = module.icon
                    return (
                      <Link key={module.title} href={module.href}>
                        <Card className="group cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`rounded-xl p-4 ${module.bgColor}`}>
                                <Icon className={`h-8 w-8 ${module.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
                                  <ArrowUpRight className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{module.description}</p>
                                <div className="mt-4 flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-sm text-slate-600">{module.count} records</span>
                                  </div>
                                  {module.pending > 0 && (
                                    <div className="flex items-center gap-1">
                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                      <span className="text-sm text-amber-600">{module.pending} pending</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Activity</CardTitle>
                <CardDescription>Complete transaction and activity history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...recentActivity, ...recentActivity].map((activity, idx) => (
                    <div
                      key={`${activity.id}-${idx}`}
                      className="group flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50"
                      onClick={() =>
                        router.push(
                          `/accounting/${activity.type === "invoice" ? "invoices" : activity.type === "bill" ? "bills" : "expenses"}/${activity.id}`,
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-lg p-2 ${activity.status === "completed" ? "bg-emerald-50" : activity.status === "approved" ? "bg-blue-50" : "bg-amber-50"}`}
                        >
                          {activity.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">{activity.title}</h4>
                            <Badge
                              variant={
                                activity.status === "completed" || activity.status === "approved"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{activity.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-500">{activity.time}</p>
                        <p className="font-semibold text-slate-900">{activity.amount}</p>
                        <ArrowUpRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Overview</CardTitle>
                <CardDescription>Track money in and out of your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => router.push("/accounting/books/cashflow/inflow")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Cash Inflow</p>
                            <p className="mt-2 text-2xl font-bold text-emerald-600">$487,320</p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-emerald-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => router.push("/accounting/books/cashflow/outflow")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Cash Outflow</p>
                            <p className="mt-2 text-2xl font-bold text-rose-600">$234,890</p>
                          </div>
                          <TrendingDown className="h-8 w-8 text-rose-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => router.push("/accounting/books/cashflow/net")}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Net Cash Flow</p>
                            <p className="mt-2 text-2xl font-bold text-blue-600">$252,430</p>
                          </div>
                          <LineChart className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-violet-50 p-8 text-center">
                    <LineChart className="mx-auto h-12 w-12 text-blue-600" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">Cash Flow Chart</h3>
                    <p className="mt-2 text-sm text-slate-600">Visual representation of your cash flow over time</p>
                    <Button className="mt-4" onClick={() => router.push("/accounting/books/cashflow/chart")}>
                      View Cash Flow Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
