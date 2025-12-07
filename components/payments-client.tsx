"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DollarSign,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  CreditCard,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

interface Payment {
  id: string
  amount: number
  currency: string
  status: "succeeded" | "pending" | "failed" | "refunded"
  customer_email: string
  customer_name: string
  created_at: string
  description: string
  payment_method: string
  invoice_id?: string
}

export function PaymentsClient() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: "py_1",
        amount: 1250.0,
        currency: "USD",
        status: "succeeded",
        customer_email: "alice@example.com",
        customer_name: "Alice Johnson",
        created_at: new Date().toISOString(),
        description: "Web Design Services",
        payment_method: "Visa •••• 4242",
        invoice_id: "INV-001",
      },
      {
        id: "py_2",
        amount: 450.0,
        currency: "USD",
        status: "pending",
        customer_email: "bob@example.com",
        customer_name: "Bob Smith",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        description: "Consultation Fee",
        payment_method: "Mastercard •••• 5555",
        invoice_id: "INV-002",
      },
      {
        id: "py_3",
        amount: 2400.0,
        currency: "USD",
        status: "succeeded",
        customer_email: "charlie@example.com",
        customer_name: "Charlie Brown",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        description: "Q1 Retainer Payment",
        payment_method: "Visa •••• 4242",
        invoice_id: "INV-003",
      },
      {
        id: "py_4",
        amount: 120.0,
        currency: "USD",
        status: "failed",
        customer_email: "dave@example.com",
        customer_name: "Dave Wilson",
        created_at: new Date(Date.now() - 259200000).toISOString(),
        description: "Hosting Fee",
        payment_method: "Amex •••• 1001",
      },
      {
        id: "py_5",
        amount: 850.0,
        currency: "USD",
        status: "succeeded",
        customer_email: "eve@example.com",
        customer_name: "Eve Martinez",
        created_at: new Date(Date.now() - 345600000).toISOString(),
        description: "Logo Design Package",
        payment_method: "Visa •••• 4242",
        invoice_id: "INV-005",
      },
    ]

    setPayments(mockPayments)
    setLoading(false)
  }, [])

  const filteredPayments = payments.filter(
    (payment) =>
      payment.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalVolume = payments.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0)
  const pendingVolume = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const failedCount = payments.filter((p) => p.status === "failed").length
  const successRate =
    payments.length > 0 ? (payments.filter((p) => p.status === "succeeded").length / payments.length) * 100 : 0

  const handleRefund = (paymentId: string) => {
    toast.success("Refund initiated for payment " + paymentId)
  }

  const quickActions = [
    {
      title: "Payment Gateway",
      description: "Configure payment methods",
      icon: CreditCard,
      href: "/accounting/payments/gateway",
      color: "blue",
    },
    {
      title: "Refund Management",
      description: "Process and track refunds",
      icon: RefreshCw,
      href: "/accounting/payments/refunds",
      color: "purple",
    },
    {
      title: "Payment Analytics",
      description: "Revenue insights and trends",
      icon: TrendingUp,
      href: "/accounting/payments/analytics",
      color: "green",
    },
    {
      title: "Failed Payments",
      description: "Review and retry failed transactions",
      icon: AlertCircle,
      href: "/accounting/payments/failed",
      color: "red",
    },
  ]

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payments</h1>
          <p className="text-slate-600 mt-2">Manage transactions, refunds, and payment methods</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-slate-300">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/accounting/payments/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Payment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/accounting/payments/volume">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Total Volume</h3>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +12.5% from last month
            </p>
          </Card>
        </Link>
        <Link href="/accounting/payments/pending">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Pending</h3>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">
              ${pendingVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {payments.filter((p) => p.status === "pending").length} transactions processing
            </p>
          </Card>
        </Link>
        <Link href="/accounting/payments/success">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Success Rate</h3>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{successRate.toFixed(0)}%</div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +2.1% improvement
            </p>
          </Card>
        </Link>
        <Link href="/accounting/payments/failed">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-slate-600">Failed</h3>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900">{failedCount}</div>
            <p className="text-xs text-slate-500 mt-2">requires attention</p>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="p-5 bg-white hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group border border-slate-200">
                  <div
                    className={`p-3 rounded-xl ${colorClasses[action.color as keyof typeof colorClasses]} inline-flex mb-3`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-slate-500">{action.description}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <Card className="bg-white shadow-md">
        <div className="p-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 pl-0"
            />
          </div>
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                  Loading payments...
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="font-medium text-slate-700 mb-2">No payments found</p>
                  <p className="text-sm text-slate-500 mb-4">Create your first payment to get started</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Payment
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-900">
                    ${payment.amount.toFixed(2)}{" "}
                    <span className="text-slate-500 text-xs font-normal">{payment.currency}</span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        payment.status === "succeeded"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : payment.status === "pending"
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : payment.status === "failed"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {payment.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/accounting/payments/${payment.id}`}
                      className="text-slate-900 hover:text-blue-600 transition-colors font-medium"
                    >
                      {payment.description}
                    </Link>
                    {payment.invoice_id && (
                      <p className="text-xs text-slate-500 mt-0.5">Invoice: {payment.invoice_id}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/accounting/customers/${payment.customer_name}`}
                        className="text-sm text-slate-900 hover:text-blue-600 transition-colors font-medium"
                      >
                        {payment.customer_name}
                      </Link>
                      <span className="text-xs text-slate-500">{payment.customer_email}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{payment.payment_method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {new Date(payment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Link href={`/accounting/payments/${payment.id}`} className="flex items-center w-full">
                            View details
                            <ArrowUpRight className="h-3 w-3 ml-auto" />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Download receipt</DropdownMenuItem>
                        {payment.invoice_id && (
                          <DropdownMenuItem>
                            <Link href={`/accounting/invoices/${payment.invoice_id}`}>View invoice</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {payment.status === "succeeded" && (
                          <DropdownMenuItem className="text-red-600" onClick={() => handleRefund(payment.id)}>
                            Refund payment
                          </DropdownMenuItem>
                        )}
                        {payment.status === "failed" && (
                          <DropdownMenuItem className="text-blue-600">Retry payment</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
