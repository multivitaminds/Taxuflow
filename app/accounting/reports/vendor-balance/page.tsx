import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function VendorBalanceReport() {
  const vendors = [
    { name: "Office Depot", billed: "$15,200.00", paid: "$12,000.00", balance: "$3,200.00" },
    { name: "Google Ads", billed: "$12,800.00", paid: "$10,000.00", balance: "$2,800.00" },
    { name: "AWS", billed: "$11,400.00", paid: "$7,300.00", balance: "$4,100.00" },
    { name: "Adobe", billed: "$8,900.00", paid: "$7,000.00", balance: "$1,900.00" },
    { name: "Salesforce", billed: "$7,600.00", paid: "$5,000.00", balance: "$2,600.00" },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
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
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-4 font-semibold pb-2 border-b">
            <span>Vendor</span>
            <span className="text-right">Total Billed</span>
            <span className="text-right">Total Paid</span>
            <span className="text-right">Balance Due</span>
          </div>
          {vendors.map((vendor) => (
            <div key={vendor.name} className="grid grid-cols-4 py-2 border-b">
              <span>{vendor.name}</span>
              <span className="text-right font-medium">{vendor.billed}</span>
              <span className="text-right text-green-600">{vendor.paid}</span>
              <span className="text-right font-bold">{vendor.balance}</span>
            </div>
          ))}
          <div className="grid grid-cols-4 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">$55,900.00</span>
            <span className="text-right text-green-600">$41,300.00</span>
            <span className="text-right">$14,600.00</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
