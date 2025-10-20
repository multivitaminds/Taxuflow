import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getARAgingData } from "@/lib/accounting/data-service"

export default async function ARAgingReport() {
  const customers = await getARAgingData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totals = customers.reduce(
    (acc, customer) => ({
      current: acc.current + customer.current,
      days30: acc.days30 + customer.days30,
      days60: acc.days60 + customer.days60,
      days90: acc.days90 + customer.days90,
      days90plus: acc.days90plus + (customer.days90plus || 0),
      total: acc.total + customer.total,
    }),
    { current: 0, days30: 0, days60: 0, days90: 0, days90plus: 0, total: 0 },
  )

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
          <div className="grid grid-cols-7 font-semibold pb-2 border-b text-sm">
            <span>Customer</span>
            <span className="text-right">Current</span>
            <span className="text-right">1-30 Days</span>
            <span className="text-right">31-60 Days</span>
            <span className="text-right">61-90 Days</span>
            <span className="text-right">Over 90 Days</span>
            <span className="text-right">Total</span>
          </div>
          {customers.map((customer) => (
            <div key={customer.name} className="grid grid-cols-7 py-2 border-b text-sm">
              <span>{customer.name}</span>
              <span className="text-right font-medium">{formatCurrency(customer.current)}</span>
              <span className="text-right font-medium">{formatCurrency(customer.days30)}</span>
              <span className="text-right font-medium">{formatCurrency(customer.days60)}</span>
              <span className="text-right font-medium">{formatCurrency(customer.days90)}</span>
              <span className="text-right font-medium text-red-600">{formatCurrency(customer.days90plus || 0)}</span>
              <span className="text-right font-bold">{formatCurrency(customer.total)}</span>
            </div>
          ))}
          <div className="grid grid-cols-7 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">{formatCurrency(totals.current)}</span>
            <span className="text-right">{formatCurrency(totals.days30)}</span>
            <span className="text-right">{formatCurrency(totals.days60)}</span>
            <span className="text-right">{formatCurrency(totals.days90)}</span>
            <span className="text-right text-red-600">{formatCurrency(totals.days90plus)}</span>
            <span className="text-right">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
