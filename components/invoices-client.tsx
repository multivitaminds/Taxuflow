"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Send, Eye, FileText, DollarSign, Calendar, User } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      console.log("[v0] Loading invoices...")
      const supabase = getSupabaseBooksClient()

      if (!supabase) {
        console.log("[v0] No Supabase client available")
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          contact:contacts(
            company_name,
            contact_name,
            display_name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error loading invoices:", error.message)
        throw error
      }

      console.log("[v0] Invoices loaded:", data?.length || 0)
      setInvoices(data || [])
    } catch (error: any) {
      console.error("Error loading invoices:", error.message || error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.contact?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.contact?.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || invoice.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0),
    unpaidAmount: invoices.filter((i) => i.status !== "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Invoices</h1>
              <p className="text-muted-foreground">Create and manage your invoices</p>
            </div>
            <Link href="/accounting/invoices/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Invoice
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Unpaid</p>
                  <p className="text-2xl font-bold text-orange-500">${stats.unpaidAmount.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                  <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
                </div>
                <FileText className="h-8 w-8 text-red-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filterStatus === "draft" ? "default" : "outline"}
              onClick={() => setFilterStatus("draft")}
              size="sm"
            >
              Draft ({stats.draft})
            </Button>
            <Button
              variant={filterStatus === "sent" ? "default" : "outline"}
              onClick={() => setFilterStatus("sent")}
              size="sm"
            >
              Sent ({stats.sent})
            </Button>
            <Button
              variant={filterStatus === "paid" ? "default" : "outline"}
              onClick={() => setFilterStatus("paid")}
              size="sm"
            >
              Paid ({stats.paid})
            </Button>
            <Button
              variant={filterStatus === "overdue" ? "default" : "outline"}
              onClick={() => setFilterStatus("overdue")}
              size="sm"
            >
              Overdue ({stats.overdue})
            </Button>
          </div>
        </div>

        {/* Invoices List */}
        <Card className="border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      Loading invoices...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No invoices found</p>
                      <Link href="/accounting/invoices/new">
                        <Button size="sm">Create your first invoice</Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <Link
                          href={`/accounting/invoices/${invoice.id}`}
                          className="font-medium text-foreground hover:text-accent"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {invoice.contact?.company_name ||
                              invoice.contact?.display_name ||
                              invoice.contact?.contact_name ||
                              "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-muted-foreground">{new Date(invoice.due_date).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-foreground">${invoice.total_amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/accounting/invoices/${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
