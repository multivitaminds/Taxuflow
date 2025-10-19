import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function BalanceSheetReport() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Balance Sheet</h1>
          <p className="text-muted-foreground mt-1">Assets, liabilities, and equity</p>
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
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            <div className="space-y-3">
              <div className="ml-4">
                <h3 className="font-medium mb-2">Current Assets</h3>
                <div className="space-y-1 ml-4 text-sm">
                  <div className="flex justify-between">
                    <span>Cash and Cash Equivalents</span>
                    <span className="font-medium">$85,420.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accounts Receivable</span>
                    <span className="font-medium">$42,180.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory</span>
                    <span className="font-medium">$28,500.00</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Current Assets</span>
                    <span>$156,100.00</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium mb-2">Fixed Assets</h3>
                <div className="space-y-1 ml-4 text-sm">
                  <div className="flex justify-between">
                    <span>Property and Equipment</span>
                    <span className="font-medium">$125,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Less: Accumulated Depreciation</span>
                    <span className="font-medium">($25,000.00)</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Fixed Assets</span>
                    <span>$100,000.00</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Assets</span>
                <span>$256,100.00</span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Liabilities</h2>
            <div className="space-y-3">
              <div className="ml-4">
                <h3 className="font-medium mb-2">Current Liabilities</h3>
                <div className="space-y-1 ml-4 text-sm">
                  <div className="flex justify-between">
                    <span>Accounts Payable</span>
                    <span className="font-medium">$32,450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accrued Expenses</span>
                    <span className="font-medium">$8,200.00</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Current Liabilities</span>
                    <span>$40,650.00</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium mb-2">Long-term Liabilities</h3>
                <div className="space-y-1 ml-4 text-sm">
                  <div className="flex justify-between">
                    <span>Long-term Debt</span>
                    <span className="font-medium">$75,000.00</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Long-term Liabilities</span>
                    <span>$75,000.00</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Liabilities</span>
                <span>$115,650.00</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-4">Equity</h2>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span>Owner's Equity</span>
                <span className="font-medium">$100,000.00</span>
              </div>
              <div className="flex justify-between">
                <span>Retained Earnings</span>
                <span className="font-medium">$40,450.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Equity</span>
                <span>$140,450.00</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total Liabilities & Equity</span>
              <span>$256,100.00</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
