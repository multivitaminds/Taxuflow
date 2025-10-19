import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function ARAgingReport() {
  const customers = [
    {
      name: "Acme Corporation",
      current: "$5,200.00",
      days30: "$2,400.00",
      days60: "$0.00",
      days90: "$0.00",
      total: "$7,600.00",
    },
    {
      name: "TechStart Inc",
      current: "$8,500.00",
      days30: "$0.00",
      days60: "$0.00",
      days90: "$0.00",
      total: "$8,500.00",
    },
    {
      name: "Global Solutions",
      current: "$0.00",
      days30: "$4,200.00",
      days60: "$3,800.00",
      days90: "$0.00",
      total: "$8,000.00",
    },
    {
      name: "Innovation Labs",
      current: "$6,800.00",
      days30: "$0.00",
      days60: "$0.00",
      days90: "$1,200.00",
      total: "$8,000.00",
    },
    {
      name: "Digital Ventures",
      current: "$4,200.00",
      days30: "$1,800.00",
      days60: "$0.00",
      days90: "$0.00",
      total: "$6,000.00",
    },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">A/R Aging Summary</h1>
          <p className="text-muted-foreground mt-1">Outstanding invoices by age</p>
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
          <div className="grid grid-cols-6 font-semibold pb-2 border-b text-sm">
            <span>Customer</span>
            <span className="text-right">Current</span>
            <span className="text-right">1-30 Days</span>
            <span className="text-right">31-60 Days</span>
            <span className="text-right">Over 90 Days</span>
            <span className="text-right">Total</span>
          </div>
          {customers.map((customer) => (
            <div key={customer.name} className="grid grid-cols-6 py-2 border-b text-sm">
              <span>{customer.name}</span>
              <span className="text-right font-medium">{customer.current}</span>
              <span className="text-right font-medium">{customer.days30}</span>
              <span className="text-right font-medium">{customer.days60}</span>
              <span className="text-right font-medium text-red-600">{customer.days90}</span>
              <span className="text-right font-bold">{customer.total}</span>
            </div>
          ))}
          <div className="grid grid-cols-6 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">$24,700.00</span>
            <span className="text-right">$8,400.00</span>
            <span className="text-right">$3,800.00</span>
            <span className="text-right text-red-600">$1,200.00</span>
            <span className="text-right">$38,100.00</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
