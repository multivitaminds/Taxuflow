"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreditCard, ArrowDownRight, ArrowUpRight, PiggyBank, Search, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const transactions = [
  { id: "txn_1", merchant: "AWS Web Services", amount: -2450.0, date: "Feb 10, 2026 2:45 PM", type: "purchase", status: "pending", category: "Software" },
  { id: "txn_2", merchant: "Client Payment - Stripe Payout", amount: 12500.0, date: "Feb 9, 2026", type: "deposit", status: "completed", category: "Income" },
  { id: "txn_3", merchant: "WeWork Office", amount: -4500.0, date: "Feb 8, 2026", type: "purchase", status: "completed", category: "Rent" },
  { id: "txn_4", merchant: "Tax Bucket Auto-Transfer", amount: -3750.0, date: "Feb 8, 2026", type: "transfer", status: "completed", category: "Tax" },
  { id: "txn_5", merchant: "Apple Store", amount: -2199.0, date: "Feb 6, 2026", type: "purchase", status: "completed", category: "Equipment" },
  { id: "txn_6", merchant: "Uber Eats", amount: -34.5, date: "Feb 5, 2026", type: "purchase", status: "completed", category: "Meals" },
  { id: "txn_7", merchant: "Figma Subscription", amount: -15.0, date: "Feb 4, 2026", type: "purchase", status: "completed", category: "Software" },
  { id: "txn_8", merchant: "Client Payment - Invoice #1042", amount: 8750.0, date: "Feb 3, 2026", type: "deposit", status: "completed", category: "Income" },
  { id: "txn_9", merchant: "Google Workspace", amount: -12.0, date: "Feb 2, 2026", type: "purchase", status: "completed", category: "Software" },
  { id: "txn_10", merchant: "IRS Estimated Tax Payment", amount: -5000.0, date: "Feb 1, 2026", type: "transfer", status: "completed", category: "Tax" },
]

function getIcon(type: string) {
  switch (type) {
    case "deposit":
      return <div className="bg-green-100 p-2 rounded-full"><ArrowDownRight className="h-4 w-4 text-green-600" /></div>
    case "transfer":
      return <div className="bg-purple-100 p-2 rounded-full"><PiggyBank className="h-4 w-4 text-purple-600" /></div>
    default:
      return <div className="bg-orange-100 p-2 rounded-full"><CreditCard className="h-4 w-4 text-orange-600" /></div>
  }
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filtered = transactions.filter((txn) => {
    const matchesSearch = searchQuery === "" || txn.merchant.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || txn.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-slate-500 mt-1">View and search your complete transaction history.</p>
        </div>
        <Button
          variant="outline"
          className="bg-white text-[#0a2540] border-slate-200 hover:bg-slate-50"
          onClick={() => toast.success("Exporting transactions as CSV...")}
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchases</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              {filtered.length} Transaction{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filtered.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {getIcon(txn.type)}
                  <div>
                    <p className="font-medium text-sm text-[#0a2540]">{txn.merchant}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500">{txn.date}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-slate-100 text-slate-500">
                        {txn.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-medium text-sm", txn.amount > 0 ? "text-green-600" : "text-[#0a2540]")}>
                    {txn.amount > 0 ? "+" : ""}
                    {txn.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-5",
                      txn.status === "pending"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {txn.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
