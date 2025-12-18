import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BalanceSheetReport() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/accounting/reports">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Balance Sheet</h1>
            <p className="text-muted-foreground mt-1">Assets, liabilities, and equity</p>
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
      </div>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            <div className="space-y-3">
              <div className="pl-4">
                <h3 className="font-medium mb-2">Current Assets</h3>
                <div className="space-y-2 pl-4">
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
                </div>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total Assets</span>
                <span>$156,100.00</span>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Liabilities</h2>
            <div className="space-y-3">
              <div className="pl-4">
                <h3 className="font-medium mb-2">Current Liabilities</h3>
                <div className="space-y-2 pl-4">
                  <div className="flex justify-between">
                    <span>Accounts Payable</span>
                    <span className="font-medium">$18,240.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accrued Expenses</span>
                    <span className="font-medium">$12,500.00</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total Liabilities</span>
                <span>$30,740.00</span>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-4">Equity</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Owner's Equity</span>
                <span className="font-medium">$125,360.00</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-green-600 pt-2 border-t">
                <span>Total Equity</span>
                <span>$125,360.00</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
