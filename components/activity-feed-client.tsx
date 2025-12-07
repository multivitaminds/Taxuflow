"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Receipt,
  Users,
  Package,
  TrendingUp,
  Clock,
  RefreshCw,
  CheckCircle2,
  Info,
  Building2,
  DollarSign,
  UserCog,
} from "lucide-react"
import Link from "next/link"

export default function ActivityFeedClient() {
  const [filter, setFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const activities = [
    // Today
    {
      id: 1,
      type: "invoice_created",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      title: "Invoice Created",
      description: "Created invoice #INV-2024-145 for Acme Corporation",
      amount: "$15,250.00",
      user: "Sarah Johnson",
      timestamp: "2 minutes ago",
      link: "/accounting/invoices/145",
      category: "Invoices",
      period: "today",
    },
    {
      id: 2,
      type: "payment_received",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      title: "Payment Received",
      description: "Payment received for invoice #INV-2024-142",
      amount: "$8,500.00",
      user: "System",
      timestamp: "15 minutes ago",
      link: "/accounting/payments/142",
      category: "Payments",
      period: "today",
    },
    {
      id: 3,
      type: "expense_added",
      icon: Receipt,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      title: "Expense Added",
      description: "Added office supplies expense",
      amount: "$425.00",
      user: "Mike Chen",
      timestamp: "45 minutes ago",
      link: "/accounting/expenses/89",
      category: "Expenses",
      period: "today",
    },
    {
      id: 4,
      type: "customer_created",
      icon: Users,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      title: "New Customer",
      description: "Added TechStart Inc. as a new customer",
      user: "Emily Davis",
      timestamp: "1 hour ago",
      link: "/accounting/customers/45",
      category: "Customers",
      period: "today",
    },
    {
      id: 5,
      type: "bill_approved",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      title: "Bill Approved",
      description: "Approved bill #BILL-2024-089",
      amount: "$3,200.00",
      user: "John Smith",
      timestamp: "2 hours ago",
      link: "/accounting/bills/89",
      category: "Bills",
      period: "today",
    },
    // Yesterday
    {
      id: 6,
      type: "purchase_order",
      icon: FileText,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      title: "Purchase Order Created",
      description: "Created PO #PO-2024-056 for office equipment",
      amount: "$12,400.00",
      user: "Sarah Johnson",
      timestamp: "Yesterday at 4:30 PM",
      link: "/accounting/purchase-orders/56",
      category: "Purchase Orders",
      period: "yesterday",
    },
    {
      id: 7,
      type: "vendor_updated",
      icon: Building2,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      title: "Vendor Updated",
      description: "Updated contact information for Global Supplies",
      user: "Mike Chen",
      timestamp: "Yesterday at 2:15 PM",
      link: "/accounting/vendors/23",
      category: "Vendors",
      period: "yesterday",
    },
    {
      id: 8,
      type: "tax_payment",
      icon: DollarSign,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      title: "Tax Payment Made",
      description: "Paid quarterly tax estimate",
      amount: "$5,800.00",
      user: "System",
      timestamp: "Yesterday at 11:00 AM",
      link: "/accounting/tax/quarterly",
      category: "Tax",
      period: "yesterday",
    },
    // This Week
    {
      id: 9,
      type: "report_generated",
      icon: TrendingUp,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
      title: "Report Generated",
      description: "Generated Profit & Loss report for Q1 2024",
      user: "Emily Davis",
      timestamp: "3 days ago",
      link: "/accounting/reports/profit-loss",
      category: "Reports",
      period: "week",
    },
    {
      id: 10,
      type: "employee_added",
      icon: UserCog,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
      title: "Employee Added",
      description: "Added Alex Thompson to payroll",
      user: "John Smith",
      timestamp: "4 days ago",
      link: "/accounting/employees/12",
      category: "Employees",
      period: "week",
    },
    {
      id: 11,
      type: "inventory_adjusted",
      icon: Package,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
      title: "Inventory Adjusted",
      description: "Updated stock levels for Product SKU-1234",
      user: "Mike Chen",
      timestamp: "5 days ago",
      link: "/accounting/inventory/1234",
      category: "Inventory",
      period: "week",
    },
    {
      id: 12,
      type: "reconciliation",
      icon: CheckCircle2,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
      title: "Bank Reconciliation",
      description: "Reconciled Chase Business Account for January",
      user: "Sarah Johnson",
      timestamp: "6 days ago",
      link: "/accounting/bank-feeds/reconciliation",
      category: "Banking",
      period: "week",
    },
  ]

  const stats = [
    { label: "Total Activities", value: "847", color: "text-blue-600", change: "+12%" },
    { label: "Today", value: "45", color: "text-emerald-600", change: "+8%" },
    { label: "This Week", value: "312", color: "text-purple-600", change: "+15%" },
    { label: "Active Users", value: "18", color: "text-amber-600", change: "+2" },
  ]

  const categories = ["All", "Invoices", "Bills", "Expenses", "Payments", "Customers", "Vendors", "Banking", "Reports"]

  const filteredActivities =
    filter === "all" ? activities : activities.filter((activity) => activity.category.toLowerCase() === filter)

  const groupedActivities = {
    today: filteredActivities.filter((a) => a.period === "today"),
    yesterday: filteredActivities.filter((a) => a.period === "yesterday"),
    week: filteredActivities.filter((a) => a.period === "week"),
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity Feed</h1>
          <p className="text-slate-600 mt-1">Real-time timeline of all activities across your platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600">{stat.label}</p>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                {stat.change}
              </Badge>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Category Filter */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category.toLowerCase())}
              className={
                filter === category.toLowerCase() ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-slate-50"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </Card>

      {/* Activity Timeline */}
      <div className="space-y-8">
        {/* Today Section */}
        {groupedActivities.today.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Today</h2>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="space-y-3">
              {groupedActivities.today.map((activity) => (
                <Link key={activity.id} href={activity.link}>
                  <Card className="p-5 hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${activity.iconBg}`}>
                        <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">{activity.title}</h3>
                            <p className="text-slate-600 text-sm mb-2">{activity.description}</p>
                          </div>
                          {activity.amount && (
                            <p className="font-bold text-slate-900 text-lg ml-4">{activity.amount}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <UserCog className="h-4 w-4" />
                            <span>{activity.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{activity.timestamp}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Yesterday Section */}
        {groupedActivities.yesterday.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Yesterday</h2>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="space-y-3">
              {groupedActivities.yesterday.map((activity) => (
                <Link key={activity.id} href={activity.link}>
                  <Card className="p-5 hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${activity.iconBg}`}>
                        <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">{activity.title}</h3>
                            <p className="text-slate-600 text-sm mb-2">{activity.description}</p>
                          </div>
                          {activity.amount && (
                            <p className="font-bold text-slate-900 text-lg ml-4">{activity.amount}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <UserCog className="h-4 w-4" />
                            <span>{activity.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{activity.timestamp}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Earlier This Week Section */}
        {groupedActivities.week.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Earlier This Week</h2>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>
            <div className="space-y-3">
              {groupedActivities.week.map((activity) => (
                <Link key={activity.id} href={activity.link}>
                  <Card className="p-5 hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${activity.iconBg}`}>
                        <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">{activity.title}</h3>
                            <p className="text-slate-600 text-sm mb-2">{activity.description}</p>
                          </div>
                          {activity.amount && (
                            <p className="font-bold text-slate-900 text-lg ml-4">{activity.amount}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <UserCog className="h-4 w-4" />
                            <span>{activity.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{activity.timestamp}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <Card className="p-12 text-center">
            <Info className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Activities Found</h3>
            <p className="text-slate-600">Try adjusting your filter or check back later for new activities.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
