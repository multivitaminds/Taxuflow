"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const holdings = [
  {
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    shares: 45.2,
    avgCost: 218.5,
    currentPrice: 245.8,
    value: 11110.16,
    gain: 1233.76,
    gainPercent: 12.49,
  },
  {
    symbol: "VXUS",
    name: "Vanguard Total International Stock ETF",
    shares: 120.0,
    avgCost: 54.2,
    currentPrice: 58.75,
    value: 7050.0,
    gain: 546.0,
    gainPercent: 8.39,
  },
  {
    symbol: "BND",
    name: "Vanguard Total Bond Market ETF",
    shares: 80.0,
    avgCost: 73.5,
    currentPrice: 71.2,
    value: 5696.0,
    gain: -184.0,
    gainPercent: -3.13,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 15.0,
    avgCost: 165.0,
    currentPrice: 192.5,
    value: 2887.5,
    gain: 412.5,
    gainPercent: 16.67,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 8.0,
    avgCost: 310.0,
    currentPrice: 378.9,
    value: 3031.2,
    gain: 551.2,
    gainPercent: 22.23,
  },
]

const totalValue = holdings.reduce((sum, h) => sum + h.value, 0)
const totalGain = holdings.reduce((sum, h) => sum + h.gain, 0)
const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100

export default function HoldingsPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0a2540] mb-2">Investment Holdings</h1>
        <p className="text-slate-500">Track your portfolio performance and tax implications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#635bff]" />
            <span className="text-sm text-slate-500">Total Value</span>
          </div>
          <div className="text-3xl font-bold text-[#0a2540]">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            {totalGain >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm text-slate-500">Unrealized Gain/Loss</span>
          </div>
          <div className={`text-3xl font-bold ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${totalGain >= 0 ? "text-green-500" : "text-red-500"}`}>
            {totalGainPercent >= 0 ? "+" : ""}{totalGainPercent.toFixed(2)}%
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-[#635bff]" />
            <span className="text-sm text-slate-500">Tax Impact</span>
          </div>
          <div className="text-3xl font-bold text-[#0a2540]">
            ${(totalGain > 0 ? totalGain * 0.15 : 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-slate-500">Est. capital gains tax (15%)</div>
        </Card>
      </div>

      <Card className="bg-white border-slate-200">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0a2540]">Holdings</h2>
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-600">
              Export for Tax Filing
            </Button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="grid grid-cols-7 gap-4 px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">Asset</div>
            <div className="text-right">Shares</div>
            <div className="text-right">Avg Cost</div>
            <div className="text-right">Price</div>
            <div className="text-right">Value</div>
            <div className="text-right">Gain/Loss</div>
          </div>

          {holdings.map((holding) => (
            <div key={holding.symbol} className="grid grid-cols-7 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
              <div className="col-span-2">
                <div className="font-semibold text-[#0a2540]">{holding.symbol}</div>
                <div className="text-sm text-slate-500">{holding.name}</div>
              </div>
              <div className="text-right text-sm text-slate-700">{holding.shares}</div>
              <div className="text-right text-sm text-slate-700">${holding.avgCost.toFixed(2)}</div>
              <div className="text-right text-sm text-slate-700">${holding.currentPrice.toFixed(2)}</div>
              <div className="text-right text-sm font-medium text-[#0a2540]">
                ${holding.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-right">
                <div className={`flex items-center justify-end gap-1 text-sm font-medium ${holding.gain >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {holding.gain >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  ${Math.abs(holding.gain).toFixed(2)}
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${holding.gain >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {holding.gainPercent >= 0 ? "+" : ""}{holding.gainPercent.toFixed(2)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
