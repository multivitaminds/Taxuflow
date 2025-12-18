"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, Star, Plus, Eye } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const marketIndices = [
  { name: "S&P 500", symbol: "SPX", value: 4783.45, change: 32.87, changePercent: 0.69, color: "text-green-600" },
  { name: "Nasdaq", symbol: "IXIC", value: 15091.23, change: -18.45, changePercent: -0.12, color: "text-red-600" },
  { name: "Dow Jones", symbol: "DJI", value: 37440.34, change: 156.78, changePercent: 0.42, color: "text-green-600" },
  { name: "Russell 2000", symbol: "RUT", value: 2045.67, change: 8.92, changePercent: 0.44, color: "text-green-600" },
]

const trendingStocks = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 495.34,
    change: 12.45,
    changePercent: 2.58,
    volume: "52.4M",
    taxEfficiency: "High",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 238.45,
    change: -5.67,
    changePercent: -2.32,
    volume: "105.8M",
    taxEfficiency: "Medium",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 478.23,
    change: 8.91,
    changePercent: 1.9,
    volume: "18.7M",
    taxEfficiency: "High",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.45,
    change: 2.34,
    changePercent: 1.33,
    volume: "62.3M",
    taxEfficiency: "High",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    price: 147.23,
    change: 1.89,
    changePercent: 1.3,
    volume: "41.2M",
    taxEfficiency: "Medium",
  },
]

const topGainers = [
  { symbol: "SMCI", name: "Super Micro Computer", price: 789.45, changePercent: 15.67 },
  { symbol: "COIN", name: "Coinbase Global", price: 234.56, changePercent: 12.34 },
  { symbol: "RIOT", name: "Riot Platforms", price: 18.92, changePercent: 9.87 },
]

const topLosers = [
  { symbol: "PLUG", name: "Plug Power Inc.", price: 4.23, changePercent: -8.45 },
  { symbol: "LCID", name: "Lucid Group", price: 3.67, changePercent: -6.78 },
  { symbol: "RIVN", name: "Rivian Automotive", price: 21.34, changePercent: -5.23 },
]

const chartData = [
  { time: "9:30", value: 4750 },
  { time: "10:00", value: 4755 },
  { time: "10:30", value: 4760 },
  { time: "11:00", value: 4758 },
  { time: "11:30", value: 4765 },
  { time: "12:00", value: 4770 },
  { time: "12:30", value: 4768 },
  { time: "1:00", value: 4775 },
  { time: "1:30", value: 4780 },
  { time: "2:00", value: 4783 },
]

export function MarketsDashboard({ user, profile }: { user: any; profile: any }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Market Overview</h1>
            <p className="text-slate-600 mt-1">Real-time market data with tax-optimized insights</p>
          </div>
          <div className="flex gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search stocks, ETFs, or funds..." className="pl-10 bg-white border-slate-200" />
            </div>
          </div>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {marketIndices.map((index) => (
            <Card
              key={index.symbol}
              className="p-4 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{index.name}</span>
                <span className="text-xs text-slate-400">{index.symbol}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{index.value.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 mt-1 ${index.color}`}>
                    {index.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {index.change > 0 ? "+" : ""}
                      {index.change.toFixed(2)} ({index.changePercent > 0 ? "+" : ""}
                      {index.changePercent}%)
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* S&P 500 Chart */}
        <Card className="p-6 bg-white border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">S&P 500 Intraday</h3>
              <p className="text-sm text-slate-600">Live market tracking</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                1D
              </Button>
              <Button variant="outline" size="sm">
                5D
              </Button>
              <Button variant="outline" size="sm">
                1M
              </Button>
              <Button variant="outline" size="sm">
                6M
              </Button>
              <Button variant="outline" size="sm">
                1Y
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[4740, 4790]} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#635bff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="trending">Trending Stocks</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            <Card className="p-6 bg-white border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Symbol</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Price</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Change</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Volume</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Tax Efficiency</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingStocks.map((stock) => (
                      <tr key={stock.symbol} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900">{stock.symbol}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">{stock.name}</td>
                        <td className="py-4 px-4 text-right text-sm font-medium text-slate-900">
                          ${stock.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {stock.change >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={
                                stock.change >= 0
                                  ? "text-green-600 font-medium text-sm"
                                  : "text-red-600 font-medium text-sm"
                              }
                            >
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change.toFixed(2)} ({stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-sm text-slate-600">{stock.volume}</td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              stock.taxEfficiency === "High"
                                ? "border-green-300 bg-green-50 text-green-700"
                                : "border-yellow-300 bg-yellow-50 text-yellow-700"
                            }
                          >
                            {stock.taxEfficiency}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="bg-indigo-600 text-white h-8 px-3">
                              <Plus className="h-4 w-4 mr-1" />
                              Buy
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gainers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topGainers.map((stock) => (
                <Card
                  key={stock.symbol}
                  className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">{stock.symbol}</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-semibold">+{stock.changePercent}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{stock.name}</p>
                  <p className="text-2xl font-bold text-slate-900">${stock.price.toFixed(2)}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Watch
                    </Button>
                    <Button size="sm" className="flex-1 bg-green-600 text-white">
                      Buy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="losers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topLosers.map((stock) => (
                <Card
                  key={stock.symbol}
                  className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">{stock.symbol}</span>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm font-semibold">{stock.changePercent}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{stock.name}</p>
                  <p className="text-2xl font-bold text-slate-900">${stock.price.toFixed(2)}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Watch
                    </Button>
                    <Button size="sm" className="flex-1 bg-indigo-600 text-white">
                      Buy Dip
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
