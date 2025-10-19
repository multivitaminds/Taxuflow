"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Upload,
  Eye,
  Edit,
  Trash2,
  Receipt,
  DollarSign,
  Calendar,
  Tag,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

export function ExpensesClient() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    try {
      const supabase = getSupabaseBooksClient()

      if (!supabase) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*, accounts(name)")
        .eq("entry_type", "expense")
        .order("entry_date", { ascending: false })

      if (error) throw error
      setExpenses(data || [])
    } catch (error) {
      console.error("Error loading expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", "office", "travel", "meals", "utilities", "software", "marketing", "other"]

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.accounts?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterCategory === "all" || expense.accounts?.name === filterCategory
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: expenses.length,
    totalAmount: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    thisMonth: expenses
      .filter((e) => new Date(e.entry_date).getMonth() === new Date().getMonth())
      .reduce((sum, e) => sum + (e.amount || 0), 0),
    lastMonth: expenses
      .filter((e) => new Date(e.entry_date).getMonth() === new Date().getMonth() - 1)
      .reduce((sum, e) => sum + (e.amount || 0), 0),
  }

  const percentChange = stats.lastMonth > 0 ? ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Expenses</h1>
              <p className="text-muted-foreground">Track and categorize your business expenses</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Upload className="h-5 w-5" />
                Upload Receipt
              </Button>
              <Link href="/accounting/expenses/new">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Expense
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-500" />
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
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-2xl font-bold text-foreground">${stats.thisMonth.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">vs Last Month</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${percentChange >= 0 ? "text-red-500" : "text-green-500"}`}>
                      {Math.abs(percentChange).toFixed(1)}%
                    </p>
                    {percentChange >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-red-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
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
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                onClick={() => setFilterCategory(category)}
                size="sm"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Expenses List */}
        <Card className="border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Receipt</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-muted-foreground">
                      Loading expenses...
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-8">
                      <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No expenses found</p>
                      <Link href="/accounting/expenses/new">
                        <Button size="sm">Add your first expense</Button>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-4 text-muted-foreground">{new Date(expense.entry_date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Link
                          href={`/accounting/expenses/${expense.id}`}
                          className="font-medium text-foreground hover:text-accent"
                        >
                          {expense.description}
                        </Link>
                      </td>
                      <td className="p-4 text-muted-foreground">{expense.accounts?.name || "—"}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {expense.accounts?.name || "Uncategorized"}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-foreground">${expense.amount?.toLocaleString()}</td>
                      <td className="p-4">
                        {expense.receipt_url ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Has Receipt</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            No Receipt
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/accounting/expenses/${expense.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
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
