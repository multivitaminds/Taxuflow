import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getSalesTaxData } from "@/lib/accounting/data-service"

export default async function SalesTaxReport() {
  const data = await getSalesTaxData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales Tax Summary</h1>
          <p className="text-muted-foreground mt-1">Sales tax collected and owed</p>
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
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 font-semibold pb-2 border-b">
              <span>Tax Jurisdiction</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Taxable Amount</span>
              <span className="text-right">Tax Collected</span>
            </div>
            {data.jurisdictions.map((tax) => (
              <div key={tax.name} className="grid grid-cols-4 py-2 border-b">
                <span>{tax.name}</span>
                <span className="text-right font-medium">{tax.rate}</span>
                <span className="text-right">{formatCurrency(data.taxableAmount)}</span>
                <span className="text-right font-bold">{formatCurrency(tax.amount)}</span>
              </div>
            ))}
            <div className="grid grid-cols-4 pt-4 font-bold text-lg">
              <span className="col-span-3">Total Tax Collected</span>
              <span className="text-right text-green-600">{formatCurrency(data.taxCollected)}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Tax Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Sales (Taxable)</span>
                <span className="font-medium">{formatCurrency(data.taxableAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Sales (Non-Taxable)</span>
                <span className="font-medium">{formatCurrency(data.nonTaxableAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Tax Liability</span>
                <span className="text-green-600">{formatCurrency(data.taxCollected)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
