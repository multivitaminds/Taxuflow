"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Tag, Building, FileText, Loader, Download, Trash2 } from "lucide-react"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Expense {
  id: string
  date: string
  amount: number
  category: string
  description: string
  vendor: string
  receipt_url: string | null
  status: string
  created_at: string
}

export function ExpenseDetailClient({ expenseId }: { expenseId: string }) {
  const router = useRouter()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadExpense()
  }, [expenseId])

  async function loadExpense() {
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const { data, error } = await supabase.from("expenses").select("*").eq("id", expenseId).single()

      if (error) throw error
      setExpense(data)
    } catch (error) {
      console.error("Error loading expense:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    setDeleting(true)
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) throw new Error("Supabase not available")

      const { error } = await supabase.from("expenses").delete().eq("id", expenseId)

      if (error) throw error
      router.push("/accounting/expenses")
    } catch (error) {
      console.error("Error deleting expense:", error)
      alert("Failed to delete expense")
    } finally {
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-600"
      case "submitted":
        return "bg-blue-500/10 text-blue-600"
      case "draft":
        return "bg-gray-500/10 text-gray-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Expense not found</p>
        <Link href="/accounting/expenses">
          <Button>Back to Expenses</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <Link href="/accounting/expenses">
          <Button variant="outline" size="sm" className="gap-2 mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{expense.description}</h1>
                  <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Amount</p>
                  <p className="text-3xl font-bold text-foreground">${expense.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Date</span>
                  </div>
                  <p className="font-medium text-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm">Category</span>
                  </div>
                  <p className="font-medium text-foreground">{expense.category}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">Vendor</span>
                  </div>
                  <p className="font-medium text-foreground">{expense.vendor || "Not specified"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Created</span>
                  </div>
                  <p className="font-medium text-foreground">{new Date(expense.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            {/* Receipt */}
            {expense.receipt_url && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Receipt</h3>
                <a
                  href={expense.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline"
                >
                  <Download className="h-4 w-4" />
                  Download Receipt
                </a>
              </Card>
            )}
          </div>

          {/* Actions Sidebar */}
          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="destructive" className="w-full gap-2" onClick={handleDelete} disabled={deleting}>
                  <Trash2 className="h-4 w-4" />
                  Delete Expense
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
