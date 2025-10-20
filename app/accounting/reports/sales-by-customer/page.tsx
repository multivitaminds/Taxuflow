import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getSalesByCustomerData } from "@/lib/accounting/data-service"

export default async function SalesByCustomerReport() {
  const customers = await getSalesByCustomerData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totalRevenue = customers.reduce((sum, customer) => sum + customer.revenue, 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales by Customer</h1>
          <p className="text-muted-foreground mt-1">Revenue breakdown by customer</p>
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
          <div className="grid grid-cols-3 font-semibold pb-2 border-b">
            <span>Customer</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">% of Total</span>
          </div>
          {customers.map((customer) => (
            <div key={customer.name} className="grid grid-cols-3 py-2 border-b">
              <span>{customer.name}</span>
              <span className="text-right font-medium">{formatCurrency(customer.revenue)}</span>
              <span className="text-right text-muted-foreground">{customer.percentage}</span>
            </div>
          ))}
          <div className="grid grid-cols-3 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">{formatCurrency(totalRevenue)}</span>
            <span className="text-right">100%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
