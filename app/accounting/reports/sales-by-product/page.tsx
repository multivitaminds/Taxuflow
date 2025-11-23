import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SalesByProductReport() {
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
            <h1 className="text-3xl font-bold">Sales by Product</h1>
            <p className="text-muted-foreground mt-1">Revenue breakdown by product/service</p>
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
                <th className="text-left py-3 px-4">Product/Service</th>
                <th className="text-right py-3 px-4">Quantity Sold</th>
                <th className="text-right py-3 px-4">Total Sales</th>
                <th className="text-right py-3 px-4">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Consulting Services</td>
                <td className="text-right py-3 px-4">120 hrs</td>
                <td className="text-right py-3 px-4 font-medium">$72,000.00</td>
                <td className="text-right py-3 px-4">42.2%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Software License</td>
                <td className="text-right py-3 px-4">45</td>
                <td className="text-right py-3 px-4 font-medium">$54,000.00</td>
                <td className="text-right py-3 px-4">31.7%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Training Programs</td>
                <td className="text-right py-3 px-4">28</td>
                <td className="text-right py-3 px-4 font-medium">$28,540.00</td>
                <td className="text-right py-3 px-4">16.7%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Support Services</td>
                <td className="text-right py-3 px-4">32</td>
                <td className="text-right py-3 px-4 font-medium">$16,000.00</td>
                <td className="text-right py-3 px-4">9.4%</td>
              </tr>
              <tr className="font-bold bg-muted/30">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">-</td>
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
