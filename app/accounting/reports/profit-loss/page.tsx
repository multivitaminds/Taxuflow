import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function ProfitLossReport() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss Statement</h1>
          <p className="text-muted-foreground mt-1">Income and expenses over time</p>
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
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Revenue</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sales Revenue</span>
                <span className="font-medium">$125,340.00</span>
              </div>
              <div className="flex justify-between">
                <span>Service Revenue</span>
                <span className="font-medium">$45,200.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Revenue</span>
                <span>$170,540.00</span>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Operating Expenses</span>
                <span className="font-medium">$42,180.00</span>
              </div>
              <div className="flex justify-between">
                <span>Cost of Goods Sold</span>
                <span className="font-medium">$35,000.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Expenses</span>
                <span>$77,180.00</span>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div className="flex justify-between text-2xl font-bold text-green-600">
              <span>Net Profit</span>
              <span>$93,360.00</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
