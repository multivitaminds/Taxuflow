import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar } from "lucide-react"
import { getBillListData } from "@/lib/accounting/data-service"

export default async function BillListReport() {
  const bills = await getBillListData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bill List</h1>
          <p className="text-muted-foreground mt-1">All bills with payment status</p>
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
          <div className="grid grid-cols-6 font-semibold pb-2 border-b">
            <span>Bill #</span>
            <span>Vendor</span>
            <span>Date</span>
            <span>Due Date</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Status</span>
          </div>
          {bills.map((bill) => (
            <div key={bill.number} className="grid grid-cols-6 py-2 border-b items-center">
              <span className="font-medium">{bill.number}</span>
              <span>{bill.vendor}</span>
              <span className="text-muted-foreground text-sm">{bill.date}</span>
              <span className="text-muted-foreground text-sm">{bill.dueDate}</span>
              <span className="text-right font-medium">{formatCurrency(bill.amount)}</span>
              <div className="text-right">
                <Badge
                  variant={bill.status === "paid" ? "default" : bill.status === "overdue" ? "destructive" : "secondary"}
                >
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-6 pt-4 font-bold text-lg">
            <span className="col-span-4">Total</span>
            <span className="text-right">{formatCurrency(totalAmount)}</span>
            <span></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
