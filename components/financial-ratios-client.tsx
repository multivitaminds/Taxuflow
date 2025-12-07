"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Calculator, Download, Calendar, Info } from "lucide-react"

export default function FinancialRatiosClient() {
  const ratios = {
    liquidity: {
      currentRatio: { value: 5.08, target: 2.0, status: "healthy" },
      quickRatio: { value: 3.84, target: 1.0, status: "healthy" },
      cashRatio: { value: 2.78, target: 0.5, status: "healthy" },
    },
    profitability: {
      grossProfitMargin: { value: 54.7, target: 40.0, status: "excellent" },
      netProfitMargin: { value: 42.3, target: 20.0, status: "excellent" },
      operatingMargin: { value: 48.2, target: 30.0, status: "excellent" },
      roi: { value: 28.5, target: 15.0, status: "excellent" },
      roa: { value: 35.8, target: 10.0, status: "excellent" },
      roe: { value: 74.5, target: 15.0, status: "excellent" },
    },
    efficiency: {
      assetTurnover: { value: 1.09, target: 1.0, status: "healthy" },
      inventoryTurnover: { value: 5.98, target: 4.0, status: "healthy" },
      receivablesTurnover: { value: 4.04, target: 6.0, status: "warning" },
      payablesTurnover: { value: 9.35, target: 8.0, status: "healthy" },
    },
    leverage: {
      debtToEquity: { value: 0.25, target: 1.0, status: "healthy" },
      debtRatio: { value: 0.2, target: 0.5, status: "healthy" },
      equityRatio: { value: 0.8, target: 0.5, status: "excellent" },
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200"
      case "healthy":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "danger":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  const getTrendIcon = (value: number, target: number, inverse = false) => {
    const isAboveTarget = inverse ? value < target : value > target
    return isAboveTarget ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Financial Ratios Dashboard</h1>
            <p className="text-muted-foreground mt-1">Key financial metrics and performance indicators</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Period
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Overall Score</h3>
            <Calculator className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">8.5/10</div>
          <p className="text-xs text-slate-600 mt-1">Excellent financial health</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Liquidity</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">5.08</div>
          <p className="text-xs text-slate-600 mt-1">Current Ratio</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Profitability</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">54.7%</div>
          <p className="text-xs text-slate-600 mt-1">Gross Profit Margin</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Efficiency</h3>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">1.09</div>
          <p className="text-xs text-slate-600 mt-1">Asset Turnover</p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="h-5 w-5 text-blue-600" />
            </div>
            Liquidity Ratios
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Measure your ability to meet short-term obligations</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`p-4 border-2 ${getStatusColor(ratios.liquidity.currentRatio.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Current Ratio</h3>
                {getTrendIcon(ratios.liquidity.currentRatio.value, ratios.liquidity.currentRatio.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.liquidity.currentRatio.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.liquidity.currentRatio.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.liquidity.currentRatio.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Current Assets / Current Liabilities</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.liquidity.quickRatio.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Quick Ratio</h3>
                {getTrendIcon(ratios.liquidity.quickRatio.value, ratios.liquidity.quickRatio.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.liquidity.quickRatio.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.liquidity.quickRatio.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.liquidity.quickRatio.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">(Current Assets - Inventory) / Current Liabilities</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.liquidity.cashRatio.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Cash Ratio</h3>
                {getTrendIcon(ratios.liquidity.cashRatio.value, ratios.liquidity.cashRatio.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.liquidity.cashRatio.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.liquidity.cashRatio.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.liquidity.cashRatio.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Cash / Current Liabilities</p>
            </Card>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            Profitability Ratios
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Evaluate your company's ability to generate profit</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`p-4 border-2 ${getStatusColor(ratios.profitability.grossProfitMargin.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Gross Profit Margin</h3>
                {getTrendIcon(
                  ratios.profitability.grossProfitMargin.value,
                  ratios.profitability.grossProfitMargin.target,
                )}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.profitability.grossProfitMargin.value.toFixed(1)}%</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Target: {ratios.profitability.grossProfitMargin.target.toFixed(1)}%
                </span>
                <span className="font-medium capitalize">{ratios.profitability.grossProfitMargin.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">(Revenue - COGS) / Revenue × 100</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.profitability.netProfitMargin.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Net Profit Margin</h3>
                {getTrendIcon(ratios.profitability.netProfitMargin.value, ratios.profitability.netProfitMargin.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.profitability.netProfitMargin.value.toFixed(1)}%</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Target: {ratios.profitability.netProfitMargin.target.toFixed(1)}%
                </span>
                <span className="font-medium capitalize">{ratios.profitability.netProfitMargin.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Net Income / Revenue × 100</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.profitability.operatingMargin.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Operating Margin</h3>
                {getTrendIcon(ratios.profitability.operatingMargin.value, ratios.profitability.operatingMargin.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.profitability.operatingMargin.value.toFixed(1)}%</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Target: {ratios.profitability.operatingMargin.target.toFixed(1)}%
                </span>
                <span className="font-medium capitalize">{ratios.profitability.operatingMargin.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Operating Income / Revenue × 100</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.profitability.roi.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Return on Investment</h3>
                {getTrendIcon(ratios.profitability.roi.value, ratios.profitability.roi.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.profitability.roi.value.toFixed(1)}%</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.profitability.roi.target.toFixed(1)}%</span>
                <span className="font-medium capitalize">{ratios.profitability.roi.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Net Profit / Total Investment × 100</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.profitability.roa.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Return on Assets</h3>
                {getTrendIcon(ratios.profitability.roa.value, ratios.profitability.roa.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.profitability.roa.value.toFixed(1)}%</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.profitability.roa.target.toFixed(1)}%</span>
                <span className="font-medium capitalize">{ratios.profitability.roa.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Net Income / Total Assets × 100</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.profitability.roe.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Return on Equity</h3>
                {getTrendIcon(ratios.profitability.roe.value, ratios.profitability.roe.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.profitability.roe.value.toFixed(1)}%</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.profitability.roe.target.toFixed(1)}%</span>
                <span className="font-medium capitalize">{ratios.profitability.roe.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Net Income / Shareholder Equity × 100</p>
            </Card>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calculator className="h-5 w-5 text-purple-600" />
            </div>
            Efficiency Ratios
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Measure how effectively you use assets and manage operations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={`p-4 border-2 ${getStatusColor(ratios.efficiency.assetTurnover.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Asset Turnover</h3>
                {getTrendIcon(ratios.efficiency.assetTurnover.value, ratios.efficiency.assetTurnover.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.efficiency.assetTurnover.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.efficiency.assetTurnover.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.efficiency.assetTurnover.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Revenue / Total Assets</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.efficiency.inventoryTurnover.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Inventory Turnover</h3>
                {getTrendIcon(ratios.efficiency.inventoryTurnover.value, ratios.efficiency.inventoryTurnover.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.efficiency.inventoryTurnover.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.efficiency.inventoryTurnover.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.efficiency.inventoryTurnover.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">COGS / Average Inventory</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.efficiency.receivablesTurnover.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Receivables Turnover</h3>
                {getTrendIcon(
                  ratios.efficiency.receivablesTurnover.value,
                  ratios.efficiency.receivablesTurnover.target,
                )}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.efficiency.receivablesTurnover.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Target: {ratios.efficiency.receivablesTurnover.target.toFixed(2)}
                </span>
                <span className="font-medium capitalize">{ratios.efficiency.receivablesTurnover.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Revenue / Average Accounts Receivable</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.efficiency.payablesTurnover.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Payables Turnover</h3>
                {getTrendIcon(ratios.efficiency.payablesTurnover.value, ratios.efficiency.payablesTurnover.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.efficiency.payablesTurnover.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: {ratios.efficiency.payablesTurnover.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.efficiency.payablesTurnover.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">COGS / Average Accounts Payable</p>
            </Card>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
            Leverage Ratios
          </h2>
          <p className="text-sm text-muted-foreground mb-4">Assess your company's debt and financial structure</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`p-4 border-2 ${getStatusColor(ratios.leverage.debtToEquity.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Debt-to-Equity</h3>
                {getTrendIcon(ratios.leverage.debtToEquity.value, ratios.leverage.debtToEquity.target, true)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.leverage.debtToEquity.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: &lt; {ratios.leverage.debtToEquity.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.leverage.debtToEquity.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Total Debt / Total Equity</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.leverage.debtRatio.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Debt Ratio</h3>
                {getTrendIcon(ratios.leverage.debtRatio.value, ratios.leverage.debtRatio.target, true)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.leverage.debtRatio.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: &lt; {ratios.leverage.debtRatio.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.leverage.debtRatio.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Total Debt / Total Assets</p>
            </Card>

            <Card className={`p-4 border-2 ${getStatusColor(ratios.leverage.equityRatio.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Equity Ratio</h3>
                {getTrendIcon(ratios.leverage.equityRatio.value, ratios.leverage.equityRatio.target)}
              </div>
              <div className="text-3xl font-bold mb-2">{ratios.leverage.equityRatio.value.toFixed(2)}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Target: &gt; {ratios.leverage.equityRatio.target.toFixed(2)}</span>
                <span className="font-medium capitalize">{ratios.leverage.equityRatio.status}</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">Total Equity / Total Assets</p>
            </Card>
          </div>
        </Card>
      </div>

      <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Understanding Financial Ratios</h3>
            <p className="text-sm text-blue-800">
              These ratios are calculated based on your current financial statements. Industry benchmarks may vary. Use
              these metrics as guidelines to monitor your financial health and make informed business decisions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
