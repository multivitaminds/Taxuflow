import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar } from "lucide-react"

export default function BillListReport() {
  const bills = [
    {
      number: "BILL-2045",
      vendor: "Office Depot",
      date: "2024-03-20",
      dueDate: "2024-04-20",
      amount: "$3,200.00",
      status: "Unpaid",
    },
    {
      number: "BILL-2044",
      vendor: "Google Ads",
      date: "2024-03-15",
      dueDate: "2024-04-15",
      amount: "$2,800.00",
      status: "Paid",
    },
    {
      number: "BILL-2043",
      vendor: "AWS",
      date: "2024-03-10",
      dueDate: "2024-04-10",
      amount: "$4,100.00",
      status: "Overdue",
    },
    {
      number: "BILL-2042",
      vendor: "Adobe",
      date: "2024-03-08",
      dueDate: "2024-04-08",
      amount: "$1,900.00",
      status: "Paid",
    },
    {
      number: "BILL-2041",
      vendor: "Salesforce",
      date: "2024-03-05",
      dueDate: "2024-04-05",
      amount: "$2,600.00",
      status: "Paid",
    },
  ]

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
              <span className="text-right font-medium">{bill.amount}</span>
              <div className="text-right">
                <Badge
                  variant={bill.status === "Paid" ? "default" : bill.status === "Overdue" ? "destructive" : "secondary"}
                >
                  {bill.status}
                </Badge>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-6 pt-4 font-bold text-lg">
            <span className="col-span-4">Total</span>
            <span className="text-right">$14,600.00</span>
            <span></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
