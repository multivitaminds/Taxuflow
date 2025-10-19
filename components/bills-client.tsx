"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

interface Bill {
  id: string
  bill_number: string
  vendor_id: string
  vendors?: { company_name: string }
  bill_date: string
  due_date: string
  total_amount: number
  amount_paid: number
  status: "draft" | "open" | "paid" | "overdue" | "partial"
  notes?: string
  created_at: string
}

export function BillsClient() {
  const router = useRouter()
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"draft" | "open" | "paid" | "overdue" | "partial" | null>(null)

  useEffect(() => {
    loadBills()
  }, [])

  useEffect(() => {
    loadBills()
  }, [filterStatus])

  async function loadBills() {
    const supabase = getSupabaseBooksClient()

    if (!supabase) {
      setLoading(false)
      return
    }

    let query = supabase
      .from("bills")
      .select("*, vendors:contacts!vendor_id(company_name)")
      .order("bill_date", { ascending: false })

    if (filterStatus) {
      query = query.filter("status", "eq", filterStatus)
    }

    const { data, error } = await query

    if (!error && data) {
      setBills(data)
    }
    setLoading(false)
  }

  const filteredBills = bills.filter(
    (bill) =>
      bill.bill_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.vendors?.company_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      draft: { variant: "secondary", icon: Clock },
      open: { variant: "default", icon: Receipt },
      paid: { variant: "default", icon: CheckCircle2 },
      overdue: { variant: "destructive", icon: AlertCircle },
      partial: { variant: "secondary", icon: DollarSign },
    }
    const config = variants[status] || variants.draft
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const stats = {
    total: bills.reduce((sum, b) => sum + b.total_amount, 0),
    paid: bills.reduce((sum, b) => sum + b.amount_paid, 0),
    outstanding: bills.reduce((sum, b) => sum + (b.total_amount - b.amount_paid), 0),
    overdue: bills.filter((b) => b.status === "overdue").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/accounting")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Bills & Payables</h1>
                <p className="text-sm text-muted-foreground">Track and pay vendor bills</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => router.push("/accounting/bills/new")}>
                <Plus className="mr-2 h-4 w-4" />
                New Bill
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
                <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-green-600">${stats.paid.toLocaleString()}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">${stats.outstanding.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>

        <Card>
          <div className="border-b p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus(null)}>
                <Filter className="mr-2 h-4 w-4" />
                All
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus("draft")}>
                <Filter className="mr-2 h-4 w-4" />
                Draft
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus("open")}>
                <Filter className="mr-2 h-4 w-4" />
                Open
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus("paid")}>
                <Filter className="mr-2 h-4 w-4" />
                Paid
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus("overdue")}>
                <Filter className="mr-2 h-4 w-4" />
                Overdue
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterStatus("partial")}>
                <Filter className="mr-2 h-4 w-4" />
                Partial
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading bills...
                  </TableCell>
                </TableRow>
              ) : filteredBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <div className="py-12">
                      <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No bills yet</h3>
                      <p className="text-sm text-muted-foreground">Add your first bill to track payables</p>
                      <Button className="mt-4" onClick={() => router.push("/accounting/bills/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Bill
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBills.map((bill) => (
                  <TableRow
                    key={bill.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/accounting/bills/${bill.id}`)}
                  >
                    <TableCell className="font-medium">{bill.bill_number}</TableCell>
                    <TableCell>{bill.vendors?.company_name || "—"}</TableCell>
                    <TableCell>{new Date(bill.bill_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>${bill.total_amount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">${bill.amount_paid.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">
                      ${(bill.total_amount - bill.amount_paid).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
