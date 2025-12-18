"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface CreditMemo {
  id: string
  memo_number: string
  customer_name: string
  date: string
  amount: number
  remaining_credit: number
  status: "open" | "applied" | "void"
}

export function CreditMemosClient() {
  const [creditMemos, setCreditMemos] = useState<CreditMemo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadCreditMemos()
  }, [])

  async function loadCreditMemos() {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("credit_memos")
      .select(`
        *,
        customers (company_name, first_name, last_name)
      `)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setCreditMemos(
        data.map((memo: any) => ({
          id: memo.id,
          memo_number: memo.memo_number,
          customer_name:
            memo.customers?.company_name || `${memo.customers?.first_name} ${memo.customers?.last_name}` || "Unknown",
          date: memo.memo_date,
          amount: memo.total_amount,
          remaining_credit: memo.remaining_credit,
          status: memo.status,
        })),
      )
    }
    setLoading(false)
  }

  const filteredMemos = creditMemos.filter(
    (memo) =>
      memo.memo_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: creditMemos.length,
    open: creditMemos.filter((m) => m.status === "open").length,
    totalCredit: creditMemos.reduce((sum, m) => sum + m.amount, 0),
    remainingCredit: creditMemos.reduce((sum, m) => sum + m.remaining_credit, 0),
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "applied":
        return "bg-blue-100 text-blue-800"
      case "void":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Credit Memos</h1>
          <p className="text-muted-foreground">Manage customer credits and refunds</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Credit Memo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Memos</div>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Open</div>
          <div className="mt-2 text-2xl font-bold">{stats.open}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Total Credit</div>
          <div className="mt-2 text-2xl font-bold">${stats.totalCredit.toLocaleString()}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm font-medium text-muted-foreground">Remaining</div>
          <div className="mt-2 text-2xl font-bold">${stats.remainingCredit.toLocaleString()}</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search credit memos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredMemos.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No credit memos found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm ? "Try adjusting your search" : "Create your first credit memo to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left text-sm font-medium">Memo #</th>
                  <th className="pb-3 text-left text-sm font-medium">Customer</th>
                  <th className="pb-3 text-left text-sm font-medium">Date</th>
                  <th className="pb-3 text-right text-sm font-medium">Amount</th>
                  <th className="pb-3 text-right text-sm font-medium">Remaining</th>
                  <th className="pb-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemos.map((memo) => (
                  <tr key={memo.id} className="border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                    <td className="py-3 text-sm font-medium">{memo.memo_number}</td>
                    <td className="py-3 text-sm">{memo.customer_name}</td>
                    <td className="py-3 text-sm">{new Date(memo.date).toLocaleDateString()}</td>
                    <td className="py-3 text-right text-sm font-medium">${memo.amount.toLocaleString()}</td>
                    <td className="py-3 text-right text-sm font-medium">${memo.remaining_credit.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge className={getStatusColor(memo.status)}>{memo.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
