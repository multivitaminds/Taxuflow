import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getAPAgingData } from "@/lib/accounting/data-service"

export default async function APAgingReport() {
  const vendors = await getAPAgingData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const totals = vendors.reduce(
    (acc, vendor) => ({
      current: acc.current + vendor.current,
      days30: acc.days30 + vendor.days30,
      days60: acc.days60 + vendor.days60,
      days90: acc.days90 + vendor.days90,
      total: acc.total + vendor.total,
    }),
    { current: 0, days30: 0, days60: 0, days90: 0, total: 0 },
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">A/P Aging Summary</h1>
          <p className="text-muted-foreground mt-1">Outstanding bills by age</p>
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
            <span>Vendor</span>
            <span className="text-right">Current</span>
            <span className="text-right">1-30 Days</span>
            <span className="text-right">31-60 Days</span>
            <span className="text-right">Over 90 Days</span>
            <span className="text-right">Total</span>
          </div>
          {vendors.map((vendor) => (
            <div key={vendor.name} className="grid grid-cols-6 py-2 border-b text-sm">
              <span>{vendor.name}</span>
              <span className="text-right font-medium">{formatCurrency(vendor.current)}</span>
              <span className="text-right font-medium">{formatCurrency(vendor.days30)}</span>
              <span className="text-right font-medium">{formatCurrency(vendor.days60)}</span>
              <span className="text-right font-medium text-red-600">{formatCurrency(vendor.days90)}</span>
              <span className="text-right font-bold">{formatCurrency(vendor.total)}</span>
            </div>
          ))}
          <div className="grid grid-cols-6 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">{formatCurrency(totals.current)}</span>
            <span className="text-right">{formatCurrency(totals.days30)}</span>
            <span className="text-right">{formatCurrency(totals.days60)}</span>
            <span className="text-right text-red-600">{formatCurrency(totals.days90)}</span>
            <span className="text-right">{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
