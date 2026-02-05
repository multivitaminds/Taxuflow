"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface Payment {
  id: string
  amount: number
  currency: string
  status: "succeeded" | "pending" | "failed" | "refunded"
  customer_email: string
  created_at: string
  description: string
  payment_method: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPayments = async () => {
      const supabase = getSupabaseBrowserClient()

      // In a real app, we would fetch from a 'payments' table or Stripe API
      // For now, we'll mock some data mixed with invoice data if available

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // Mock data for demonstration
      const mockPayments: Payment[] = [
        {
          id: "py_1",
          amount: 1250.0,
          currency: "USD",
          status: "succeeded",
          customer_email: "alice@example.com",
          created_at: new Date().toISOString(),
          description: "Web Design Services",
          payment_method: "Visa •••• 4242",
        },
        {
          id: "py_2",
          amount: 450.0,
          currency: "USD",
          status: "pending",
          customer_email: "bob@example.com",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          description: "Consultation",
          payment_method: "Mastercard •••• 5555",
        },
        {
          id: "py_3",
          amount: 2400.0,
          currency: "USD",
          status: "succeeded",
          customer_email: "charlie@example.com",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          description: "Q1 Retainer",
          payment_method: "Visa •••• 4242",
        },
        {
          id: "py_4",
          amount: 120.0,
          currency: "USD",
          status: "failed",
          customer_email: "dave@example.com",
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
          created_at: new Date(Date.now() - 345600000).toISOString(),
          description: "Logo Design",
          payment_method: "Visa •••• 4242",
        },
      ]

      setPayments(mockPayments)
      setLoading(false)
    }

    fetchPayments()
  }, [])

  const filteredPayments = payments.filter(
    (payment) =>
      payment.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalVolume = payments.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0)

  const pendingVolume = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-2">Manage your transactions, refunds, and payouts.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5851df] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Payment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Total Volume</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">
              ${totalVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-green-500 font-medium flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">from last month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Pending</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">
              ${pendingVolume.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {payments.filter((p) => p.status === "pending").length} transactions
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">processing</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Success Rate</h3>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">
              {((payments.filter((p) => p.status === "succeeded").length / payments.length) * 100).toFixed(0)}%
            </div>
            <span className="text-xs text-green-500 font-medium flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.1%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">from last month</p>
        </Card>
      </div>

      <Card>
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 pl-0"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading payments...
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    ${payment.amount.toFixed(2)}{" "}
                    <span className="text-muted-foreground text-xs">{payment.currency}</span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${
                        payment.status === "succeeded"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : payment.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {payment.status}
                    </div>
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{payment.customer_email}</span>
                      <span className="text-xs text-muted-foreground">{payment.payment_method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Download receipt</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Refund payment</DropdownMenuItem>
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
