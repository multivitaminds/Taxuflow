"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronDown, Filter, Download, FileText, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const SAMPLE_TRANSACTIONS = [
  {
    id: "1",
    description: "Stripe Payment",
    amount: 4250.0,
    category: "Income",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-12-10T10:30:00Z",
  },
  {
    id: "2",
    description: "AWS Services",
    amount: -342.5,
    category: "Cloud Infrastructure",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-12-09T14:22:00Z",
  },
  {
    id: "3",
    description: "Payroll - December",
    amount: -8500.0,
    category: "Payroll",
    account_type: "checking",
    method: "Wire",
    status: "completed",
    created_at: "2025-12-08T09:00:00Z",
  },
  {
    id: "4",
    description: "Client Payment - Acme Corp",
    amount: 15000.0,
    category: "Income",
    account_type: "checking",
    method: "Wire",
    status: "completed",
    created_at: "2025-12-07T16:45:00Z",
  },
  {
    id: "5",
    description: "Office Supplies - Staples",
    amount: -234.89,
    category: "Office Expenses",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-12-06T11:20:00Z",
  },
  {
    id: "6",
    description: "Google Workspace",
    amount: -144.0,
    category: "Software",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-12-05T08:15:00Z",
  },
  {
    id: "7",
    description: "Vercel Subscription",
    amount: -250.0,
    category: "Cloud Infrastructure",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-12-04T12:00:00Z",
  },
  {
    id: "8",
    description: "Consulting Services Payment",
    amount: 7500.0,
    category: "Income",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-12-03T15:30:00Z",
  },
  {
    id: "9",
    description: "Internet - Comcast Business",
    amount: -189.99,
    category: "Utilities",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-12-02T07:00:00Z",
  },
  {
    id: "10",
    description: "LinkedIn Ads",
    amount: -500.0,
    category: "Marketing",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-12-01T10:45:00Z",
  },
  {
    id: "11",
    description: "Client Payment - TechStart Inc",
    amount: 22000.0,
    category: "Income",
    account_type: "checking",
    method: "Wire",
    status: "completed",
    created_at: "2025-11-30T14:20:00Z",
  },
  {
    id: "12",
    description: "Rent - Office Space",
    amount: -3500.0,
    category: "Rent",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-11-29T09:00:00Z",
  },
  {
    id: "13",
    description: "GitHub Enterprise",
    amount: -210.0,
    category: "Software",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-28T11:30:00Z",
  },
  {
    id: "14",
    description: "Legal Fees - Smith & Associates",
    amount: -1200.0,
    category: "Professional Services",
    account_type: "checking",
    method: "Check",
    status: "completed",
    created_at: "2025-11-27T16:00:00Z",
  },
  {
    id: "15",
    description: "Figma Team Plan",
    amount: -45.0,
    category: "Software",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-26T13:15:00Z",
  },
  {
    id: "16",
    description: "Freelance Design Work",
    amount: 3200.0,
    category: "Income",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-11-25T10:00:00Z",
  },
  {
    id: "17",
    description: "Insurance Payment",
    amount: -425.0,
    category: "Insurance",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-11-24T08:30:00Z",
  },
  {
    id: "18",
    description: "Travel - Flight to SF",
    amount: -548.0,
    category: "Travel",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-23T06:45:00Z",
  },
  {
    id: "19",
    description: "Hotel - Hyatt Regency",
    amount: -892.5,
    category: "Travel",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-22T19:30:00Z",
  },
  {
    id: "20",
    description: "Slack Business+",
    amount: -156.0,
    category: "Software",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-21T12:00:00Z",
  },
  {
    id: "21",
    description: "Client Payment - StartupXYZ",
    amount: 9500.0,
    category: "Income",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-11-20T15:20:00Z",
  },
  {
    id: "22",
    description: "Adobe Creative Cloud",
    amount: -79.99,
    category: "Software",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-19T09:45:00Z",
  },
  {
    id: "23",
    description: "Zoom Pro",
    amount: -19.99,
    category: "Software",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-18T11:00:00Z",
  },
  {
    id: "24",
    description: "Equipment Purchase - Dell",
    amount: -2340.0,
    category: "Equipment",
    account_type: "checking",
    method: "Card",
    status: "completed",
    created_at: "2025-11-17T14:30:00Z",
  },
  {
    id: "25",
    description: "Contractor Payment - John Doe",
    amount: -4500.0,
    category: "Contractor",
    account_type: "checking",
    method: "ACH",
    status: "completed",
    created_at: "2025-11-16T10:15:00Z",
  },
]

export function MercuryTransactionsClient() {
  const [transactions, setTransactions] = useState<any[]>(SAMPLE_TRANSACTIONS)
  const [loading, setLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [amountFilter, setAmountFilter] = useState("all")

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Use sample data if not authenticated
        console.log("[v0] No user found, using sample data")
        return
      }

      const { data: accounts } = await supabase.from("neobank_accounts").select("id").eq("user_id", user.id)

      if (accounts && accounts.length > 0) {
        const accountIds = accounts.map((acc) => acc.id)

        const { data, error } = await supabase
          .from("neobank_transactions")
          .select("*")
          .in("account_id", accountIds)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) {
          console.log("[v0] Error loading transactions, using sample data:", error.message)
        } else if (data && data.length > 0) {
          setTransactions(data)
        }
      }
    } catch (error: any) {
      console.log("[v0] Error loading transactions, using sample data:", error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return amount < 0 ? `-$${formatted}` : `$${formatted}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const calculateSummary = () => {
    const moneyIn = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
    const moneyOut = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const netChange = moneyIn - moneyOut

    return { moneyIn, moneyOut, netChange }
  }

  const summary = calculateSummary()

  const filteredTransactions = transactions.filter((t) => {
    if (searchQuery && !t.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (amountFilter === "income" && t.amount <= 0) return false
    if (amountFilter === "expense" && t.amount >= 0) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Transactions</h1>
        <p className="text-slate-600">View and manage your account activity</p>
      </div>

      {/* Top Bar with Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          {/* Search Bar */}
          <div className="flex-1 w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="pl-10 bg-white border-slate-300"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-slate-700 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Match Receipts
            </Button>
            <Button variant="outline" size="sm" className="text-slate-700 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="w-40 bg-white border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="text-slate-700 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>

          <Select defaultValue="date">
            <SelectTrigger className="w-32 bg-white border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="amount">By Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Net change this month</div>
          <div className={cn("text-3xl font-bold", summary.netChange >= 0 ? "text-emerald-600" : "text-red-600")}>
            {formatAmount(summary.netChange)}
          </div>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Money in</div>
          <div className="text-3xl font-bold text-emerald-600">{formatAmount(summary.moneyIn)}</div>
        </Card>
        <Card className="p-6 bg-white border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Money out</div>
          <div className="text-3xl font-bold text-red-600">{formatAmount(summary.moneyOut)}</div>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[120px_2fr_120px_120px_120px_80px] gap-4 px-6 py-3 text-xs text-slate-600 uppercase font-semibold border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-1">
            Date
            <ChevronDown className="h-3 w-3" />
          </div>
          <div>Description</div>
          <div className="text-right">Amount</div>
          <div>Account</div>
          <div>Method</div>
          <div>Status</div>
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="animate-spin h-8 w-8 border-4 border-[#635BFF] border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="font-semibold text-slate-900 mb-1">No transactions found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTransaction(tx.id)}
                className="grid grid-cols-1 md:grid-cols-[120px_2fr_120px_120px_120px_80px] gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="text-sm text-slate-900 font-medium">{formatDate(tx.created_at)}</div>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                      tx.amount > 0 ? "bg-emerald-500" : "bg-[#635BFF]",
                    )}
                  >
                    {(tx.description || "T").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{tx.description || "Transaction"}</div>
                    <div className="text-sm text-slate-500 truncate">{tx.category || "General"}</div>
                  </div>
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold text-right",
                    tx.amount > 0 ? "text-emerald-600" : "text-slate-900",
                  )}
                >
                  {formatAmount(tx.amount)}
                </div>
                <div className="text-sm text-slate-600">{tx.account_type === "checking" ? "Checking" : "Savings"}</div>
                <div className="text-sm text-slate-600">{tx.method || "ACH"}</div>
                <div>
                  <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {tx.status || "Completed"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Detail Sidebar */}
      {selectedTransaction && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white border-l border-slate-200 shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Transaction Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Transaction details would go here */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Transaction ID</div>
                <div className="font-mono text-sm text-slate-900">{selectedTransaction}</div>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="h-4 w-4 mr-2" />
                Upload Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
