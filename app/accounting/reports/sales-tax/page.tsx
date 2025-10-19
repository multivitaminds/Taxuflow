import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function SalesTaxReport() {
  const taxData = [
    { jurisdiction: "California State Tax", rate: "7.25%", taxableAmount: "$125,340.00", taxCollected: "$9,087.15" },
    { jurisdiction: "Los Angeles County", rate: "2.25%", taxableAmount: "$125,340.00", taxCollected: "$2,820.15" },
    { jurisdiction: "City of Los Angeles", rate: "0.50%", taxableAmount: "$125,340.00", taxCollected: "$626.70" },
  ]

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
            {taxData.map((tax) => (
              <div key={tax.jurisdiction} className="grid grid-cols-4 py-2 border-b">
                <span>{tax.jurisdiction}</span>
                <span className="text-right font-medium">{tax.rate}</span>
                <span className="text-right">{tax.taxableAmount}</span>
                <span className="text-right font-bold">{tax.taxCollected}</span>
              </div>
            ))}
            <div className="grid grid-cols-4 pt-4 font-bold text-lg">
              <span className="col-span-3">Total Tax Collected</span>
              <span className="text-right text-green-600">$12,534.00</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Tax Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Sales (Taxable)</span>
                <span className="font-medium">$125,340.00</span>
              </div>
              <div className="flex justify-between">
                <span>Total Sales (Non-Taxable)</span>
                <span className="font-medium">$45,200.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Tax Liability</span>
                <span className="text-green-600">$12,534.00</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
