import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function TaxDeductionsReport() {
  const deductions = [
    { category: "Business Travel", amount: "$9,800.00", percentage: "21.4%" },
    { category: "Office Expenses", amount: "$12,500.00", percentage: "27.3%" },
    { category: "Professional Services", amount: "$8,280.00", percentage: "18.1%" },
    { category: "Marketing & Advertising", amount: "$10,200.00", percentage: "22.3%" },
    { category: "Equipment & Depreciation", amount: "$5,000.00", percentage: "10.9%" },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
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
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 font-semibold pb-2 border-b">
              <span>Deduction Category</span>
              <span className="text-right">Amount</span>
              <span className="text-right">% of Total</span>
            </div>
            {deductions.map((deduction) => (
              <div key={deduction.category} className="grid grid-cols-3 py-2 border-b">
                <span>{deduction.category}</span>
                <span className="text-right font-medium">{deduction.amount}</span>
                <span className="text-right text-muted-foreground">{deduction.percentage}</span>
              </div>
            ))}
            <div className="grid grid-cols-3 pt-4 font-bold text-lg">
              <span>Total Deductions</span>
              <span className="text-right text-green-600">$45,780.00</span>
              <span className="text-right">100%</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Tax Impact Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Deductible Expenses</span>
                <span className="font-medium">$45,780.00</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax Rate</span>
                <span className="font-medium">24%</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Estimated Tax Savings</span>
                <span className="text-green-600">$10,987.20</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
