"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Package, TrendingUp, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"

export default function SalesOrdersClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock sales orders data
  const salesOrders = [
    {
      id: "SO-001",
      customer: "Acme Corporation",
      orderDate: "2024-01-20",
      deliveryDate: "2024-02-05",
      amount: 15000,
      status: "confirmed",
      items: 5,
      fulfillmentStatus: "pending",
    },
    {
      id: "SO-002",
      customer: "TechStart Inc",
      orderDate: "2024-01-18",
      deliveryDate: "2024-02-01",
      amount: 8500,
      status: "processing",
      items: 3,
      fulfillmentStatus: "partial",
    },
    {
      id: "SO-003",
      customer: "Creative Studio",
      orderDate: "2024-01-22",
      deliveryDate: "2024-02-10",
      amount: 12000,
      status: "draft",
      items: 4,
      fulfillmentStatus: "pending",
    },
    {
      id: "SO-004",
      customer: "Global Enterprises",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-28",
      amount: 25000,
      status: "shipped",
      items: 8,
      fulfillmentStatus: "complete",
    },
  ]

  const stats = [
    { label: "Total Orders", value: "42", icon: FileText, color: "text-blue-600", trend: "+12%" },
    { label: "Processing", value: "8", icon: Clock, color: "text-orange-600", trend: "+5%" },
    { label: "Fulfilled", value: "28", icon: CheckCircle, color: "text-green-600", trend: "+18%" },
    { label: "Total Value", value: "$325,500", icon: TrendingUp, color: "text-purple-600", trend: "+22%" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "processing":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getFulfillmentColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-500/10 text-gray-500"
      case "partial":
        return "bg-orange-500/10 text-orange-500"
      case "complete":
        return "bg-green-500/10 text-green-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const statusCounts = {
    all: salesOrders.length,
    draft: salesOrders.filter((o) => o.status === "draft").length,
    confirmed: salesOrders.filter((o) => o.status === "confirmed").length,
    processing: salesOrders.filter((o) => o.status === "processing").length,
    shipped: salesOrders.filter((o) => o.status === "shipped").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sales Orders</h1>
              <p className="text-muted-foreground">Manage orders from quote to delivery</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/accounting/sales-orders/fulfillment">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <Package className="h-5 w-5" />
                  Fulfillment Center
                </Button>
              </Link>
              <Link href="/accounting/sales-orders/new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create Order
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4 border-border hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <p className="text-xs text-green-500 font-medium">{stat.trend} from last month</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link href="/accounting/estimates">
            <Card className="p-6 border-border hover:shadow-md transition-all cursor-pointer hover:border-accent">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Convert Estimate</h3>
                  <p className="text-sm text-muted-foreground">Create order from estimate</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/sales-orders/fulfillment">
            <Card className="p-6 border-border hover:shadow-md transition-all cursor-pointer hover:border-accent">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Fulfillment</h3>
                  <p className="text-sm text-muted-foreground">Process & ship orders</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/accounting/sales-orders/shipping">
            <Card className="p-6 border-border hover:shadow-md transition-all cursor-pointer hover:border-accent">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Shipping</h3>
                  <p className="text-sm text-muted-foreground">Track shipments</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              size="sm"
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === "draft" ? "default" : "outline"}
              onClick={() => setStatusFilter("draft")}
              size="sm"
            >
              Draft ({statusCounts.draft})
            </Button>
            <Button
              variant={statusFilter === "confirmed" ? "default" : "outline"}
              onClick={() => setStatusFilter("confirmed")}
              size="sm"
            >
              Confirmed ({statusCounts.confirmed})
            </Button>
            <Button
              variant={statusFilter === "processing" ? "default" : "outline"}
              onClick={() => setStatusFilter("processing")}
              size="sm"
            >
              Processing ({statusCounts.processing})
            </Button>
            <Button
              variant={statusFilter === "shipped" ? "default" : "outline"}
              onClick={() => setStatusFilter("shipped")}
              size="sm"
            >
              Shipped ({statusCounts.shipped})
            </Button>
          </div>
        </div>

        {/* Sales Orders Table */}
        <Card className="border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order #</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Delivery Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fulfillment</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No sales orders found</p>
                      <Link href="/accounting/sales-orders/new">
                        <Button size="sm">Create your first order</Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <Link
                          href={`/accounting/sales-orders/${order.id}`}
                          className="font-medium text-foreground hover:text-accent"
                        >
                          {order.id}
                        </Link>
                      </td>
                      <td className="p-4 text-foreground">{order.customer}</td>
                      <td className="p-4 text-muted-foreground">{order.orderDate}</td>
                      <td className="p-4 text-muted-foreground">{order.deliveryDate}</td>
                      <td className="p-4 text-muted-foreground">{order.items} items</td>
                      <td className="p-4 text-right font-medium text-foreground">${order.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getFulfillmentColor(order.fulfillmentStatus)}>
                          {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/accounting/sales-orders/${order.id}`}>View</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
