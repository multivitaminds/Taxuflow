"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Package, Truck, CheckCircle, Edit, Download, User, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SalesOrderDetailClient({ orderId }: { orderId: string }) {
  // Mock data
  const order = {
    id: orderId,
    customer: {
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business St, San Francisco, CA 94105",
    },
    orderDate: "2024-01-20",
    deliveryDate: "2024-02-05",
    status: "confirmed",
    fulfillmentStatus: "pending",
    subtotal: 14000,
    tax: 1000,
    shipping: 0,
    total: 15000,
    items: [
      { id: 1, name: "Product A", sku: "SKU-001", quantity: 10, price: 500, total: 5000 },
      { id: 2, name: "Product B", sku: "SKU-002", quantity: 5, price: 800, total: 4000 },
      { id: 3, name: "Product C", sku: "SKU-003", quantity: 10, price: 500, total: 5000 },
    ],
    shippingAddress: {
      street: "456 Delivery Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
    },
    notes: "Customer requested expedited delivery",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "processing":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/accounting/sales-orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Sales Order {order.id}</h1>
              <p className="text-muted-foreground">Order details and fulfillment tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Convert to Invoice
              </Button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fulfillment</p>
                  <Badge className="bg-orange-500/10 text-orange-500">
                    {order.fulfillmentStatus.charAt(0).toUpperCase() + order.fulfillmentStatus.slice(1)}
                  </Badge>
                </div>
                <Package className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">${order.total.toLocaleString()}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Items</p>
                  <p className="text-2xl font-bold text-foreground">{order.items.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="items" className="w-full">
              <TabsList>
                <TabsTrigger value="items">Order Items</TabsTrigger>
                <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                <Card className="border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border bg-muted/50">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium">Product</th>
                          <th className="text-left p-4 text-sm font-medium">SKU</th>
                          <th className="text-right p-4 text-sm font-medium">Quantity</th>
                          <th className="text-right p-4 text-sm font-medium">Price</th>
                          <th className="text-right p-4 text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b border-border">
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4 text-muted-foreground">{item.sku}</td>
                            <td className="p-4 text-right">{item.quantity}</td>
                            <td className="p-4 text-right">${item.price.toLocaleString()}</td>
                            <td className="p-4 text-right font-medium">${item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t-2 border-border bg-muted/50">
                        <tr>
                          <td colSpan={4} className="p-4 text-right font-medium">
                            Subtotal
                          </td>
                          <td className="p-4 text-right font-medium">${order.subtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="p-4 text-right font-medium">
                            Tax
                          </td>
                          <td className="p-4 text-right font-medium">${order.tax.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="p-4 text-right font-semibold">
                            Total
                          </td>
                          <td className="p-4 text-right font-semibold text-lg">${order.total.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="fulfillment" className="space-y-4">
                <Card className="p-6 border-border">
                  <h3 className="font-semibold text-lg mb-4">Fulfillment Status</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-500">Pending</Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 gap-2">
                    <Package className="h-4 w-4" />
                    Mark as Fulfilled
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4">
                <Card className="p-6 border-border">
                  <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                      <p className="font-medium">{order.shippingAddress.street}</p>
                      <p className="text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                      </p>
                      <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                      <p className="font-mono text-sm">Not yet shipped</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 gap-2">
                    <Truck className="h-4 w-4" />
                    Create Shipment
                  </Button>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card className="p-6 border-border">
                  <h3 className="font-semibold text-lg mb-4">Order Activity</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="w-px h-full bg-border" />
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="font-medium">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                        <Package className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">Awaiting Fulfillment</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6 border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-sm">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </p>
                  <p className="text-sm">{order.customer.address}</p>
                </div>
              </div>
            </Card>

            {/* Order Dates */}
            <Card className="p-6 border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">{order.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expected Delivery</p>
                  <p className="font-medium text-blue-500">{order.deliveryDate}</p>
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6 border-border">
              <h3 className="font-semibold text-lg mb-4">Order Notes</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
