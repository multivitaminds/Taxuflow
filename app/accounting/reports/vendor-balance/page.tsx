import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VendorBalanceReport() {
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
            <h1 className="text-3xl font-bold">Vendor Balance Detail</h1>
            <p className="text-muted-foreground mt-1">Detailed vendor balances</p>
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
                <th className="text-left py-3 px-4">Vendor</th>
                <th className="text-right py-3 px-4">Total Billed</th>
                <th className="text-right py-3 px-4">Total Paid</th>
                <th className="text-right py-3 px-4">Balance Due</th>
                <th className="text-right py-3 px-4">Payment Terms</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Office Depot</td>
                <td className="text-right py-3 px-4">$6,240.00</td>
                <td className="text-right py-3 px-4">$2,640.00</td>
                <td className="text-right py-3 px-4 font-medium">$3,600.00</td>
                <td className="text-right py-3 px-4">Net 30</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Adobe Systems</td>
                <td className="text-right py-3 px-4">$4,200.00</td>
                <td className="text-right py-3 px-4">$3,000.00</td>
                <td className="text-right py-3 px-4 font-medium">$1,200.00</td>
                <td className="text-right py-3 px-4">Net 15</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Google Ads</td>
                <td className="text-right py-3 px-4">$18,500.00</td>
                <td className="text-right py-3 px-4">$10,300.00</td>
                <td className="text-right py-3 px-4 font-medium text-red-600">$8,200.00</td>
                <td className="text-right py-3 px-4">Net 30</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">Legal Services LLC</td>
                <td className="text-right py-3 px-4">$28,400.00</td>
                <td className="text-right py-3 px-4">$19,900.00</td>
                <td className="text-right py-3 px-4 font-medium">$8,500.00</td>
                <td className="text-right py-3 px-4">Net 45</td>
              </tr>
              <tr className="font-bold bg-muted/30">
                <td className="py-3 px-4">Total</td>
                <td className="text-right py-3 px-4">$57,340.00</td>
                <td className="text-right py-3 px-4">$35,840.00</td>
                <td className="text-right py-3 px-4">$21,500.00</td>
                <td className="text-right py-3 px-4">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
