import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ARAgingReport() {
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
            <h1 className="text-3xl font-bold">A/R Aging Summary</h1>
            <p className="text-muted-foreground mt-1">Outstanding invoices by age</p>
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
      </div>
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-right py-3 px-4">Current</th>
                <th className="text-right py-3 px-4">1-30 Days</th>
                <th className="text-right py-3 px-4">31-60 Days</th>
                <th className="text-right py-3 px-4">61-90 Days</th>
                <th className="text-right py-3 px-4">90+ Days</th>
                <th className="text-right py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Acme Corporation</td>
                <td className="text-right py-3 px-4">$8,500.00</td>
                <td className="text-right py-3 px-4">$4,200.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4 font-medium">$12,700.00</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">TechStart Inc</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$8,400.00</td>
                <td className="text-right py-3 px-4">$2,100.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4 font-medium">$10,500.00</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Global Solutions</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$0.00</td>
                <td className="text-right py-3 px-4">$15,200.00</td>
                <td className="text-right py-3 px-4">$3,800.00</td>
                <td className="text-right py-3 px-4 font-medium text-red-600">$19,000.00</td>
              </tr>
              <tr className="font-bold bg-muted/30">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">$8,500.00</td>
                <td className="text-right py-3 px-4">$12,600.00</td>
                <td className="text-right py-3 px-4">$2,100.00</td>
                <td className="text-right py-3 px-4">$15,200.00</td>
                <td className="text-right py-3 px-4 text-red-600">$3,800.00</td>
                <td className="text-right py-3 px-4">$42,200.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
