"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, AlertCircle, Clock, DollarSign } from "lucide-react"

export function OutstandingClient({ invoices }: { invoices: any[] }) {
  const totalOutstanding = invoices.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.amount_due || inv.total_amount || 0),
    0,
  )
  const overdueInvoices = invoices.filter((inv) => new Date(inv.due_date) < new Date())
  const totalOverdue = overdueInvoices.reduce(
    (sum, inv) => sum + Number.parseFloat(inv.amount_due || inv.total_amount || 0),
    0,
  )
  const dueThisWeek = invoices.filter((inv) => {
    const dueDate = new Date(inv.due_date)
    const weekFromNow = new Date()
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    return dueDate <= weekFromNow && dueDate >= new Date()
  })

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
              <h1 className="text-3xl font-bold">Outstanding Invoices</h1>
              <p className="text-muted-foreground mt-1">Track unpaid and overdue invoices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
            <p className="text-3xl font-bold text-red-600">${totalOverdue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">{overdueInvoices.length} invoices</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Due This Week</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{dueThisWeek.length}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">All Outstanding Invoices</h2>
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No outstanding invoices</p>
                <p className="text-sm">All invoices are paid or cancelled</p>
              </div>
            ) : (
              invoices.map((invoice) => {
                const isOverdue = new Date(invoice.due_date) < new Date()
                return (
                  <Link key={invoice.id} href={`/accounting/invoices/${invoice.id}`}>
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-md transition-all ${isOverdue ? "border-red-200 bg-red-50/50" : "border-border hover:border-primary"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 ${isOverdue ? "bg-red-500/10" : "bg-orange-500/10"} rounded-lg`}>
                          <FileText className={`h-5 w-5 ${isOverdue ? "text-red-500" : "text-orange-500"}`} />
                        </div>
                        <div>
                          <p className="font-semibold">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.customers?.name || "Unknown Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(invoice.due_date).toLocaleDateString()}
                            {isOverdue && <span className="text-red-500 ml-2 font-medium">OVERDUE</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${isOverdue ? "text-red-600" : "text-orange-600"}`}>
                          ${Number.parseFloat(invoice.amount_due || invoice.total_amount || 0).toLocaleString()}
                        </p>
                        <Button size="sm" className="mt-2">
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
