"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Copy,
  FileText,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  Download,
  Repeat,
} from "lucide-react"
import Link from "next/link"

export default function EstimateDetailClient({ estimateId }: { estimateId: string }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const estimate = {
    id: estimateId,
    number: "EST-001",
    customer: {
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business St, San Francisco, CA 94102",
    },
    date: "2024-01-15",
    expiryDate: "2024-02-15",
    validUntil: "30 days",
    status: "sent",
    subtotal: 14500,
    tax: 500,
    total: 15000,
    notes: "Thank you for your business. We look forward to working with you.",
    terms: "Payment due within 30 days of acceptance.",
    items: [
      { id: 1, description: "Website Design & Development", quantity: 1, rate: 8000, amount: 8000 },
      { id: 2, description: "Content Management System", quantity: 1, rate: 3500, amount: 3500 },
      { id: 3, description: "SEO Optimization", quantity: 1, rate: 2000, amount: 2000 },
      { id: 4, description: "Monthly Maintenance", quantity: 6, rate: 500, amount: 3000 },
    ],
    versions: [{ version: 1, date: "2024-01-15", changes: "Initial version", amount: 15000, status: "sent" }],
    activity: [
      { date: "2024-01-15 10:30 AM", action: "Estimate sent to customer", user: "John Smith" },
      { date: "2024-01-15 09:45 AM", action: "Estimate created", user: "John Smith" },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "sent":
        return "bg-blue-100 text-blue-700"
      case "accepted":
        return "bg-green-100 text-green-700"
      case "declined":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/estimates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{estimate.number}</h1>
            <p className="text-muted-foreground">Estimate for {estimate.customer.name}</p>
          </div>
          <Badge className={getStatusColor(estimate.status)}>
            {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
          <Link href={`/accounting/sales-orders/new?estimate=${estimateId}`}>
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Convert to Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">${estimate.total.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date Created</p>
              <p className="text-xl font-bold">{estimate.date}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Until</p>
              <p className="text-xl font-bold">{estimate.expiryDate}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Line Items</p>
              <p className="text-xl font-bold">{estimate.items.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="items">Line Items</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Estimate Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${estimate.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${estimate.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${estimate.total.toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Notes</h3>
                <p className="text-muted-foreground">{estimate.notes}</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Terms & Conditions</h3>
                <p className="text-muted-foreground">{estimate.terms}</p>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Description</th>
                        <th className="text-center p-4 font-medium">Quantity</th>
                        <th className="text-right p-4 font-medium">Rate</th>
                        <th className="text-right p-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estimate.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-4">{item.description}</td>
                          <td className="p-4 text-center">{item.quantity}</td>
                          <td className="p-4 text-right">${item.rate.toLocaleString()}</td>
                          <td className="p-4 text-right font-medium">${item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="versions">
              <Card className="p-6">
                <div className="space-y-4">
                  {estimate.versions.map((version) => (
                    <div key={version.version} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Repeat className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Version {version.version}</p>
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                          <p className="text-sm text-muted-foreground">{version.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${version.amount.toLocaleString()}</p>
                        <Badge className={getStatusColor(version.status)}>{version.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="p-6">
                <div className="space-y-4">
                  {estimate.activity.map((activity, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="p-2 bg-gray-100 rounded-lg h-fit">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">by {activity.user}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Customer Sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Customer Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{estimate.customer.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{estimate.customer.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{estimate.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm">{estimate.customer.address}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Send className="h-4 w-4" />
                Resend Estimate
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <CheckCircle className="h-4 w-4" />
                Mark as Accepted
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <XCircle className="h-4 w-4" />
                Mark as Declined
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Repeat className="h-4 w-4" />
                Create New Version
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
