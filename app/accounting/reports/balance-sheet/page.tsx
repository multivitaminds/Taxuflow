import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getBalanceSheetData } from "@/lib/accounting/data-service"

export default async function BalanceSheetReport() {
  const data = await getBalanceSheetData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const currentAssetsTotal = data.assets.current.reduce((sum, a) => sum + (a.balance || 0), 0)
  const fixedAssetsTotal = data.assets.fixed.reduce((sum, a) => sum + (a.balance || 0), 0)
  const currentLiabilitiesTotal = data.liabilities.current.reduce((sum, l) => sum + (l.balance || 0), 0)
  const longTermLiabilitiesTotal = data.liabilities.longTerm.reduce((sum, l) => sum + (l.balance || 0), 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Balance Sheet</h1>
          <p className="text-muted-foreground mt-1">Assets, liabilities, and equity</p>
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
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            <div className="space-y-3">
              <div className="ml-4">
                <h3 className="font-medium mb-2">Current Assets</h3>
                <div className="space-y-1 ml-4 text-sm">
                  {data.assets.current.map((account, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{account.account_name}</span>
                      <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Current Assets</span>
                    <span>{formatCurrency(currentAssetsTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium mb-2">Fixed Assets</h3>
                <div className="space-y-1 ml-4 text-sm">
                  {data.assets.fixed.map((account, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{account.account_name}</span>
                      <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Fixed Assets</span>
                    <span>{formatCurrency(fixedAssetsTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Assets</span>
                <span>{formatCurrency(data.assets.total)}</span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Liabilities</h2>
            <div className="space-y-3">
              <div className="ml-4">
                <h3 className="font-medium mb-2">Current Liabilities</h3>
                <div className="space-y-1 ml-4 text-sm">
                  {data.liabilities.current.map((account, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{account.account_name}</span>
                      <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Current Liabilities</span>
                    <span>{formatCurrency(currentLiabilitiesTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-medium mb-2">Long-term Liabilities</h3>
                <div className="space-y-1 ml-4 text-sm">
                  {data.liabilities.longTerm.map((account, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{account.account_name}</span>
                      <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Long-term Liabilities</span>
                    <span>{formatCurrency(longTermLiabilitiesTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Liabilities</span>
                <span>{formatCurrency(data.liabilities.total)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-4">Equity</h2>
            <div className="space-y-2 ml-4">
              {data.equity.accounts.map((account, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{account.account_name}</span>
                  <span className="font-medium">{formatCurrency(account.balance || 0)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Equity</span>
                <span>{formatCurrency(data.equity.total)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total Liabilities & Equity</span>
              <span>{formatCurrency(data.liabilities.total + data.equity.total)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
