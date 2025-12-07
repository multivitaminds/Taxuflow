"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, CheckCircle2, FileText } from "lucide-react"
import Link from "next/link"

export default function ReceivingClient() {
  const [searchQuery, setSearchQuery] = useState("")

  const pendingOrders = [
    {
      id: "PO-2024-002",
      vendor: "Tech Solutions Inc.",
      orderDate: "2024-01-18",
      items: 5,
      totalQty: 25,
      receivedQty: 0,
      amount: 5200.0,
    },
    {
      id: "PO-2024-004",
      vendor: "Hardware Warehouse",
      orderDate: "2024-01-22",
      items: 15,
      totalQty: 50,
      receivedQty: 0,
      amount: 1850.0,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/purchase-orders">
            <Button variant="outline" size="icon" className="bg-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Receive Goods</h1>
            <p className="text-slate-600 mt-1">Mark items as received and create bills</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Pending Receipt</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{pendingOrders.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Items</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {pendingOrders.reduce((sum, order) => sum + order.totalQty, 0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                ${pendingOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white">
        <h3 className="font-semibold text-slate-900 mb-4">Purchase Orders Ready to Receive</h3>
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <Card
              key={order.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-slate-900">{order.id}</h4>
                      <Badge variant="secondary">Awaiting Receipt</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{order.vendor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Order Date</p>
                    <p className="text-sm font-medium text-slate-900">{order.orderDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Items</p>
                    <p className="text-sm font-medium text-slate-900">{order.items}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Quantity</p>
                    <p className="text-sm font-medium text-slate-900">
                      {order.receivedQty}/{order.totalQty}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Amount</p>
                    <p className="text-lg font-bold text-green-600">${order.amount.toLocaleString()}</p>
                  </div>
                  <Link href={`/accounting/purchase-orders/${order.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Package className="h-4 w-4 mr-2" />
                      Receive
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}
