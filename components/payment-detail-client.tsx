"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Mail,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  FileText,
  Receipt,
} from "lucide-react"

interface PaymentDetail {
  id: string
  amount: number
  currency: string
  status: "succeeded" | "pending" | "failed" | "refunded"
  customer_email: string
  customer_name: string
  created_at: string
  description: string
  payment_method: string
  payment_method_details: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  invoice_id?: string
  receipt_url?: string
  fee: number
  net_amount: number
}

interface PaymentActivity {
  id: string
  type: "created" | "succeeded" | "failed" | "refunded" | "disputed"
  description: string
  timestamp: string
}

export function PaymentDetailClient({ paymentId }: { paymentId: string }) {
  const [payment, setPayment] = useState<PaymentDetail | null>(null)
  const [activities, setActivities] = useState<PaymentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock payment data
    const mockPayment: PaymentDetail = {
      id: paymentId,
      amount: 1250.0,
      currency: "USD",
      status: "succeeded",
      customer_email: "alice@example.com",
      customer_name: "Alice Johnson",
      created_at: new Date().toISOString(),
      description: "Web Design Services - Invoice #INV-2024-001",
      payment_method: "card",
      payment_method_details: {
        brand: "Visa",
        last4: "4242",
        exp_month: 12,
        exp_year: 2025,
      },
      invoice_id: "inv_001",
      receipt_url: "/receipts/py_001",
      fee: 36.25,
      net_amount: 1213.75,
    }

    const mockActivities: PaymentActivity[] = [
      {
        id: "1",
        type: "created",
        description: "Payment initiated by customer",
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
      {
        id: "2",
        type: "succeeded",
        description: "Payment completed successfully",
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
    ]

    setPayment(mockPayment)
    setActivities(mockActivities)
    setLoading(false)
  }, [paymentId])

  if (loading || !payment) {
    return <div className="p-8">Loading payment details...</div>
  }

  const statusConfig = {
    succeeded: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "Succeeded",
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      label: "Pending",
    },
    failed: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      label: "Failed",
    },
    refunded: {
      icon: RefreshCw,
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
      label: "Refunded",
    },
  }

  const config = statusConfig[payment.status]
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/accounting/payments">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Payment Details</h1>
              <p className="text-slate-600 mt-1">{payment.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white">
              <Download className="h-4 w-4 mr-2" />
              Receipt
            </Button>
            <Button variant="outline" className="bg-white">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            {payment.status === "succeeded" && (
              <Button variant="destructive">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refund
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Card */}
            <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${config.bg} ${config.border} border-2 inline-flex`}>
                  <StatusIcon className={`h-6 w-6 ${config.color}`} />
                </div>
                <Badge className={`${config.bg} ${config.color} border-0 px-4 py-1.5 text-sm font-semibold`}>
                  {config.label}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-white/80 text-sm font-medium">Total Amount</p>
                <p className="text-6xl font-bold">
                  ${payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-white/70 text-sm">{payment.currency}</p>
              </div>
            </Card>

            {/* Tabs */}
            <Card className="bg-white shadow-md">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="details"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="related"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
                  >
                    Related
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="p-6 space-y-6">
                  {/* Payment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Amount</p>
                        <p className="font-semibold text-slate-900">${payment.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Fee</p>
                        <p className="font-semibold text-slate-900">${payment.fee.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Net Amount</p>
                        <p className="font-semibold text-green-600">${payment.net_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Currency</p>
                        <p className="font-semibold text-slate-900">{payment.currency}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <CreditCard className="h-6 w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {payment.payment_method_details.brand} •••• {payment.payment_method_details.last4}
                        </p>
                        <p className="text-sm text-slate-600">
                          Expires {payment.payment_method_details.exp_month}/{payment.payment_method_details.exp_year}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600">{payment.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="p-6">
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`p-2 rounded-full ${activity.type === "succeeded" ? "bg-green-100" : "bg-blue-100"}`}
                          >
                            {activity.type === "succeeded" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          {index < activities.length - 1 && <div className="w-0.5 h-12 bg-slate-200 my-1" />}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-semibold text-slate-900">{activity.description}</p>
                          <p className="text-sm text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="related" className="p-6">
                  {payment.invoice_id ? (
                    <Link href={`/accounting/invoices/${payment.invoice_id}`}>
                      <Card className="p-4 hover:shadow-md transition-all cursor-pointer bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Receipt className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Related Invoice</p>
                            <p className="text-sm text-slate-600">{payment.invoice_id}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ) : (
                    <p className="text-slate-500 text-center py-8">No related items</p>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{payment.customer_name}</p>
                    <p className="text-sm text-slate-600">{payment.customer_email}</p>
                  </div>
                </div>
                <Separator />
                <Link href={`/accounting/customers/${payment.customer_email}`}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Customer
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-slate-600">Created</p>
                    <p className="font-medium text-slate-900">{new Date(payment.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  View Invoice
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
