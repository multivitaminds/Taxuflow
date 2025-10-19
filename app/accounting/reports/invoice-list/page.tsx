import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar } from "lucide-react"

export default function InvoiceListReport() {
  const invoices = [
    { number: "INV-1045", customer: "Acme Corporation", date: "2024-03-15", amount: "$12,500.00", status: "Paid" },
    { number: "INV-1044", customer: "TechStart Inc", date: "2024-03-12", amount: "$8,200.00", status: "Paid" },
    { number: "INV-1043", customer: "Global Solutions", date: "2024-03-10", amount: "$15,400.00", status: "Overdue" },
    { number: "INV-1042", customer: "Innovation Labs", date: "2024-03-08", amount: "$6,800.00", status: "Pending" },
    { number: "INV-1041", customer: "Digital Ventures", date: "2024-03-05", amount: "$9,200.00", status: "Paid" },
  ]

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
              <span className="text-right font-medium">{invoice.amount}</span>
              <div className="text-right">
                <Badge
                  variant={
                    invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-5 pt-4 font-bold text-lg">
            <span className="col-span-3">Total</span>
            <span className="text-right">$52,100.00</span>
            <span></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
