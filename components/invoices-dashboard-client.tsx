"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Receipt, Plus, ArrowLeft, TrendingUp, Clock, CheckCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface InvoicesDashboardClientProps {
  user: User
}

export function InvoicesDashboardClient({ user }: InvoicesDashboardClientProps) {
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
              <h1 className="text-4xl font-bold mb-2">Invoicing</h1>
              <p className="text-muted-foreground">Create professional invoices and get paid faster</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/accounting/invoices/new")}
            className="bg-neon hover:bg-neon/90 text-background"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
            <div className="text-sm text-muted-foreground">Outstanding</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Awaiting Payment</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Paid</span>
            </div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-neon" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-neon">$0</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-6">Create your first invoice to start getting paid</p>
            <Button
              onClick={() => router.push("/accounting/invoices/new")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Invoice
            </Button>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="p-4 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer"
            onClick={() => router.push("/services/invoicing")}
          >
            <h3 className="font-semibold mb-2">Learn About Invoicing</h3>
            <p className="text-sm text-muted-foreground">Discover features and best practices</p>
          </Card>
          <Card
            className="p-4 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer"
            onClick={() => router.push("/accounting/customers")}
          >
            <h3 className="font-semibold mb-2">Manage Customers</h3>
            <p className="text-sm text-muted-foreground">Add customers to invoice</p>
          </Card>
          <Card
            className="p-4 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer"
            onClick={() => router.push("/accounting/reports")}
          >
            <h3 className="font-semibold mb-2">View Reports</h3>
            <p className="text-sm text-muted-foreground">Track your revenue and payments</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
