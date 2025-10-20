import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getProfitLossData } from "@/lib/accounting/data-service"

export default async function ProfitLossReport() {
  const data = await getProfitLossData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Profit & Loss Statement</h1>
          <p className="text-muted-foreground mt-1">Income and expenses over time</p>
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
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Revenue</h2>
            <div className="space-y-2">
              {data.revenue.accounts.map((account, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{account.account_name}</span>
                  <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Revenue</span>
                <span>{formatCurrency(data.revenue.total)}</span>
              </div>
            </div>
          </div>
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            <div className="space-y-2">
              {data.expenses.accounts.map((account, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{account.account_name}</span>
                  <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Expenses</span>
                <span>{formatCurrency(data.expenses.total)}</span>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <div
              className={`flex justify-between text-2xl font-bold ${data.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              <span>Net {data.netProfit >= 0 ? "Profit" : "Loss"}</span>
              <span>{formatCurrency(Math.abs(data.netProfit))}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
