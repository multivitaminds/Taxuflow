import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExpensesByVendorReport() {
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
            <h1 className="text-3xl font-bold">Expenses by Vendor</h1>
            <p className="text-muted-foreground mt-1">Spending breakdown by vendor</p>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Vendor</th>
                <th className="text-right py-3 px-4">Bills</th>
                <th className="text-right py-3 px-4">Total Spent</th>
                <th className="text-right py-3 px-4">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Office Depot</td>
                <td className="text-right py-3 px-4">12</td>
                <td className="text-right py-3 px-4 font-medium">$6,240.00</td>
                <td className="text-right py-3 px-4">8.1%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Adobe Systems</td>
                <td className="text-right py-3 px-4">6</td>
                <td className="text-right py-3 px-4 font-medium">$4,200.00</td>
                <td className="text-right py-3 px-4">5.4%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Google Ads</td>
                <td className="text-right py-3 px-4">24</td>
                <td className="text-right py-3 px-4 font-medium">$18,500.00</td>
                <td className="text-right py-3 px-4">24.0%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Legal Services LLC</td>
                <td className="text-right py-3 px-4">8</td>
                <td className="text-right py-3 px-4 font-medium">$28,400.00</td>
                <td className="text-right py-3 px-4">36.8%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Various Vendors</td>
                <td className="text-right py-3 px-4">45</td>
                <td className="text-right py-3 px-4 font-medium">$19,840.00</td>
                <td className="text-right py-3 px-4">25.7%</td>
              </tr>
              <tr className="font-bold bg-muted/30">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">95</td>
                <td className="text-right py-3 px-4">$77,180.00</td>
                <td className="text-right py-3 px-4">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
