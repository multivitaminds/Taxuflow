import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { getCashFlowData } from "@/lib/accounting/data-service"

export default async function CashFlowReport() {
  const data = await getCashFlowData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const netIncrease = data.operating.net + data.investing.net + data.financing.net
  const beginningCash = 35760
  const endingCash = beginningCash + netIncrease

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cash Flow Statement</h1>
          <p className="text-muted-foreground mt-1">Cash inflows and outflows</p>
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
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Operating Activities</h2>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span>Net Income</span>
                <span className="font-medium">{formatCurrency(data.operating.netIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Depreciation</span>
                <span className="font-medium">{formatCurrency(data.operating.depreciation)}</span>
              </div>
              <div className="flex justify-between">
                <span>Changes in Accounts Receivable</span>
                <span className="font-medium">{formatCurrency(data.operating.accountsReceivable)}</span>
              </div>
              <div className="flex justify-between">
                <span>Changes in Accounts Payable</span>
                <span className="font-medium">{formatCurrency(data.operating.accountsPayable)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Net Cash from Operating Activities</span>
                <span className={data.operating.net >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(data.operating.net)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Investing Activities</h2>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span>Purchase of Equipment</span>
                <span className="font-medium">{formatCurrency(data.investing.purchaseEquipment)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sale of Investments</span>
                <span className="font-medium">{formatCurrency(data.investing.saleInvestments)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Net Cash from Investing Activities</span>
                <span className={data.investing.net >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(data.investing.net)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Financing Activities</h2>
            <div className="space-y-2 ml-4">
              <div className="flex justify-between">
                <span>Loan Proceeds</span>
                <span className="font-medium">{formatCurrency(data.financing.loanProceeds)}</span>
              </div>
              <div className="flex justify-between">
                <span>Loan Repayments</span>
                <span className="font-medium">{formatCurrency(data.financing.loanRepayments)}</span>
              </div>
              <div className="flex justify-between">
                <span>Owner Distributions</span>
                <span className="font-medium">{formatCurrency(data.financing.ownerDistributions)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Net Cash from Financing Activities</span>
                <span className={data.financing.net >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(data.financing.net)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Net Increase in Cash</span>
                <span className={netIncrease >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(netIncrease)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cash at Beginning of Period</span>
                <span className="font-medium">{formatCurrency(beginningCash)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-2 border-t-2">
                <span>Cash at End of Period</span>
                <span className="text-green-600">{formatCurrency(endingCash)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
