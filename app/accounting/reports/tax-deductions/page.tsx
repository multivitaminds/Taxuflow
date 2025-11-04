import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TaxDeductionsReport() {
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
            <h1 className="text-3xl font-bold">Tax Deductions</h1>
            <p className="text-muted-foreground mt-1">Tax-deductible expenses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Tax Year
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
                  <th className="text-left py-3 px-4">Deduction Category</th>
                  <th className="text-right py-3 px-4">Transactions</th>
                  <th className="text-right py-3 px-4">Total Amount</th>
                  <th className="text-right py-3 px-4">Tax Savings (25%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Office Expenses</td>
                  <td className="text-right py-3 px-4">24</td>
                  <td className="text-right py-3 px-4 font-medium">$8,420.00</td>
                  <td className="text-right py-3 px-4 text-green-600">$2,105.00</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Software & Technology</td>
                  <td className="text-right py-3 px-4">18</td>
                  <td className="text-right py-3 px-4 font-medium">$12,500.00</td>
                  <td className="text-right py-3 px-4 text-green-600">$3,125.00</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Marketing & Advertising</td>
                  <td className="text-right py-3 px-4">32</td>
                  <td className="text-right py-3 px-4 font-medium">$18,240.00</td>
                  <td className="text-right py-3 px-4 text-green-600">$4,560.00</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Professional Fees</td>
                  <td className="text-right py-3 px-4">15</td>
                  <td className="text-right py-3 px-4 font-medium">$22,500.00</td>
                  <td className="text-right py-3 px-4 text-green-600">$5,625.00</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">Travel & Meals (50%)</td>
                  <td className="text-right py-3 px-4">28</td>
                  <td className="text-right py-3 px-4 font-medium">$7,760.00</td>
                  <td className="text-right py-3 px-4 text-green-600">$1,940.00</td>
                </tr>
                <tr className="font-bold bg-muted/30">
                  <td className="py-3 px-4">Total Deductions</td>
                  <td className="text-right py-3 px-4">117</td>
                  <td className="text-right py-3 px-4">$69,420.00</td>
                  <td className="text-right py-3 px-4 text-green-600">$17,355.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border-t pt-4">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Estimated Tax Savings</h3>
              <p className="text-2xl font-bold text-green-600">$17,355.00</p>
              <p className="text-sm text-muted-foreground mt-1">Based on 25% effective tax rate</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
