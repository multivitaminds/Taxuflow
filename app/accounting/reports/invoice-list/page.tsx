import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar } from "lucide-react"
import { getInvoiceListData } from "@/lib/accounting/data-service"

export default async function InvoiceListReport() {
  const invoices = await getInvoiceListData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Invoice List</h1>
          <p className="text-muted-foreground mt-1">All invoices with status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-5 font-semibold pb-2 border-b">
            <span>Invoice #</span>
            <span>Customer</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Status</span>
          </div>
          {invoices.map((invoice) => (
            <div key={invoice.number} className="grid grid-cols-5 py-2 border-b items-center">
              <span className="font-medium">{invoice.number}</span>
              <span>{invoice.customer}</span>
              <span className="text-muted-foreground">{invoice.date}</span>
              <span className="text-right font-medium">{formatCurrency(invoice.amount)}</span>
              <div className="text-right">
                <Badge
                  variant={
                    invoice.status === "paid" ? "default" : invoice.status === "overdue" ? "destructive" : "secondary"
                  }
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-5 pt-4 font-bold text-lg">
            <span className="col-span-3">Total</span>
            <span className="text-right">{formatCurrency(totalAmount)}</span>
            <span></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
