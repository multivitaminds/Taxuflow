import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function APAgingReport() {
  const vendors = [
    {
      name: "Office Depot",
      current: "$3,200.00",
      days30: "$0.00",
      days60: "$0.00",
      days90: "$0.00",
      total: "$3,200.00",
    },
    { name: "Google Ads", current: "$2,800.00", days30: "$0.00", days60: "$0.00", days90: "$0.00", total: "$2,800.00" },
    { name: "AWS", current: "$0.00", days30: "$2,100.00", days60: "$2,000.00", days90: "$0.00", total: "$4,100.00" },
    { name: "Adobe", current: "$1,900.00", days30: "$0.00", days60: "$0.00", days90: "$0.00", total: "$1,900.00" },
    { name: "Salesforce", current: "$2,600.00", days30: "$0.00", days60: "$0.00", days90: "$0.00", total: "$2,600.00" },
  ]

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
              <span className="text-right font-medium">{vendor.current}</span>
              <span className="text-right font-medium">{vendor.days30}</span>
              <span className="text-right font-medium">{vendor.days60}</span>
              <span className="text-right font-medium text-red-600">{vendor.days90}</span>
              <span className="text-right font-bold">{vendor.total}</span>
            </div>
          ))}
          <div className="grid grid-cols-6 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">$10,500.00</span>
            <span className="text-right">$2,100.00</span>
            <span className="text-right">$2,000.00</span>
            <span className="text-right text-red-600">$0.00</span>
            <span className="text-right">$14,600.00</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
