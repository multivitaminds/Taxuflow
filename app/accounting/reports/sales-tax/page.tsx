import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SalesTaxReport() {
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
      </div>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Tax Jurisdiction</th>
                  <th className="text-right py-3 px-4">Tax Rate</th>
                  <th className="text-right py-3 px-4">Taxable Sales</th>
                  <th className="text-right py-3 px-4">Tax Collected</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">California State Tax</td>
                  <td className="text-right py-3 px-4">7.25%</td>
                  <td className="text-right py-3 px-4">$125,340.00</td>
                  <td className="text-right py-3 px-4 font-medium">$9,087.15</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Los Angeles County</td>
                  <td className="text-right py-3 px-4">1.00%</td>
                  <td className="text-right py-3 px-4">$125,340.00</td>
                  <td className="text-right py-3 px-4 font-medium">$1,253.40</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Los Angeles City</td>
                  <td className="text-right py-3 px-4">1.50%</td>
                  <td className="text-right py-3 px-4">$125,340.00</td>
                  <td className="text-right py-3 px-4 font-medium">$1,880.10</td>
                </tr>
                <tr className="font-bold bg-muted/30">
                  <td className="py-3 px-4">Total</td>
                  <td className="text-right py-3 px-4">9.75%</td>
                  <td className="text-right py-3 px-4">$125,340.00</td>
                  <td className="text-right py-3 px-4">$12,220.65</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Tax Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Tax Collected</span>
                    <span className="font-medium">$12,220.65</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Paid to Authorities</span>
                    <span className="font-medium">$8,500.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Tax Owed</span>
                    <span className="text-red-600">$3,720.65</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
