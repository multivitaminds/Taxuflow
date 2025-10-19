import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function SalesByProductReport() {
  const products = [
    { name: "Professional Services", revenue: "$65,200.00", percentage: "38.2%" },
    { name: "Software Licenses", revenue: "$48,500.00", percentage: "28.4%" },
    { name: "Consulting", revenue: "$32,180.00", percentage: "18.9%" },
    { name: "Training", revenue: "$14,660.00", percentage: "8.6%" },
    { name: "Support Contracts", revenue: "$10,000.00", percentage: "5.9%" },
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Sales by Product/Service</h1>
          <p className="text-muted-foreground mt-1">Revenue breakdown by product and service</p>
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
            <span>Product/Service</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">% of Total</span>
          </div>
          {products.map((product) => (
            <div key={product.name} className="grid grid-cols-3 py-2 border-b">
              <span>{product.name}</span>
              <span className="text-right font-medium">{product.revenue}</span>
              <span className="text-right text-muted-foreground">{product.percentage}</span>
            </div>
          ))}
          <div className="grid grid-cols-3 pt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-right">$170,540.00</span>
            <span className="text-right">100%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
