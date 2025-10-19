import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function CustomerBalanceReport() {
  const customers = [
    { name: "Acme Corporation", invoiced: "$45,200.00", paid: "$37,600.00", balance: "$7,600.00" },
    { name: "TechStart Inc", invoiced: "$38,500.00", paid: "$30,000.00", balance: "$8,500.00" },
    { name: "Global Solutions", invoiced: "$32,180.00", paid: "$24,180.00", balance: "$8,000.00" },
    { name: "Innovation Labs", invoiced: "$28,400.00", paid: "$20,400.00", balance: "$8,000.00" },
    { name: "Digital Ventures", invoiced: "$26,260.00", paid: "$20,260.00", balance: "$6,000.00" },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Balance Detail</h1>
          <p className="text-muted-foreground mt-1">Detailed customer balances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            As of Date
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-4 font-semibold pb-2 border-b">
            <span>Customer</span>
            <span className="text-right">Total Invoiced</span>
            <span className="text-right">Total Paid</span>
            <span className="text-right">Balance Due</span>
          </div>
          {customers.map((customer) => (
            <div key={customer.name} className="grid grid-cols-4 py-2 border-b">
              <span>{customer.name}</span>
              <span className="text-right font-medium">{customer.invoiced}</span>
              <span className="text-right text-green-600">{customer.paid}</span>
              <span className="text-right font-bold">{customer.balance}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">$170,540.00</span>
            <span className="text-right text-green-600">$132,440.00</span>
            <span className="text-right">$38,100.00</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
