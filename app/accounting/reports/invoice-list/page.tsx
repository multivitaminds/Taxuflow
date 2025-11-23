import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function InvoiceListReport() {
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
            <h1 className="text-3xl font-bold">Invoice List</h1>
            <p className="text-muted-foreground mt-1">All invoices with status</p>
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
                <th className="text-left py-3 px-4">Invoice #</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Due Date</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">INV-1001</td>
                <td className="py-3 px-4">Acme Corporation</td>
                <td className="py-3 px-4">Jan 15, 2025</td>
                <td className="py-3 px-4">Feb 14, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$12,500.00</td>
                <td className="py-3 px-4">
                  <Badge variant="default" className="bg-green-500">
                    Paid
                  </Badge>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">INV-1002</td>
                <td className="py-3 px-4">TechStart Inc</td>
                <td className="py-3 px-4">Jan 20, 2025</td>
                <td className="py-3 px-4">Feb 19, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$8,400.00</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary">Sent</Badge>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">INV-1003</td>
                <td className="py-3 px-4">Global Solutions</td>
                <td className="py-3 px-4">Jan 25, 2025</td>
                <td className="py-3 px-4">Jan 10, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$15,200.00</td>
                <td className="py-3 px-4">
                  <Badge variant="destructive">Overdue</Badge>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">INV-1004</td>
                <td className="py-3 px-4">Innovation Labs</td>
                <td className="py-3 px-4">Feb 1, 2025</td>
                <td className="py-3 px-4">Mar 3, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$9,800.00</td>
                <td className="py-3 px-4">
                  <Badge variant="outline">Draft</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
