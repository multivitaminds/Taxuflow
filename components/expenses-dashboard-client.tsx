"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, Plus, ArrowLeft, TrendingDown, Receipt, Calendar } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ExpensesDashboardClientProps {
  user: User
}

export function ExpensesDashboardClient({ user }: ExpensesDashboardClientProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Expense Tracking</h1>
              <p className="text-muted-foreground">Capture receipts and categorize expenses automatically</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/accounting/expenses/new")}
            className="bg-neon hover:bg-neon/90 text-background"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Expense
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Receipts</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Captured</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Categories</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-muted-foreground">Average</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-muted-foreground">Per Day</div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
            <p className="text-muted-foreground mb-6">Start tracking your business expenses</p>
            <Button
              onClick={() => router.push("/accounting/expenses/new")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Expense
            </Button>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="p-4 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer"
            onClick={() => router.push("/services/expense-tracking")}
          >
            <h3 className="font-semibold mb-2">Learn About Expense Tracking</h3>
            <p className="text-sm text-muted-foreground">Discover features and best practices</p>
          </Card>
          <Card
            className="p-4 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer"
            onClick={() => router.push("/accounting/vendors")}
          >
            <h3 className="font-semibold mb-2">Manage Vendors</h3>
            <p className="text-sm text-muted-foreground">Track who you're paying</p>
          </Card>
          <Card
            className="p-4 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer"
            onClick={() => router.push("/accounting/reports")}
          >
            <h3 className="font-semibold mb-2">View Reports</h3>
            <p className="text-sm text-muted-foreground">Analyze your spending patterns</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
