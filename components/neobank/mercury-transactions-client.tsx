"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  ChevronDown,
  Filter,
  Download,
  FileText,
  Upload,
  X,
  ArrowUpDown,
  MoreHorizontal,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react"
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
  const [showAmounts, setShowAmounts] = useState(true)

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

  const formatAmount = (amount: number, mask = false) => {
    if (mask) {
      return amount < 0 ? "-$•••••" : "$•••••"
    }
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
    <div className="space-y-0">
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-b border-slate-200/80 px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
              <p className="text-sm text-slate-600">Account activity</p>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 h-8 text-xs bg-white/60 backdrop-blur-sm border-slate-200/50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-0.5">Net Change</div>
              <div className={cn("text-xl font-bold", summary.netChange >= 0 ? "text-emerald-600" : "text-red-600")}>
                {formatAmount(summary.netChange, !showAmounts)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-0.5">Money In</div>
              <div className="text-xl font-bold text-emerald-600">{formatAmount(summary.moneyIn, !showAmounts)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-0.5">Money Out</div>
              <div className="text-xl font-bold text-slate-600">{formatAmount(summary.moneyOut, !showAmounts)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="h-8 text-xs w-32 bg-white/80 border-slate-200/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 bg-white/80 border-slate-200/70">
            <Calendar className="h-3 w-3 mr-1.5" />
            Date Range
          </Button>

          <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 bg-white/80 border-slate-200/70">
            <Filter className="h-3 w-3 mr-1.5" />
            Filters
          </Button>

          <div className="flex-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAmounts(!showAmounts)}
            className="h-8 text-xs px-2.5 bg-white/80 border-slate-200/70 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            title={showAmounts ? "Hide dollar amounts" : "Show dollar amounts"}
          >
            {showAmounts ? <Eye className="h-3 w-3 mr-1.5" /> : <EyeOff className="h-3 w-3 mr-1.5" />}
            {showAmounts ? "Hide" : "Show"}
          </Button>

          <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 bg-white/80 border-slate-200/70">
            <FileText className="h-3 w-3 mr-1.5" />
            Match
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 bg-white/80 border-slate-200/70">
            <Download className="h-3 w-3 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white">
        <div className="hidden md:grid grid-cols-[80px_1.8fr_110px_100px_90px_90px_80px] gap-3 px-4 py-2 text-[10px] text-slate-500 uppercase font-semibold tracking-wide border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
          <button className="flex items-center gap-0.5 hover:text-slate-900 transition-colors text-left">
            <span>Date</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <div>Description</div>
          <button className="flex items-center gap-0.5 hover:text-slate-900 transition-colors text-right justify-end">
            <span>Amount</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
          <div>Account</div>
          <div>Method</div>
          <div>Category</div>
          <div className="text-center">Status</div>
        </div>

        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              <div className="animate-spin h-6 w-6 border-3 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-xs">Loading...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <FileText className="h-8 w-8 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-900 mb-1">No transactions found</p>
              <p className="text-xs">Adjust your filters</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedTransaction(tx.id)}
                className="grid grid-cols-1 md:grid-cols-[80px_1.8fr_110px_100px_90px_90px_80px] gap-3 px-4 py-2.5 hover:bg-indigo-50/40 cursor-pointer transition-all duration-150 group border-l-2 border-transparent hover:border-indigo-400"
              >
                <div className="text-xs text-slate-600 font-medium">{formatDate(tx.created_at)}</div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-sm",
                      tx.amount > 0
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600",
                    )}
                  >
                    {(tx.description || "T").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate leading-tight">
                      {tx.description || "Transaction"}
                    </div>
                    <div className="text-xs text-slate-500 truncate leading-tight">{tx.category || "General"}</div>
                  </div>
                </div>

                <div
                  className={cn(
                    "text-sm font-bold text-right tabular-nums",
                    tx.amount > 0 ? "text-emerald-600" : "text-slate-900",
                  )}
                >
                  {formatAmount(tx.amount, !showAmounts)}
                </div>

                <div className="text-xs text-slate-600">{tx.account_type === "checking" ? "Checking" : "Savings"}</div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded",
                      tx.method === "Wire"
                        ? "bg-purple-100 text-purple-700"
                        : tx.method === "Card"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {tx.method || "ACH"}
                  </span>
                </div>

                <div className="text-xs text-slate-600 truncate">{tx.category || "General"}</div>

                <div className="flex items-center justify-center">
                  <Badge
                    variant={tx.status === "completed" ? "default" : "secondary"}
                    className={cn(
                      "text-[10px] px-2 py-0 h-5",
                      tx.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-700",
                    )}
                  >
                    {tx.status || "Completed"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white border-l border-slate-200 shadow-2xl z-50 overflow-y-auto">
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900">Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)} className="h-7 w-7 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Transaction ID</div>
                <div className="font-mono text-xs text-slate-900">{selectedTransaction}</div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-transparent">
                <Upload className="h-3 w-3 mr-2" />
                Upload Receipt
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-transparent">
                <MoreHorizontal className="h-3 w-3 mr-2" />
                More Actions
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
