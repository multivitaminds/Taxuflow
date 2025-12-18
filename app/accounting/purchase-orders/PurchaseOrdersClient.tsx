"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, FileText, Clock, CheckCircle2, Package, DollarSign, TrendingUp, Building2 } from "lucide-react"
import Link from "next/link"

export default function PurchaseOrdersClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const stats = [
    { label: "Open POs", value: "12", icon: FileText, color: "blue", trend: "+3" },
    { label: "Pending Approval", value: "5", icon: Clock, color: "orange", trend: "+2" },
    { label: "Received", value: "8", icon: Package, color: "green", trend: "+1" },
    { label: "Total Value", value: "$45,230", icon: DollarSign, color: "purple", trend: "+12%" },
  ]

  const purchaseOrders = [
    {
      id: "PO-2024-001",
      vendor: "Office Supplies Co.",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      status: "pending_approval",
      amount: 2450.0,
      items: 12,
    },
    {
      id: "PO-2024-002",
      vendor: "Tech Solutions Inc.",
      date: "2024-01-18",
      dueDate: "2024-02-18",
      status: "approved",
      amount: 5200.0,
      items: 5,
    },
    {
      id: "PO-2024-003",
      vendor: "Marketing Agency LLC",
      date: "2024-01-20",
      dueDate: "2024-01-25",
      status: "received",
      amount: 3100.0,
      items: 8,
    },
    {
      id: "PO-2024-004",
      vendor: "Hardware Warehouse",
      date: "2024-01-22",
      dueDate: "2024-02-22",
      status: "open",
      amount: 1850.0,
      items: 15,
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
    > = {
      pending_approval: { label: "Pending Approval", variant: "secondary" },
      approved: { label: "Approved", variant: "default" },
      open: { label: "Open", variant: "outline" },
      received: { label: "Received", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
          <p className="text-slate-600 mt-1">Create, track, and manage purchase orders with vendors</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/accounting/purchase-orders/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search purchase orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            {purchaseOrders.map((po) => (
              <Link key={po.id} href={`/accounting/purchase-orders/${po.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900">{po.id}</h3>
                          {getStatusBadge(po.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                          <Building2 className="h-4 w-4" />
                          <span>{po.vendor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Order Date</p>
                        <p className="text-sm font-medium text-slate-900">{po.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Due Date</p>
                        <p className="text-sm font-medium text-slate-900">{po.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Items</p>
                        <p className="text-sm font-medium text-slate-900">{po.items}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Amount</p>
                        <p className="text-lg font-bold text-blue-600">${po.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>

          <TabsContent value="pending">
            <p className="text-slate-600 text-center py-8">Showing purchase orders pending approval...</p>
          </TabsContent>

          <TabsContent value="approved">
            <p className="text-slate-600 text-center py-8">Showing approved purchase orders...</p>
          </TabsContent>

          <TabsContent value="received">
            <p className="text-slate-600 text-center py-8">Showing received purchase orders...</p>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/accounting/purchase-orders/receiving">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500">
            <Package className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Receive Goods</h3>
            <p className="text-sm text-slate-600">Mark items as received and create bills</p>
          </Card>
        </Link>

        <Link href="/accounting/purchase-orders/approvals">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-orange-50 to-amber-50 border-l-4 border-l-orange-500">
            <CheckCircle2 className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Approval Workflow</h3>
            <p className="text-sm text-slate-600">Manage PO approval requests and settings</p>
          </Card>
        </Link>

        <Link href="/accounting/purchase-orders/reports">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-l-purple-500">
            <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">PO Reports</h3>
            <p className="text-sm text-slate-600">Analyze spending and vendor performance</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}
