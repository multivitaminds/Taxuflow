import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SalesByCustomerReport() {
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
            <h1 className="text-3xl font-bold">Sales by Customer</h1>
            <p className="text-muted-foreground mt-1">Revenue breakdown by customer</p>
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
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-right py-3 px-4">Invoices</th>
                <th className="text-right py-3 px-4">Total Sales</th>
                <th className="text-right py-3 px-4">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Acme Corporation</td>
                <td className="text-right py-3 px-4">12</td>
                <td className="text-right py-3 px-4 font-medium">$45,200.00</td>
                <td className="text-right py-3 px-4">26.5%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">TechStart Inc</td>
                <td className="text-right py-3 px-4">8</td>
                <td className="text-right py-3 px-4 font-medium">$38,500.00</td>
                <td className="text-right py-3 px-4">22.6%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Global Solutions</td>
                <td className="text-right py-3 px-4">15</td>
                <td className="text-right py-3 px-4 font-medium">$52,840.00</td>
                <td className="text-right py-3 px-4">31.0%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Innovation Labs</td>
                <td className="text-right py-3 px-4">6</td>
                <td className="text-right py-3 px-4 font-medium">$34,000.00</td>
                <td className="text-right py-3 px-4">19.9%</td>
              </tr>
              <tr className="font-bold bg-muted/30">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">41</td>
                <td className="text-right py-3 px-4">$170,540.00</td>
                <td className="text-right py-3 px-4">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
