"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, Coins, DollarSign, ArrowUpRight, ArrowDownLeft, RefreshCw, Wallet, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"


const cryptoData = [
  { date: "Jan", btc: 42000, eth: 2200, portfolio: 45000 },
  { date: "Feb", btc: 44000, eth: 2400, portfolio: 48000 },
  { date: "Mar", btc: 58000, eth: 3200, portfolio: 65000 },
  { date: "Apr", btc: 62000, eth: 3100, portfolio: 68000 },
  { date: "May", btc: 59000, eth: 2900, portfolio: 64000 },
  { date: "Jun", btc: 65000, eth: 3500, portfolio: 72000 },
]

export function CryptoDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0a2540]">Crypto Wallet</h1>
          <p className="text-slate-600 mt-2">Manage your digital assets and tax refunds</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white" disabled={true} title="Coming soon">
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Receive
          </Button>
          <Button variant="outline" className="bg-white" disabled={true} title="Coming soon">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#4f46e5]" disabled={true} title="Coming soon">
            <RefreshCw className="h-4 w-4 mr-2" />
            Swap
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <Card className="bg-[#0a2540] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-300 text-sm font-medium">Total Crypto Balance</p>
                <h2 className="text-3xl font-bold mt-2">$12,450.80</h2>
                <div className="flex items-center mt-2 text-emerald-400 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+15.4% this month</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Settings */}
        <Card className="md:col-span-2 bg-gradient-to-r from-[#635bff] to-[#8f8bf5] text-white border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Get Your Tax Refund in Bitcoin</h3>
                <p className="text-white/80">
                  Automatically convert your IRS tax refund into BTC, ETH, or USDC with zero fees.
                </p>
              </div>
              <Button variant="secondary" className="whitespace-nowrap text-[#635bff]" asChild>
                <a href="/neobank/crypto/settings">Enable Crypto Refund</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Asset List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-[#635bff]/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Bitcoin className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0a2540]">Bitcoin</h4>
                      <p className="text-sm text-slate-500">BTC</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0a2540]">$8,240.50</p>
                    <p className="text-sm text-slate-500">0.1245 BTC</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-[#635bff]/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Coins className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0a2540]">Ethereum</h4>
                      <p className="text-sm text-slate-500">ETH</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0a2540]">$3,150.20</p>
                    <p className="text-sm text-slate-500">1.25 ETH</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-[#635bff]/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0a2540]">USDC</h4>
                      <p className="text-sm text-slate-500">USD Coin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0a2540]">$1,060.10</p>
                    <p className="text-sm text-slate-500">1,060.10 USDC</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cryptoData}>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      itemStyle={{ color: "#0a2540" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#635bff"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#635bff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Tax Events */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                      <ArrowDownLeft className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0a2540]">Received BTC</p>
                      <p className="text-xs text-slate-500">Today, 2:30 PM</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">+$250.00</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-full">
                      <RefreshCw className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0a2540]">Swapped ETH &gt; USDC</p>
                      <p className="text-xs text-slate-500">Yesterday</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#0a2540]">$1,200.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Events</CardTitle>
              <CardDescription>Estimated taxes for 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Short-term Gains</span>
                  <span className="text-sm font-medium text-[#0a2540]">$1,250.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Long-term Gains</span>
                  <span className="text-sm font-medium text-[#0a2540]">$4,500.00</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-medium text-[#0a2540]">Est. Tax Liability</span>
                  <span className="font-bold text-red-500">$850.00</span>
                </div>
                <Button variant="outline" className="w-full mt-2 bg-transparent" disabled={true} title="Coming soon">
                  View Tax Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
