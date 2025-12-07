"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Globe,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Zap,
  DollarSign,
  Building2,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowUpRight,
  Download,
  Calendar,
  Search,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const exchangeRates = [
  { from: "USD", to: "EUR", rate: 0.92, change: -0.24, trending: "down" },
  { from: "USD", to: "GBP", rate: 0.79, change: 0.12, trending: "up" },
  { from: "USD", to: "JPY", rate: 148.52, change: 0.45, trending: "up" },
  { from: "USD", to: "CAD", rate: 1.36, change: -0.08, trending: "down" },
  { from: "USD", to: "AUD", rate: 1.52, change: 0.18, trending: "up" },
  { from: "USD", to: "CHF", rate: 0.88, change: -0.15, trending: "down" },
]

const recentTransfers = [
  {
    id: "1",
    recipient: "Tech Solutions Ltd",
    country: "United Kingdom",
    amount: 5240.0,
    currency: "GBP",
    converted: 4140.8,
    rate: 0.79,
    status: "completed",
    date: "Dec 29, 2024",
    method: "SWIFT",
    fee: 25.0,
  },
  {
    id: "2",
    recipient: "Global Marketing GmbH",
    country: "Germany",
    amount: 8500.0,
    currency: "EUR",
    converted: 7820.0,
    rate: 0.92,
    status: "processing",
    date: "Dec 28, 2024",
    method: "SEPA",
    fee: 15.0,
  },
  {
    id: "3",
    recipient: "Supplier Co. Ltd",
    country: "Japan",
    amount: 3200.0,
    currency: "JPY",
    converted: 475264.0,
    rate: 148.52,
    status: "completed",
    date: "Dec 27, 2024",
    method: "SWIFT",
    fee: 30.0,
  },
]

const popularRecipients = [
  { name: "Tech Solutions Ltd", country: "United Kingdom", currency: "GBP", avatar: "TS" },
  { name: "Global Marketing GmbH", country: "Germany", currency: "EUR", avatar: "GM" },
  { name: "Supplier Co. Ltd", country: "Japan", currency: "JPY", avatar: "SC" },
]

export function InternationalTransfersClient() {
  const [sendAmount, setSendAmount] = useState("")
  const [receiveAmount, setReceiveAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [activeTab, setActiveTab] = useState("send")

  const handleAmountChange = (value: string, type: "send" | "receive") => {
    const rate = exchangeRates.find((r) => r.to === selectedCurrency)?.rate || 0.92
    if (type === "send") {
      setSendAmount(value)
      setReceiveAmount(value ? (Number.parseFloat(value) * rate).toFixed(2) : "")
    } else {
      setReceiveAmount(value)
      setSendAmount(value ? (Number.parseFloat(value) / rate).toFixed(2) : "")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Completed</Badge>
        )
      case "processing":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">Processing</Badge>
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getCurrencyFlag = (currency: string) => {
    const flags: Record<string, string> = {
      EUR: "🇪🇺",
      GBP: "🇬🇧",
      JPY: "🇯🇵",
      CAD: "🇨🇦",
      AUD: "🇦🇺",
      CHF: "🇨🇭",
    }
    return flags[currency] || "🌍"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Globe className="h-6 w-6" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">International Transfers</h1>
              </div>
              <p className="text-white/80 text-lg">Send money worldwide with competitive exchange rates</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Transfer
              </Button>
              <Button variant="secondary" className="bg-white text-[#635bff] hover:bg-white/90">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Total Sent</p>
              <p className="text-3xl font-bold">$24,580</p>
              <p className="text-sm text-white/60 mt-1">This quarter</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Active Transfers</p>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-white/60 mt-1">In progress</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Countries</p>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-white/60 mt-1">Recipients</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Avg. Fee</p>
              <p className="text-3xl font-bold">$18.50</p>
              <p className="text-sm text-emerald-300 mt-1 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                12% lower
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100 pb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1">
                    <TabsTrigger value="send" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Globe className="h-4 w-4 mr-2" />
                      Send Money
                    </TabsTrigger>
                    <TabsTrigger value="rates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Live Rates
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="send" className="space-y-6 mt-0">
                    {/* Recipient Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Send to</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search recipient or add new" className="pl-10 h-12" />
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {popularRecipients.map((recipient, i) => (
                          <button
                            key={i}
                            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full hover:border-[#635bff] hover:bg-[#635bff]/5 transition-all group"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-[#635bff] to-[#00d4ff] text-white">
                                {recipient.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                              <p className="text-sm font-medium group-hover:text-[#635bff]">{recipient.name}</p>
                              <p className="text-xs text-slate-500">
                                {getCurrencyFlag(recipient.currency)} {recipient.country}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Section */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 space-y-4">
                        <div>
                          <Label className="text-sm text-slate-600 mb-2">You send</Label>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                              <Input
                                className="text-3xl font-bold h-16 border-0 bg-transparent pl-0 focus-visible:ring-0"
                                placeholder="0.00"
                                value={sendAmount}
                                onChange={(e) => handleAmountChange(e.target.value, "send")}
                                type="number"
                              />
                            </div>
                            <Select defaultValue="USD">
                              <SelectTrigger className="w-32 h-12 border-slate-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">🇺🇸 USD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-sm text-slate-500 mt-2">Available: $47,850.00</p>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-[#635bff] flex items-center justify-center shadow-lg">
                            <ArrowRightLeft className="h-5 w-5 text-white" />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-slate-600 mb-2">Recipient gets</Label>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                              <Input
                                className="text-3xl font-bold h-16 border-0 bg-transparent pl-0 focus-visible:ring-0"
                                placeholder="0.00"
                                value={receiveAmount}
                                onChange={(e) => handleAmountChange(e.target.value, "receive")}
                                type="number"
                              />
                            </div>
                            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                              <SelectTrigger className="w-32 h-12 border-slate-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
                                <SelectItem value="GBP">🇬🇧 GBP</SelectItem>
                                <SelectItem value="JPY">🇯🇵 JPY</SelectItem>
                                <SelectItem value="CAD">🇨🇦 CAD</SelectItem>
                                <SelectItem value="AUD">🇦🇺 AUD</SelectItem>
                                <SelectItem value="CHF">🇨🇭 CHF</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Exchange Rate Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 mb-1">Current Exchange Rate</p>
                            <p className="text-sm text-blue-700">
                              1 USD ={" "}
                              {exchangeRates.find((r) => r.to === selectedCurrency)?.rate.toFixed(4) || "0.9200"}{" "}
                              {selectedCurrency}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-700">Updates every 60s</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-700">Rate locked for 30 min</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Method */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Transfer method</Label>
                      <div className="grid gap-3">
                        <button className="border-2 border-[#635bff] bg-[#635bff]/5 rounded-xl p-4 text-left relative">
                          <div className="absolute top-4 right-4">
                            <CheckCircle2 className="h-5 w-5 text-[#635bff]" />
                          </div>
                          <div className="flex items-start gap-3 pr-8">
                            <Zap className="h-6 w-6 text-[#635bff] flex-shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">Fast Transfer</p>
                                <Badge className="bg-[#635bff] text-white border-0">Recommended</Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">Arrives in 1-2 business days</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">Fee: $15.00</span>
                              </div>
                            </div>
                          </div>
                        </button>

                        <button className="border-2 border-slate-200 hover:border-slate-300 rounded-xl p-4 text-left transition-all">
                          <div className="flex items-start gap-3">
                            <Building2 className="h-6 w-6 text-slate-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold mb-1">Standard SWIFT</p>
                              <p className="text-sm text-slate-600 mb-2">Arrives in 3-5 business days</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-900">Fee: $25.00</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Transfer purpose</Label>
                      <Select defaultValue="business">
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business services</SelectItem>
                          <SelectItem value="goods">Payment for goods</SelectItem>
                          <SelectItem value="salary">Salary payment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Submit */}
                    <Button
                      size="lg"
                      className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#635bff] to-[#00d4ff] hover:opacity-90 text-white shadow-lg"
                      onClick={() => toast.success("International transfer initiated")}
                    >
                      Review Transfer
                      <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Button>

                    {/* Compliance Notice */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900 mb-1">Compliance requirements</p>
                          <p className="text-sm text-amber-700">
                            International transfers may require additional documentation. You'll be notified if anything
                            is needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rates" className="space-y-6 mt-0">
                    <div className="space-y-3">
                      {exchangeRates.map((rate) => (
                        <div
                          key={rate.to}
                          className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-xl p-5 hover:border-[#635bff] hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-3xl">{getCurrencyFlag(rate.to)}</div>
                              <div>
                                <p className="font-semibold text-lg group-hover:text-[#635bff] transition-colors">
                                  {rate.from}/{rate.to}
                                </p>
                                <p className="text-sm text-slate-600">
                                  1 {rate.from} = {rate.rate.toFixed(4)} {rate.to}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-slate-900">{rate.rate.toFixed(4)}</p>
                              <div
                                className={cn(
                                  "flex items-center gap-1 text-sm font-medium",
                                  rate.trending === "up" ? "text-emerald-600" : "text-red-600",
                                )}
                              >
                                {rate.trending === "up" ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                                {Math.abs(rate.change)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-2">Rate alerts</h3>
                          <p className="text-sm text-blue-700 mb-4">
                            Set up notifications when exchange rates hit your target price
                          </p>
                          <Button variant="outline" className="bg-white hover:bg-blue-50 text-blue-700 border-blue-300">
                            Create Alert
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar - Recent Transfers */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Recent Transfers</CardTitle>
                <CardDescription>Your international payment history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 hover:border-[#635bff] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm group-hover:text-[#635bff] transition-colors">
                          {transfer.recipient}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Globe className="h-3 w-3" />
                          {transfer.country}
                        </p>
                      </div>
                      {getStatusBadge(transfer.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Sent</span>
                        <span className="font-semibold">${transfer.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Received</span>
                        <span className="font-semibold">
                          {transfer.converted.toLocaleString()} {transfer.currency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                        <span className="text-slate-600 text-xs">{transfer.date}</span>
                        <span className="text-xs text-slate-500">Fee: ${transfer.fee}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card className="border-slate-200 shadow-lg bg-gradient-to-br from-[#635bff]/5 to-[#00d4ff]/5">
              <CardHeader>
                <CardTitle className="text-lg">Why choose Taxu?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Low fees</p>
                    <p className="text-xs text-slate-600">Save up to 85% vs traditional banks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fast transfers</p>
                    <p className="text-xs text-slate-600">Money arrives in 1-2 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Secure & compliant</p>
                    <p className="text-xs text-slate-600">Bank-level security and regulation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
