"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Repeat, Plus, Search, Filter, Play, Pause, Calendar, DollarSign, ArrowLeft } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface RecurringTransaction {
  id: string
  name: string
  type: "invoice" | "expense" | "bill"
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  amount: number
  next_date: string
  status: "active" | "paused" | "completed"
  customer_id?: string
  vendor_id?: string
  customers?: { company_name: string; contact_name: string }
  vendors?: { company_name: string }
  created_at: string
}

function RecurringTransactionsClient() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadTransactions()
  }, [])

  async function loadTransactions() {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    // This feature will need to be implemented in the books schema
    setTransactions([])
    setLoading(false)
  }

  async function toggleTransactionStatus(id: string, currentStatus: string) {
    // Placeholder - will be implemented when recurring transactions are added to books schema
    return
  }

  const filteredTransactions = transactions.filter((txn) => txn.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      invoice: "bg-blue-100 text-blue-700",
      expense: "bg-orange-100 text-orange-700",
      bill: "bg-purple-100 text-purple-700",
    }
    return <Badge className={colors[type]}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      active: { variant: "default", icon: Play },
      paused: { variant: "secondary", icon: Pause },
      completed: { variant: "secondary", icon: Calendar },
    }
    const config = variants[status] || variants.active
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const stats = {
    total: transactions.length,
    active: transactions.filter((t) => t.status === "active").length,
    monthlyValue: transactions
      .filter((t) => t.status === "active" && t.frequency === "monthly")
      .reduce((sum, t) => sum + t.amount, 0),
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
                <h1 className="text-2xl font-bold">Recurring Transactions</h1>
                <p className="text-sm text-muted-foreground">Automate invoices, bills, and expenses</p>
              </div>
            </div>
            <Button onClick={() => router.push("/accounting/recurring/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Recurring Transaction
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Repeat className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Value</p>
                <p className="text-2xl font-bold">${stats.monthlyValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        <Card>
          <div className="border-b p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search recurring transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead>Customer/Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading recurring transactions...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <div className="py-12">
                      <Repeat className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No recurring transactions yet</h3>
                      <p className="text-sm text-muted-foreground">Automate your invoices, bills, and expenses</p>
                      <Button className="mt-4" onClick={() => router.push("/accounting/recurring/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((txn) => (
                  <TableRow
                    key={txn.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/accounting/recurring/${txn.id}`)}
                  >
                    <TableCell className="font-medium">{txn.name}</TableCell>
                    <TableCell>{getTypeBadge(txn.type)}</TableCell>
                    <TableCell className="capitalize">{txn.frequency}</TableCell>
                    <TableCell>${txn.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(txn.next_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {txn.customers?.company_name || txn.customers?.contact_name || txn.vendors?.company_name || "—"}
                    </TableCell>
                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTransactionStatus(txn.id, txn.status)
                          }}
                        >
                          {txn.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
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

export default RecurringTransactionsClient
