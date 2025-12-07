"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Plus, Minus, RefreshCw, Wallet, Activity, Send, Download } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts"

const cryptoAssets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: 0.45821,
    value: 19234.87,
    price: 41987.23,
    change: 5.42,
    chartData: [
      { time: "00:00", price: 39500 },
      { time: "04:00", price: 40200 },
      { time: "08:00", price: 39800 },
      { time: "12:00", price: 41200 },
      { time: "16:00", price: 41500 },
      { time: "20:00", price: 41987 },
    ],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: 8.2341,
    value: 18450.23,
    price: 2241.12,
    change: -2.18,
    chartData: [
      { time: "00:00", price: 2280 },
      { time: "04:00", price: 2290 },
      { time: "08:00", price: 2270 },
      { time: "12:00", price: 2250 },
      { time: "16:00", price: 2235 },
      { time: "20:00", price: 2241 },
    ],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: 12500,
    value: 12500,
    price: 1.0,
    change: 0.01,
    chartData: [
      { time: "00:00", price: 1.0 },
      { time: "04:00", price: 1.0 },
      { time: "08:00", price: 1.0 },
      { time: "12:00", price: 1.0 },
      { time: "16:00", price: 1.0 },
      { time: "20:00", price: 1.0 },
    ],
  },
  {
    symbol: "SOL",
    name: "Solana",
    balance: 125.45,
    value: 5420.87,
    price: 43.21,
    change: 8.34,
    chartData: [
      { time: "00:00", price: 39.8 },
      { time: "04:00", price: 40.5 },
      { time: "08:00", price: 41.2 },
      { time: "12:00", price: 42.1 },
      { time: "16:00", price: 42.8 },
      { time: "20:00", price: 43.21 },
    ],
  },
]

const recentTransactions = [
  { type: "buy", asset: "BTC", amount: 0.0234, value: 982.45, time: "2 hours ago", status: "completed" },
  { type: "sell", asset: "ETH", amount: 1.5, value: 3361.68, time: "5 hours ago", status: "completed" },
  { type: "transfer", asset: "USDC", amount: 5000, value: 5000, time: "1 day ago", status: "completed" },
  { type: "buy", asset: "SOL", amount: 50, value: 2160.5, time: "2 days ago", status: "completed" },
]

export function CryptoTradingPlatform() {
  const [selectedAsset, setSelectedAsset] = useState(cryptoAssets[0])
  const [tradeAmount, setTradeAmount] = useState("")
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")

  const totalPortfolioValue = cryptoAssets.reduce((sum, asset) => sum + asset.value, 0)
  const portfolioChange = 4.73

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Crypto Trading</h1>
            <p className="text-slate-400">Trade Bitcoin, Ethereum, and more</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Statements
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Prices
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-yellow-500 to-orange-500 border-none text-black">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium opacity-80 mb-1">Total Portfolio Value</p>
                  <h2 className="text-4xl font-bold">
                    ${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <Badge className="bg-black/20 text-black border-none">
                  {portfolioChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {portfolioChange}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs opacity-70 mb-1">24h Change</p>
                  <p className="text-lg font-bold">+$2,341.23</p>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">All Time Gain</p>
                  <p className="text-lg font-bold">+$18,234.56</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="h-5 w-5 text-blue-400" />
                <p className="text-sm text-slate-400">Cash Balance</p>
              </div>
              <h3 className="text-2xl font-bold mb-1">$25,480.00</h3>
              <p className="text-xs text-slate-400">Available to trade</p>
              <Button size="sm" className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-3 w-3 mr-1" /> Add Funds
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-green-400" />
                <p className="text-sm text-slate-400">24h Volume</p>
              </div>
              <h3 className="text-2xl font-bold mb-1">$48,234</h3>
              <p className="text-xs text-slate-400">Trading activity</p>
              <Button size="sm" variant="outline" className="w-full mt-4 bg-transparent border-slate-600">
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset List */}
          <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {cryptoAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`w-full p-4 hover:bg-slate-700/50 transition-colors text-left ${
                      selectedAsset.symbol === asset.symbol ? "bg-slate-700/50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                          {asset.symbol.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{asset.symbol}</h3>
                            <span className="text-xs text-slate-400">{asset.name}</span>
                          </div>
                          <p className="text-sm text-slate-400">
                            {asset.balance} {asset.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold">${asset.value.toLocaleString()}</p>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            asset.change > 0
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}
                        >
                          {asset.change > 0 ? "+" : ""}
                          {asset.change}%
                        </Badge>
                      </div>
                      <div className="h-12 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={asset.chartData}>
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke={asset.change > 0 ? "#10b981" : "#ef4444"}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trading Panel */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Trade {selectedAsset.symbol}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as "buy" | "sell")}>
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">
                    Sell
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white text-lg"
                />
              </div>

              <div className="bg-slate-700 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Price</span>
                  <span className="font-medium">${selectedAsset.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="font-medium">
                    {tradeAmount ? (Number(tradeAmount) / selectedAsset.price).toFixed(6) : "0.00"}{" "}
                    {selectedAsset.symbol}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-600">
                  <span className="text-slate-400">Total</span>
                  <span className="font-bold text-lg">${tradeAmount || "0.00"}</span>
                </div>
              </div>

              <Button
                className={`w-full ${tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                size="lg"
              >
                {tradeType === "buy" ? "Buy" : "Sell"} {selectedAsset.symbol}
              </Button>

              <div className="pt-4 border-t border-slate-700 space-y-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent border-slate-600">
                  <Send className="h-3 w-3 mr-2" /> Send {selectedAsset.symbol}
                </Button>
                <Button variant="outline" size="sm" className="w-full bg-transparent border-slate-600">
                  <Download className="h-3 w-3 mr-2" /> Receive {selectedAsset.symbol}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart */}
          <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedAsset.name} Price</CardTitle>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-3xl font-bold">${selectedAsset.price.toLocaleString()}</span>
                    <Badge
                      className={`${
                        selectedAsset.change > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {selectedAsset.change > 0 ? "+" : ""}
                      {selectedAsset.change}%
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["1D", "1W", "1M", "1Y"].map((period) => (
                    <Button key={period} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedAsset.chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={selectedAsset.change > 0 ? "#10b981" : "#ef4444"}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={selectedAsset.change > 0 ? "#10b981" : "#ef4444"}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={selectedAsset.change > 0 ? "#10b981" : "#ef4444"}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {recentTransactions.map((txn, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            txn.type === "buy"
                              ? "bg-green-500/20 text-green-400"
                              : txn.type === "sell"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {txn.type === "buy" ? (
                            <Plus className="h-4 w-4" />
                          ) : txn.type === "sell" ? (
                            <Minus className="h-4 w-4" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {txn.type} {txn.asset}
                          </p>
                          <p className="text-xs text-slate-400">{txn.time}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{txn.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        {txn.amount} {txn.asset}
                      </span>
                      <span className="font-medium">${txn.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
