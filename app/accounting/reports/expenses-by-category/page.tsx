import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExpensesByCategoryReport() {
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
            <h1 className="text-3xl font-bold">Expenses by Category</h1>
            <p className="text-muted-foreground mt-1">Spending breakdown by category</p>
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
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-right py-3 px-4">Transactions</th>
                <th className="text-right py-3 px-4">Total Amount</th>
                <th className="text-right py-3 px-4">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Office Supplies</td>
                <td className="text-right py-3 px-4">24</td>
                <td className="text-right py-3 px-4 font-medium">$8,420.00</td>
                <td className="text-right py-3 px-4">10.9%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Software & Subscriptions</td>
                <td className="text-right py-3 px-4">18</td>
                <td className="text-right py-3 px-4 font-medium">$12,500.00</td>
                <td className="text-right py-3 px-4">16.2%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Marketing & Advertising</td>
                <td className="text-right py-3 px-4">32</td>
                <td className="text-right py-3 px-4 font-medium">$18,240.00</td>
                <td className="text-right py-3 px-4">23.6%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Professional Services</td>
                <td className="text-right py-3 px-4">15</td>
                <td className="text-right py-3 px-4 font-medium">$22,500.00</td>
                <td className="text-right py-3 px-4">29.2%</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Travel & Entertainment</td>
                <td className="text-right py-3 px-4">28</td>
                <td className="text-right py-3 px-4 font-medium">$15,520.00</td>
                <td className="text-right py-3 px-4">20.1%</td>
              </tr>
              <tr className="font-bold bg-muted/30">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">117</td>
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
