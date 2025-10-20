import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getCustomerBalanceData } from "@/lib/accounting/data-service"

export default async function CustomerBalanceReport() {
  const customers = await getCustomerBalanceData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totals = customers.reduce(
    (acc, customer) => ({
      invoiced: acc.invoiced + customer.invoiced,
      paid: acc.paid + customer.paid,
      balance: acc.balance + customer.balance,
    }),
    { invoiced: 0, paid: 0, balance: 0 },
  )

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
              <span className="text-right font-medium">{formatCurrency(customer.invoiced)}</span>
              <span className="text-right text-green-600">{formatCurrency(customer.paid)}</span>
              <span className="text-right font-bold">{formatCurrency(customer.balance)}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">{formatCurrency(totals.invoiced)}</span>
            <span className="text-right text-green-600">{formatCurrency(totals.paid)}</span>
            <span className="text-right">{formatCurrency(totals.balance)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
