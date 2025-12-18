"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Mail,
  Printer,
  Share2,
  Edit,
  Trash2,
  Check,
  Clock,
  DollarSign,
  FileText,
  User,
  Calendar,
  CreditCard,
  MessageSquare,
  History,
  Send,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function InvoiceDetailClient({ invoiceId }: { invoiceId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")

  // Mock invoice data
  const invoice = {
    id: invoiceId,
    number: `INV-${invoiceId.padStart(4, "0")}`,
    status: "sent",
    customer: {
      name: "Acme Corporation",
      email: "billing@acme.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business St, San Francisco, CA 94102",
    },
    issueDate: "2024-01-10",
    dueDate: "2024-02-10",
    amount: 12500,
    amountPaid: 0,
    currency: "USD",
    items: [
      {
        id: 1,
        description: "Web Development Services",
        quantity: 40,
        rate: 150,
        amount: 6000,
      },
      {
        id: 2,
        description: "UI/UX Design",
        quantity: 30,
        rate: 120,
        amount: 3600,
      },
      {
        id: 3,
        description: "Consulting Services",
        quantity: 15,
        rate: 200,
        amount: 3000,
      },
    ],
    notes: "Thank you for your business. Payment is due within 30 days.",
    terms: "Net 30",
  }

  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-15",
      amount: 5000,
      method: "Bank Transfer",
      reference: "TXN-001234",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-20",
      amount: 3000,
      method: "Credit Card",
      reference: "TXN-001235",
      status: "completed",
    },
  ]

  const activityLog = [
    { id: 1, action: "Invoice created", user: "John Doe", date: "2024-01-10 09:30 AM" },
    { id: 2, action: "Invoice sent to customer", user: "System", date: "2024-01-10 09:35 AM" },
    { id: 3, action: "Invoice viewed by customer", user: "Customer", date: "2024-01-10 02:15 PM" },
    {
      id: 4,
      action: "Payment reminder sent",
      user: "System",
      date: "2024-01-25 10:00 AM",
    },
  ]

  const handleSendReminder = () => {
    toast({
      title: "Reminder Sent",
      description: "Payment reminder email has been sent to the customer.",
    })
  }

  const handleMarkPaid = () => {
    toast({
      title: "Invoice Marked as Paid",
      description: "The invoice has been marked as paid.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{invoice.number}</h1>
                <Badge
                  variant={invoice.status === "paid" ? "default" : invoice.status === "sent" ? "secondary" : "outline"}
                  className="text-sm"
                >
                  {invoice.status}
                </Badge>
              </div>
              <p className="mt-1 text-slate-600">{invoice.customer.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSendReminder}>
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button onClick={handleMarkPaid}>
              <Check className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">${invoice.amount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-3">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Amount Paid</p>
                  <p className="text-2xl font-bold text-emerald-600">${invoice.amountPaid.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Balance Due</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ${(invoice.amount - invoice.amountPaid).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-50 p-3">
                  <Calendar className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Due Date</p>
                  <p className="text-lg font-bold text-slate-900">{invoice.dueDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Description</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Qty</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Rate</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {invoice.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-900">{item.description}</td>
                            <td className="px-4 py-3 text-right text-sm text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-sm text-slate-600">${item.rate}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                              ${item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium">
                            Subtotal:
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold">${invoice.amount.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium">
                            Total:
                          </td>
                          <td className="px-4 py-3 text-right text-lg font-bold text-blue-600">
                            ${invoice.amount.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {invoice.notes && (
                    <div className="mt-6 rounded-lg bg-slate-50 p-4">
                      <h4 className="text-sm font-medium text-slate-900">Notes</h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{invoice.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{invoice.customer.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{invoice.customer.email}</p>
                      <p className="text-sm text-slate-600">{invoice.customer.phone}</p>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-slate-500">Billing Address</p>
                      <p className="mt-1 text-sm text-slate-600">{invoice.customer.address}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => router.push(`/accounting/customers/${invoice.customer.name}`)}
                    >
                      View Customer Profile
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Issue Date</span>
                      <span className="font-medium text-slate-900">{invoice.issueDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Due Date</span>
                      <span className="font-medium text-slate-900">{invoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Payment Terms</span>
                      <span className="font-medium text-slate-900">{invoice.terms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Currency</span>
                      <span className="font-medium text-slate-900">{invoice.currency}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() => router.push(`/accounting/invoices/${invoiceId}/edit`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Invoice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={handleSendReminder}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Reminder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent"
                      onClick={() => router.push(`/accounting/invoices/${invoiceId}/duplicate`)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Duplicate Invoice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-rose-600 hover:text-rose-700 bg-transparent"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Invoice
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment History</CardTitle>
                  <Button size="sm" onClick={() => router.push(`/accounting/invoices/${invoiceId}/record-payment`)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {paymentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-emerald-50 p-3">
                            <CreditCard className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{payment.method}</p>
                            <p className="text-sm text-slate-600">
                              {payment.date} • {payment.reference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">${payment.amount.toLocaleString()}</p>
                          <Badge variant="default" className="text-xs">
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <CreditCard className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-sm font-medium text-slate-900">No payments recorded</h3>
                    <p className="mt-2 text-sm text-slate-600">Record the first payment for this invoice.</p>
                    <Button
                      className="mt-4"
                      size="sm"
                      onClick={() => router.push(`/accounting/invoices/${invoiceId}/record-payment`)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Record Payment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-blue-100 p-2">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        </div>
                        {idx < activityLog.length - 1 && <div className="h-full w-px bg-slate-200" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-slate-900">{activity.action}</p>
                        <p className="mt-1 text-sm text-slate-600">
                          by {activity.user} • {activity.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Email Communications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Mail className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-sm font-medium text-slate-900">No emails sent yet</h3>
                  <p className="mt-2 text-sm text-slate-600">Send this invoice to your customer via email.</p>
                  <Button className="mt-4" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invoice Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
