import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CashFlowReport() {
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
            <h1 className="text-3xl font-bold">Cash Flow Statement</h1>
            <p className="text-muted-foreground mt-1">Cash inflows and outflows</p>
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
            <h2 className="text-xl font-semibold mb-4">Operating Activities</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cash from Customers</span>
                <span className="font-medium text-green-600">$145,200.00</span>
              </div>
              <div className="flex justify-between">
                <span>Cash to Suppliers</span>
                <span className="font-medium text-red-600">-$62,400.00</span>
              </div>
              <div className="flex justify-between">
                <span>Cash to Employees</span>
                <span className="font-medium text-red-600">-$38,500.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Net Cash from Operating</span>
                <span className="text-green-600">$44,300.00</span>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Investing Activities</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Equipment Purchases</span>
                <span className="font-medium text-red-600">-$15,000.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Net Cash from Investing</span>
                <span className="text-red-600">-$15,000.00</span>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div className="flex justify-between text-2xl font-bold">
              <span>Net Change in Cash</span>
              <span className="text-green-600">$29,300.00</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
