"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Users, FileText } from "lucide-react"

export function RevenueBreakdownClient({ invoices }: { invoices: any[] }) {
  const paidInvoices = invoices.filter((inv) => inv.status === "paid")
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + Number.parseFloat(inv.total_amount || 0), 0)

  const monthlyRevenue = paidInvoices.reduce(
    (acc, inv) => {
      const month = new Date(inv.paid_date || inv.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      acc[month] = (acc[month] || 0) + Number.parseFloat(inv.total_amount || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const customerRevenue = paidInvoices.reduce(
    (acc, inv) => {
      const customer = inv.customers?.name || "Unknown"
      acc[customer] = (acc[customer] || 0) + Number.parseFloat(inv.total_amount || 0)
      return acc
    },
    {} as Record<string, number>,
  )

  const topCustomers = Object.entries(customerRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/accounting">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Revenue Breakdown</h1>
              <p className="text-muted-foreground mt-1">Detailed revenue analysis and insights</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground">Paid Invoices</p>
            </div>
            <p className="text-3xl font-bold">{paidInvoices.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm text-muted-foreground">Average Invoice</p>
            </div>
            <p className="text-3xl font-bold">
              $
              {paidInvoices.length > 0
                ? (totalRevenue / paidInvoices.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : 0}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Revenue by Month
            </h2>
            <div className="space-y-4">
              {Object.entries(monthlyRevenue).map(([month, amount]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{month}</span>
                  <span className="text-lg font-bold text-green-600">${amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Customers
            </h2>
            <div className="space-y-4">
              {topCustomers.map(([customer, amount]) => (
                <div key={customer} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{customer}</span>
                  <span className="text-lg font-bold text-green-600">${amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
