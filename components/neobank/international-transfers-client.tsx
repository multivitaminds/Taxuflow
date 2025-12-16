"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  ArrowUpRight,
  RefreshCw,
  Clock,
  AlertCircle,
  TrendingDown,
  Zap,
  Shield,
  Calendar,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { createNeobankTransfer } from "@/app/actions/neobank/create-transfer"

export function InternationalTransfersClient({ accounts = [] }: { accounts?: any[] }) {
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("EUR")
  const [recipient, setRecipient] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInternationalTransfer = async () => {
    if (!amount || !recipient) {
      toast({
        title: "Missing information",
        description: "Please enter amount and recipient",
        variant: "destructive",
      })
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const result = await createNeobankTransfer({
      fromAccountId: accounts[0]?.id,
      amount: amountNum,
      transferType: "wire",
      memo: `International transfer to ${recipient} (${selectedCurrency})`,
    })

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Transfer failed",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "International transfer initiated",
      description: `$${amountNum.toFixed(2)} transfer to ${recipient} is being processed`,
    })

    setAmount("")
    setRecipient("")

    setTimeout(() => window.location.reload(), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 pb-8 pt-3.5">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-[#635bff]" />
              <h1 className="text-2xl font-bold text-[#0a2540]">International Transfers</h1>
            </div>
            <p className="text-xs text-slate-600">Send money worldwide with competitive exchange rates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs bg-white border-slate-200">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Schedule Transfer
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs bg-white border-slate-200">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500 uppercase font-medium mb-0.5">Total Sent</p>
              <p className="text-lg font-semibold text-[#0a2540]">$24,580</p>
              <p className="text-[10px] text-slate-500 mt-0.5">This quarter</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500 uppercase font-medium mb-0.5">Active Transfers</p>
              <p className="text-lg font-semibold text-[#0a2540]">3</p>
              <p className="text-[10px] text-slate-500 mt-0.5">In progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <p className="text-[10px] text-slate-500 uppercase font-medium mb-0.5">Countries</p>
              <p className="text-lg font-semibold text-[#0a2540]">12</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Recipients</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-1.5">
                <p className="text-[10px] text-slate-500 uppercase font-medium mb-0.5">Avg. Fee</p>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-[9px] px-1 py-0 h-4">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  Updates every 60s
                </Badge>
              </div>
              <p className="text-lg font-semibold text-[#0a2540]">$18.50</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <Tabs defaultValue="send" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-8 bg-slate-100 p-0.5 mb-4">
                    <TabsTrigger value="send" className="text-xs h-7">
                      <Globe className="mr-1 h-3 w-3" />
                      Send Money
                    </TabsTrigger>
                    <TabsTrigger value="rates" className="text-xs h-7">
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Live Rates
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="send" className="space-y-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Send to</Label>
                      <Input
                        placeholder="Search recipient or add new"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>

                    {/* Quick Recipients */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: "Tech Solutions Ltd", country: "United Kingdom", flag: "🇬🇧" },
                        { name: "Global Marketing GmbH", country: "Germany", flag: "🇩🇪" },
                        { name: "Supplier Co. Ltd", country: "Japan", flag: "🇯🇵" },
                      ].map((person, idx) => (
                        <button
                          key={idx}
                          onClick={() => setRecipient(person.name)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all hover:scale-105",
                            recipient === person.name ? "ring-2 ring-[#635bff] ring-offset-1 bg-[#635bff]/10" : "",
                          )}
                        >
                          <span className="mr-1">{person.flag}</span>
                          <span className="font-semibold">{person.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">You send</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="h-9 text-sm"
                          />
                        </div>
                        <select className="h-9 px-3 border border-slate-200 rounded-md text-xs font-medium bg-white">
                          <option>🇺🇸 USD</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Available: ${accounts[0]?.balance?.toLocaleString() || "47,850.00"}
                      </p>
                    </div>

                    {/* Exchange Rate Display */}
                    <div className="flex items-center justify-center py-2">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <RefreshCw className="h-3 w-3" />
                        <span className="font-semibold text-[#635bff]">1 USD = 0.93200 {selectedCurrency}</span>
                        <Badge className="bg-green-100 text-green-700 text-[9px] px-1 py-0 h-3.5">
                          <Clock className="h-2 w-2 mr-0.5" />
                          Updates every 60s
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Recipient gets</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="0.00"
                            value={amount ? (Number.parseFloat(amount) * 0.932).toFixed(2) : ""}
                            readOnly
                            className="h-9 text-sm bg-slate-50"
                          />
                        </div>
                        <select
                          className="h-9 px-3 border border-slate-200 rounded-md text-xs font-medium bg-white"
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                        >
                          <option>🇪🇺 EUR</option>
                          <option>🇬🇧 GBP</option>
                          <option>🇯🇵 JPY</option>
                          <option>🇦🇺 AUD</option>
                          <option>🇨🇦 CAD</option>
                        </select>
                      </div>
                    </div>

                    {/* Exchange Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Current Exchange Rate</span>
                            <span className="font-semibold text-[#0a2540]">1 USD = 0.93200 EUR</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Transfer Fee</span>
                            <span className="font-semibold text-[#0a2540]">$15.00</span>
                          </div>
                          <div className="h-px bg-slate-200 my-1.5"></div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-700 font-medium">Total Cost</span>
                            <span className="font-semibold text-[#0a2540]">
                              ${amount ? (Number.parseFloat(amount) + 15).toFixed(2) : "15.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-slate-700">Transfer purpose</Label>
                      <select className="w-full h-9 px-3 border border-slate-200 rounded-md text-xs bg-white">
                        <option>Business services</option>
                        <option>Goods purchase</option>
                        <option>Invoice payment</option>
                        <option>Salary payment</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <Button
                      size="sm"
                      disabled={isSubmitting}
                      className="w-full h-9 text-sm font-medium bg-[#635bff] hover:bg-[#5651e0] text-white"
                      onClick={handleInternationalTransfer}
                    >
                      {isSubmitting ? "Processing..." : "Review Transfer"}
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-medium text-amber-900 mb-0.5">Compliance requirements</p>
                          <p className="text-[10px] text-amber-700">
                            International transfers may require additional documentation. You'll be notified if anything
                            is needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Rates Tab Content */}
                  <TabsContent value="rates" className="space-y-3 mt-4">
                    {/* Exchange Rates List */}
                    <div className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">🇪🇺</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">USD/EUR</p>
                            <p className="text-xs text-slate-600 mt-0.5">1 USD = 0.9200 EUR</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                            <TrendingDown className="h-3 w-3 mr-0.5" />
                            -0.24%
                          </div>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2 bg-transparent">
                            Use Rate
                          </Button>
                        </div>
                      </div>
                      {/* Additional Rates */}
                      {/* ... existing rates tab content ... */}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent & Why Choose */}
          <div className="space-y-4">
            {/* Recent Transfers */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-[#0a2540] mb-3">Recent Transfers</h3>
                <p className="text-xs text-slate-500 mb-3">Your international payment history</p>

                <div className="space-y-2">
                  {[
                    {
                      name: "Tech Solutions Ltd",
                      country: "🇬🇧 United Kingdom",
                      amount: "$5,240",
                      currency: "4,140.8 GBP",
                      status: "Completed",
                    },
                    {
                      name: "Global Marketing GmbH",
                      country: "🇩🇪 Germany",
                      amount: "$8,500",
                      currency: "7,820 EUR",
                      status: "Processing",
                    },
                    {
                      name: "Supplier Co. Ltd",
                      country: "🇯🇵 Japan",
                      amount: "$3,200",
                      currency: "475,264 JPY",
                      status: "Completed",
                    },
                  ].map((transfer, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <p className="text-xs font-semibold text-[#0a2540]">{transfer.name}</p>
                          <p className="text-[10px] text-slate-500">{transfer.country}</p>
                        </div>
                        <Badge
                          className={cn(
                            "text-[9px] px-1.5 py-0 h-4",
                            transfer.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700",
                          )}
                        >
                          {transfer.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0a2540]">Sent</span>
                        <span className="text-xs text-slate-600">{transfer.amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0a2540]">Received</span>
                        <span className="text-xs text-slate-600">{transfer.currency}</span>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200">
                        <p className="text-[10px] text-slate-500">Dec 29, 2024 • Fee: $25</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Taxu */}
            <Card className="bg-gradient-to-br from-[#635bff] to-[#5651e0] text-white border-none shadow-lg">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  Why choose Taxu?
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      icon: <TrendingDown className="h-3.5 w-3.5" />,
                      title: "Low fees",
                      desc: "Save up to 85% on wire fees",
                    },
                    {
                      icon: <Zap className="h-3.5 w-3.5" />,
                      title: "Fast transfers",
                      desc: "Money arrives in 1-2 business days",
                    },
                    {
                      icon: <Shield className="h-3.5 w-3.5" />,
                      title: "Secure & compliant",
                      desc: "Bank-level security and regulation",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{item.title}</p>
                        <p className="text-[10px] text-white/80">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
