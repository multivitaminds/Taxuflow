"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Send, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

interface Estimate {
  id: string
  estimate_number: string
  customer_id: string
  customers?: { company_name: string; contact_name: string }
  estimate_date: string
  expiry_date: string
  total_amount: number
  status: "draft" | "sent" | "accepted" | "declined" | "expired"
  created_at: string
}

export default function EstimatesClient() {
  const router = useRouter()
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadEstimates()
  }, [])

  async function loadEstimates() {
    const supabase = getSupabaseBooksClient()

    if (!supabase) {
      setLoading(false)
      return
    }

    // For now, we'll create a placeholder until estimates table is added
    const { data, error } = await supabase
      .from("invoices")
      .select("*, customers:contacts(company_name, contact_name)")
      .eq("status", "draft")
      .order("invoice_date", { ascending: false })

    if (!error && data) {
      // Map invoices to estimates format
      const mappedEstimates = data.map((inv: any) => ({
        ...inv,
        estimate_number: inv.invoice_number,
        estimate_date: inv.invoice_date,
        expiry_date: inv.due_date,
      }))
      setEstimates(mappedEstimates)
    }
    setLoading(false)
  }

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.estimate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.customers?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.customers?.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || estimate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: estimates.length,
    sent: estimates.filter((e) => e.status === "sent").length,
    accepted: estimates.filter((e) => e.status === "accepted").length,
    totalValue: estimates.reduce((sum, e) => sum + e.total_amount, 0),
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
      case "expired":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="h-4 w-4" />
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "declined":
        return <XCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/accounting")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Estimates & Quotes</h1>
                <p className="text-sm text-muted-foreground">Create and manage customer estimates</p>
              </div>
            </div>
            <Button onClick={() => router.push("/accounting/estimates/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Estimate
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Estimates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <Send className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search estimates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => setStatusFilter("draft")}
              >
                Draft
              </Button>
              <Button variant={statusFilter === "sent" ? "default" : "outline"} onClick={() => setStatusFilter("sent")}>
                Sent
              </Button>
              <Button
                variant={statusFilter === "accepted" ? "default" : "outline"}
                onClick={() => setStatusFilter("accepted")}
              >
                Accepted
              </Button>
            </div>
          </div>
        </Card>

        {/* Estimates Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium">Estimate #</th>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Expiry Date</th>
                  <th className="p-4 text-right font-medium">Amount</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      Loading estimates...
                    </td>
                  </tr>
                ) : filteredEstimates.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold">No estimates yet</h3>
                          <p className="text-sm text-muted-foreground">Create your first estimate to get started</p>
                        </div>
                        <Button onClick={() => router.push("/accounting/estimates/new")}>
                          <Plus className="mr-2 h-4 w-4" />
                          New Estimate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEstimates.map((estimate) => (
                    <tr
                      key={estimate.id}
                      className="cursor-pointer border-b hover:bg-muted/50"
                      onClick={() => router.push(`/accounting/estimates/${estimate.id}`)}
                    >
                      <td className="p-4 font-medium">{estimate.estimate_number}</td>
                      <td className="p-4">
                        {estimate.customers?.company_name || estimate.customers?.contact_name || "—"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(estimate.estimate_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(estimate.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right font-medium">${estimate.total_amount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className={`gap-1 ${getStatusColor(estimate.status)}`}>
                          {getStatusIcon(estimate.status)}
                          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/accounting/estimates/${estimate.id}`)
                          }}
                        >
                          View
                        </Button>
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
