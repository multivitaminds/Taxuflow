"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  RefreshCw,
  CreditCard,
  User,
  Calendar,
  DollarSign,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

interface PaymentDetail {
  id: string
  amount: number
  currency: string
  status: "succeeded" | "pending" | "failed" | "refunded"
  customer_name: string
  customer_email: string
  created_at: string
  description: string
  payment_method: string
  payment_method_type: string
  last4: string
  invoice_id?: string
  receipt_url?: string
  refunded_amount?: number
  fee: number
  net_amount: number
}

export default function PaymentDetailClient({ paymentId }: { paymentId: string }) {
  const [payment, setPayment] = useState<PaymentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockPayment: PaymentDetail = {
      id: paymentId,
      amount: 1250.0,
      currency: "USD",
      status: "succeeded",
      customer_name: "Alice Johnson",
      customer_email: "alice@example.com",
      created_at: new Date().toISOString(),
      description: "Web Design Services - Homepage Redesign",
      payment_method: "Visa •••• 4242",
      payment_method_type: "card",
      last4: "4242",
      invoice_id: "INV-001",
      receipt_url: "/receipts/receipt_abc123",
      fee: 36.25,
      net_amount: 1213.75,
    }

    setPayment(mockPayment)
    setLoading(false)
  }, [paymentId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-5xl mx-auto">Loading payment details...</div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-5xl mx-auto">Payment not found</div>
      </div>
    )
  }

  const statusConfig = {
    succeeded: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Succeeded" },
    pending: { icon: Clock, color: "text-orange-600", bg: "bg-orange-50", label: "Pending" },
    failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Failed" },
    refunded: { icon: RefreshCw, color: "text-gray-600", bg: "bg-gray-50", label: "Refunded" },
  }

  const StatusIcon = statusConfig[payment.status].icon

  const handleRefund = () => {
    toast.success("Refund initiated successfully")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/accounting/payments">
            <Button variant="ghost" size="sm" className="hover:bg-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
          </Link>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payment Details</h1>
            <p className="text-slate-600 mt-1">Payment ID: {payment.id}</p>
          </div>
          <div className="flex gap-3">
            {payment.receipt_url && (
              <Button variant="outline" className="bg-white border-slate-300">
                <Download className="mr-2 h-4 w-4" />
                Receipt
              </Button>
            )}
            {payment.status === "succeeded" && (
              <Button variant="outline" onClick={handleRefund} className="bg-white border-slate-300 text-red-600">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refund
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 bg-white md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Transaction Overview</h2>
                <Badge className={`${statusConfig[payment.status].bg} ${statusConfig[payment.status].color} border-0`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[payment.status].label}
                </Badge>
              </div>
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600">Amount</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    ${payment.amount.toFixed(2)}{" "}
                    <span className="text-base font-normal text-slate-500">{payment.currency}</span>
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Processing Fee</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">${payment.fee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Net Amount</p>
                  <p className="text-lg font-semibold text-slate-900 mt-1">${payment.net_amount.toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-slate-600 mb-2">Description</p>
                <p className="text-slate-900 font-medium">{payment.description}</p>
              </div>

              {payment.invoice_id && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Related Invoice</p>
                        <p className="text-xs text-slate-600">{payment.invoice_id}</p>
                      </div>
                    </div>
                    <Link href={`/accounting/invoices/${payment.invoice_id}`}>
                      <Button size="sm" variant="outline" className="bg-white border-blue-300 text-blue-600">
                        View Invoice
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Customer Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Name</p>
                  <Link
                    href={`/accounting/customers/${payment.customer_name}`}
                    className="text-sm font-medium text-slate-900 hover:text-blue-600"
                  >
                    {payment.customer_name}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Email</p>
                  <p className="text-sm text-slate-900">{payment.customer_email}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Payment Method</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Type</p>
                  <p className="text-sm font-medium text-slate-900 capitalize">{payment.payment_method_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Card</p>
                  <p className="text-sm text-slate-900">{payment.payment_method}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Timeline</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">Created</p>
                  <p className="text-sm text-slate-900">
                    {new Date(payment.created_at).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card className="bg-white">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="activity"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <FileText className="h-4 w-4 mr-2" />
                Metadata
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Payment succeeded</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(payment.created_at).toLocaleString()}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Payment created</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(payment.created_at).toLocaleString()}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="metadata" className="p-6">
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">payment_id:</span>
                  <span className="text-slate-900">{payment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">amount:</span>
                  <span className="text-slate-900">{payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">currency:</span>
                  <span className="text-slate-900">{payment.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">status:</span>
                  <span className="text-slate-900">{payment.status}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
