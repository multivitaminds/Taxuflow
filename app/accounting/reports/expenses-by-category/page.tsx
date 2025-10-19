import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function ExpensesByCategoryReport() {
  const categories = [
    { name: "Operating Expenses", amount: "$28,400.00", percentage: "36.8%" },
    { name: "Marketing & Advertising", amount: "$18,200.00", percentage: "23.6%" },
    { name: "Office Supplies", amount: "$12,500.00", percentage: "16.2%" },
    { name: "Travel & Entertainment", amount: "$9,800.00", percentage: "12.7%" },
    { name: "Professional Services", amount: "$8,280.00", percentage: "10.7%" },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
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
      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 font-semibold pb-2 border-b">
            <span>Category</span>
            <span className="text-right">Amount</span>
            <span className="text-right">% of Total</span>
          </div>
          {categories.map((category) => (
            <div key={category.name} className="grid grid-cols-3 py-2 border-b">
              <span>{category.name}</span>
              <span className="text-right font-medium">{category.amount}</span>
              <span className="text-right text-muted-foreground">{category.percentage}</span>
            </div>
          ))}
          <div className="grid grid-cols-3 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">$77,180.00</span>
            <span className="text-right">100%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
