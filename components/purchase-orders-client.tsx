"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Clock, CheckCircle2, XCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface PurchaseOrder {
  id: string
  po_number: string
  vendor_name: string
  date: string
  expected_date: string
  total: number
  status: "draft" | "sent" | "received" | "cancelled"
}

export function PurchaseOrdersClient() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadPurchaseOrders()
  }, [])

  async function loadPurchaseOrders() {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("purchase_orders")
      .select(`
        *,
        vendors (company_name)
      `)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setPurchaseOrders(
        data.map((po: any) => ({
          id: po.id,
          po_number: po.po_number,
          vendor_name: po.vendors?.company_name || "Unknown",
          date: po.po_date,
          expected_date: po.expected_date,
          total: po.total_amount,
          status: po.status,
        })),
      )
    }
    setLoading(false)
  }

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter((po) => po.status === "draft").length,
    sent: purchaseOrders.filter((po) => po.status === "sent").length,
    received: purchaseOrders.filter((po) => po.status === "received").length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.total, 0),
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />
      case "sent":
        return <Clock className="h-4 w-4" />
      case "received":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "received":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage vendor purchase orders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New PO
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Total POs</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Draft</div>
          <div className="mt-2 text-2xl font-bold">{stats.draft}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Sent</div>
          <div className="mt-2 text-2xl font-bold">{stats.sent}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Value</div>
          <div className="mt-2 text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filteredPOs.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No purchase orders found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first purchase order to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium">PO Number</th>
                  <th className="pb-3 text-left text-sm font-medium">Vendor</th>
                  <th className="pb-3 text-left text-sm font-medium">Date</th>
                  <th className="pb-3 text-left text-sm font-medium">Expected</th>
                  <th className="pb-3 text-right text-sm font-medium">Amount</th>
                  <th className="pb-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                    <td className="py-3 text-sm font-medium">{po.po_number}</td>
                    <td className="py-3 text-sm">{po.vendor_name}</td>
                    <td className="py-3 text-sm">{new Date(po.date).toLocaleDateString()}</td>
                    <td className="py-3 text-sm">{new Date(po.expected_date).toLocaleDateString()}</td>
                    <td className="py-3 text-right text-sm font-medium">${po.total.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge className={`flex w-fit items-center gap-1 ${getStatusColor(po.status)}`}>
                        {getStatusIcon(po.status)}
                        {po.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
