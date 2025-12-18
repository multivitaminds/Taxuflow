"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Download,
  Send,
  CheckCircle2,
  Package,
  Clock,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"

export default function PurchaseOrderDetailClient({ poId }: { poId: string }) {
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)

  const poData = {
    id: poId,
    vendor: {
      name: "Office Supplies Co.",
      email: "billing@officesupplies.com",
      phone: "(555) 123-4567",
      address: "123 Business St, City, ST 12345",
    },
    orderDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "approved",
    subtotal: 2250.0,
    tax: 200.0,
    total: 2450.0,
    notes: "Please deliver to main warehouse. Contact John Doe at extension 1234 for receiving.",
    items: [
      { id: "1", description: "Office Chairs - Ergonomic", quantity: 10, unitPrice: 125.0, received: 0 },
      { id: "2", description: "Standing Desks - Adjustable", quantity: 5, unitPrice: 350.0, received: 0 },
      { id: "3", description: "Monitor Arms - Dual", quantity: 8, unitPrice: 75.0, received: 0 },
    ],
    approvals: [
      { name: "John Smith", role: "Department Manager", date: "2024-01-16", status: "approved" },
      { name: "Sarah Johnson", role: "Finance Director", date: "2024-01-17", status: "approved" },
    ],
    activity: [
      { date: "2024-01-17", user: "Sarah Johnson", action: "Approved purchase order" },
      { date: "2024-01-16", user: "John Smith", action: "Approved purchase order" },
      { date: "2024-01-15", user: "Mike Brown", action: "Created purchase order" },
    ],
  }

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{poData.id}</h1>
              <Badge variant={poData.status === "approved" ? "default" : "secondary"}>
                {poData.status === "approved" ? "Approved" : "Pending"}
              </Badge>
            </div>
            <p className="text-slate-600 mt-1">Purchase Order Details</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="bg-white">
            <Send className="h-4 w-4 mr-2" />
            Send to Vendor
          </Button>
          <Button variant="outline" className="bg-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Package className="h-4 w-4 mr-2" />
            Receive Items
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white">
            <Tabs defaultValue="items" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="approvals">Approvals</TabsTrigger>
                <TabsTrigger value="receiving">Receiving</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4 mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm font-semibold text-slate-700">Description</th>
                        <th className="text-right py-3 text-sm font-semibold text-slate-700">Qty</th>
                        <th className="text-right py-3 text-sm font-semibold text-slate-700">Unit Price</th>
                        <th className="text-right py-3 text-sm font-semibold text-slate-700">Total</th>
                        <th className="text-right py-3 text-sm font-semibold text-slate-700">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poData.items.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-slate-50">
                          <td className="py-4 text-slate-900">{item.description}</td>
                          <td className="py-4 text-right text-slate-900">{item.quantity}</td>
                          <td className="py-4 text-right text-slate-900">${item.unitPrice.toFixed(2)}</td>
                          <td className="py-4 text-right font-semibold text-slate-900">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </td>
                          <td className="py-4 text-right">
                            <Badge variant={item.received === item.quantity ? "default" : "outline"}>
                              {item.received}/{item.quantity}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="font-semibold text-slate-900">${poData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax:</span>
                      <span className="font-semibold text-slate-900">${poData.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="text-slate-900">Total:</span>
                      <span className="text-blue-600">${poData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="approvals" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {poData.approvals.map((approval, index) => (
                    <Card key={index} className="p-4 border-l-4 border-l-green-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-semibold text-slate-900">{approval.name}</p>
                            <p className="text-sm text-slate-600">{approval.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">Approved</Badge>
                          <p className="text-xs text-slate-500 mt-1">{approval.date}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="receiving" className="space-y-4 mt-4">
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-4">
                    <Package className="h-8 w-8 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">Ready to Receive</h3>
                      <p className="text-sm text-slate-700 mb-4">
                        Mark items as received and automatically generate a bill for this purchase order.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Package className="h-4 w-4 mr-2" />
                        Receive All Items
                      </Button>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900">Receiving History</h4>
                  <p className="text-sm text-slate-600">No items have been received yet.</p>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-3 mt-4">
                {poData.activity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
                    <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Vendor Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Name</p>
                <p className="font-medium text-slate-900">{poData.vendor.name}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Email</p>
                <p className="font-medium text-slate-900">{poData.vendor.email}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Phone</p>
                <p className="font-medium text-slate-900">{poData.vendor.phone}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Address</p>
                <p className="font-medium text-slate-900">{poData.vendor.address}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Order Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Order Date</p>
                <p className="font-medium text-slate-900">{poData.orderDate}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Expected Delivery</p>
                <p className="font-medium text-slate-900">{poData.dueDate}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Status</p>
                <Badge variant="default">Approved</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </h3>
            <p className="text-sm text-slate-700">{poData.notes}</p>
          </Card>

          <Card className="p-6 bg-red-50 border-red-200">
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Cancel Purchase Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
