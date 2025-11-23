import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BillListReport() {
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
            <h1 className="text-3xl font-bold">Bill List</h1>
            <p className="text-muted-foreground mt-1">All bills with payment status</p>
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
                <th className="text-left py-3 px-4">Bill #</th>
                <th className="text-left py-3 px-4">Vendor</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Due Date</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">BILL-2001</td>
                <td className="py-3 px-4">Office Depot</td>
                <td className="py-3 px-4">Jan 10, 2025</td>
                <td className="py-3 px-4">Feb 9, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$2,400.00</td>
                <td className="py-3 px-4">
                  <Badge variant="default" className="bg-green-500">
                    Paid
                  </Badge>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">BILL-2002</td>
                <td className="py-3 px-4">Adobe Systems</td>
                <td className="py-3 px-4">Jan 15, 2025</td>
                <td className="py-3 px-4">Feb 14, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$1,200.00</td>
                <td className="py-3 px-4">
                  <Badge variant="secondary">Pending</Badge>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">BILL-2003</td>
                <td className="py-3 px-4">Google Ads</td>
                <td className="py-3 px-4">Jan 20, 2025</td>
                <td className="py-3 px-4">Jan 5, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$5,800.00</td>
                <td className="py-3 px-4">
                  <Badge variant="destructive">Overdue</Badge>
                </td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">BILL-2004</td>
                <td className="py-3 px-4">Legal Services LLC</td>
                <td className="py-3 px-4">Feb 1, 2025</td>
                <td className="py-3 px-4">Mar 3, 2025</td>
                <td className="text-right py-3 px-4 font-medium">$8,500.00</td>
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
