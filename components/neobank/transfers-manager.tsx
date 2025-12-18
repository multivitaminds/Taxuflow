"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeftRight,
  Send,
  Download,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Search,
  Zap,
  RefreshCw,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { createNeobankTransfer } from "@/app/actions/neobank/create-transfer"

const recentRecipients = [
  { name: "Sarah Jones", handle: "$sarahj", avatar: "SJ", type: "Taxu P2P" },
  { name: "Acme Corp", handle: "ACH ••4291", avatar: "AC", type: "Vendor" },
  { name: "Alex Smith", handle: "$asmith", avatar: "AS", type: "Taxu P2P" },
]

const recentTransfersData = [
  {
    id: "1",
    recipient: "Acme Corporation",
    amount: -5240.0,
    status: "completed",
    method: "ACH",
    date: "Today, 2:45 PM",
    type: "outgoing",
    reference: "Invoice #1234",
  },
  {
    id: "2",
    recipient: "Sarah Johnson",
    amount: -1250.0,
    status: "pending",
    method: "Wire",
    date: "Today, 11:20 AM",
    type: "outgoing",
    reference: "Contractor payment",
  },
  {
    id: "3",
    recipient: "Tech Solutions Inc",
    amount: 8500.0,
    status: "completed",
    method: "ACH",
    date: "Yesterday, 3:30 PM",
    type: "incoming",
    reference: "Payment received",
  },
  {
    id: "4",
    recipient: "Tax Bucket - Federal",
    amount: -2100.0,
    status: "completed",
    method: "Internal",
    date: "Dec 28, 2024",
    type: "internal",
    reference: "Automated savings",
  },
  {
    id: "5",
    recipient: "Marketing Agency",
    amount: -3200.0,
    status: "completed",
    method: "ACH",
    date: "Dec 27, 2024",
    type: "outgoing",
    reference: "Monthly retainer",
  },
]

interface TransfersManagerProps {
  accounts?: any[]
  recentTransfers?: any[]
}

export function TransfersManager({ accounts = [], recentTransfers = recentTransfersData }: TransfersManagerProps) {
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [transferType, setTransferType] = useState<"ach" | "wire" | "p2p">("ach")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter() // Keep router for potential future use, though not directly used in handleTransfer anymore
  const [activeTab, setActiveTab] = useState("send")

  const handleTransfer = async () => {
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
      transferType,
      memo: `Transfer to ${recipient}`,
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
      title: "Transfer initiated",
      description: `$${amountNum.toFixed(2)} transfer to ${recipient} is being processed`,
    })

    setAmount("")
    setRecipient("")

    setTimeout(() => window.location.reload(), 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs px-2 py-0.5">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-xs px-2 py-0.5">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-xs px-2 py-0.5">Failed</Badge>
        )
      default:
        return <Badge className="text-xs px-2 py-0.5">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Compact header with Stripe-style design */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 pt-3.5 pb-3.5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transfers</h1>
              <p className="text-sm text-slate-600 mt-0.5">Send money instantly or schedule payments</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-slate-300 hover:bg-slate-50 bg-transparent"
              >
                <Calendar className="h-3 w-3 mr-1.5" />
                Schedule
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-slate-300 hover:bg-slate-50 bg-transparent"
              >
                <Download className="h-3 w-3 mr-1.5" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-600 mb-0.5">Available to Send</p>
              <p className="text-xl font-semibold text-slate-900">
                ${accounts[0]?.balance?.toLocaleString() || "47,850.00"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-600 mb-0.5">Pending Transfers</p>
              <p className="text-xl font-semibold text-slate-900">$1,250.00</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-600 mb-0.5">This Month</p>
              <p className="text-xl font-semibold text-slate-900">$24,190.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-4 pt-5 px-5">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-9 bg-slate-100 p-0.5">
                    <TabsTrigger
                      value="send"
                      className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Send className="h-3 w-3 mr-1.5" />
                      Send Money
                    </TabsTrigger>
                    <TabsTrigger
                      value="internal"
                      className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <ArrowLeftRight className="h-3 w-3 mr-1.5" />
                      Move Funds
                    </TabsTrigger>
                    <TabsTrigger
                      value="request"
                      className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Download className="h-3 w-3 mr-1.5" />
                      Request
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="send" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Send to</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input
                              placeholder="Search by name, @handle, email, or account"
                              className="pl-8 h-9 text-sm"
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                            />
                          </div>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-transparent">
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {recentRecipients.map((recipient, i) => (
                            <button
                              key={i}
                              className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-full text-xs hover:border-[#635bff] hover:bg-[#635bff]/5 transition-all group"
                            >
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px] bg-[#635bff] text-white">
                                  {recipient.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="text-xs font-medium leading-none">{recipient.name}</p>
                                <p className="text-[10px] text-slate-500 leading-none mt-0.5">{recipient.handle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-semibold text-slate-400">
                            $
                          </span>
                          <Input
                            className="pl-8 text-2xl font-semibold h-14 border-2 focus:border-[#635bff]"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                          />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Available: ${accounts[0]?.balance?.toLocaleString() || "47,850.00"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Delivery method</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setTransferType("ach")}
                            className={cn(
                              "border-2 rounded-lg p-3 text-left relative",
                              transferType === "ach"
                                ? "border-[#635bff] bg-[#635bff]/5"
                                : "border-slate-200 hover:border-slate-300",
                            )}
                          >
                            {transferType === "ach" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-[#635bff]" />
                              </div>
                            )}
                            <Building2
                              className={cn(
                                "h-4 w-4 mb-2",
                                transferType === "ach" ? "text-[#635bff]" : "text-slate-400",
                              )}
                            />
                            <p className="text-sm font-semibold mb-0.5">Standard ACH</p>
                            <p className="text-xs text-slate-500 mb-2">1-3 business days</p>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-1.5 py-0">
                              Free
                            </Badge>
                          </button>

                          <button
                            onClick={() => setTransferType("wire")}
                            className={cn(
                              "border-2 rounded-lg p-3 text-left relative",
                              transferType === "wire"
                                ? "border-[#635bff] bg-[#635bff]/5"
                                : "border-slate-200 hover:border-slate-300",
                            )}
                          >
                            {transferType === "wire" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-[#635bff]" />
                              </div>
                            )}
                            <Clock
                              className={cn(
                                "h-4 w-4 mb-2",
                                transferType === "wire" ? "text-[#635bff]" : "text-slate-400",
                              )}
                            />
                            <p className="text-sm font-semibold mb-0.5">Same-Day Wire</p>
                            <p className="text-xs text-slate-500 mb-2">By 5:00 PM ET</p>
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-1.5 py-0">
                              $15.00
                            </Badge>
                          </button>

                          <button
                            onClick={() => setTransferType("p2p")}
                            className={cn(
                              "border-2 rounded-lg p-3 text-left relative",
                              transferType === "p2p"
                                ? "border-[#635bff] bg-[#635bff]/5"
                                : "border-slate-200 hover:border-slate-300",
                            )}
                          >
                            {transferType === "p2p" && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-[#635bff]" />
                              </div>
                            )}
                            <Zap
                              className={cn(
                                "h-4 w-4 mb-2",
                                transferType === "p2p" ? "text-[#635bff]" : "text-slate-400",
                              )}
                            />
                            <p className="text-sm font-semibold mb-0.5">Taxu Instant</p>
                            <p className="text-xs text-slate-500 mb-2">Immediate</p>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-1.5 py-0">
                              Free
                            </Badge>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Memo (optional)</Label>
                        <Input placeholder="Add a note for your records" className="h-9 text-sm" />
                      </div>

                      <Button
                        size="sm"
                        className="w-full h-10 text-sm font-medium bg-[#635bff] hover:bg-[#5651e0] text-white"
                        onClick={handleTransfer}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Review Transfer"}
                        <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="internal" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">From account</Label>
                          <Select defaultValue="checking">
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#635bff]" />
                                  <span className="text-sm">Business Checking</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="savings">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                                  <span className="text-sm">Business Savings</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500">Balance: $47,850.00</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">To account</Label>
                          <Select defaultValue="tax">
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tax">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-sm">Federal Tax Bucket</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="savings">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                                  <span className="text-sm">Business Savings</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500">Balance: $8,420.00</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-semibold text-slate-400">
                            $
                          </span>
                          <Input
                            className="pl-8 text-2xl font-semibold h-14 border-2 focus:border-[#635bff]"
                            placeholder="0.00"
                            type="number"
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full h-10 text-sm font-medium bg-[#635bff] hover:bg-[#5651e0] text-white"
                      >
                        Move Funds
                        <RefreshCw className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="request" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Request from</Label>
                        <Input placeholder="Enter email or account number" className="h-9 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-semibold text-slate-400">
                            $
                          </span>
                          <Input
                            className="pl-8 text-2xl font-semibold h-14 border-2 focus:border-[#635bff]"
                            placeholder="0.00"
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Note</Label>
                        <Input placeholder="What's this payment for?" className="h-9 text-sm" />
                      </div>

                      <Button
                        size="sm"
                        className="w-full h-10 text-sm font-medium bg-[#635bff] hover:bg-[#5651e0] text-white"
                      >
                        Send Request
                        <Send className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 shadow-sm mt-6">
              <CardHeader className="border-b border-slate-100 py-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Your transfer history and transactions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                      <Filter className="h-3 w-3 mr-1" />
                      Filter
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentTransfers.slice(0, 5).map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                            transfer.type === "incoming"
                              ? "bg-emerald-100"
                              : transfer.type === "internal"
                                ? "bg-blue-100"
                                : "bg-slate-100",
                          )}
                        >
                          {transfer.type === "incoming" ? (
                            <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{transfer.recipient}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-500">{transfer.date}</p>
                            <span className="text-slate-300">•</span>
                            <Badge variant="outline" className="text-xs px-1.5 py-0 border-slate-200">
                              {transfer.method}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {getStatusBadge(transfer.status)}
                        <p
                          className={cn(
                            "text-sm font-semibold tabular-nums",
                            transfer.amount > 0 ? "text-emerald-600" : "text-slate-900",
                          )}
                        >
                          {transfer.amount > 0 ? "+" : ""}$
                          {Math.abs(transfer.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-[#635bff] hover:bg-[#635bff]/5">
                    View All Transactions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 py-4 px-5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#635bff]" />
                  <CardTitle className="text-base font-semibold">Scheduled</CardTitle>
                </div>
                <CardDescription className="text-xs mt-0.5">Upcoming automatic transfers</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Payroll Run</p>
                        <p className="text-xs text-slate-600">Tomorrow at 9:00 AM</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-1.5 py-0">ACH</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-slate-600">Amount</p>
                    <p className="text-sm font-semibold text-slate-900">$12,450</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center">
                        <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Tax Bucket Auto-Save</p>
                        <p className="text-xs text-slate-600">Recurring • Monthly</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-1.5 py-0">
                      Auto
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs text-slate-600">Amount</p>
                    <p className="text-sm font-semibold text-slate-900">$2,100</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t border-slate-100 bg-slate-50">
                <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-[#635bff] hover:bg-[#635bff]/5">
                  Manage Schedule
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 py-4 px-5">
                <CardTitle className="text-base font-semibold">Daily Limits</CardTitle>
                <CardDescription className="text-xs mt-0.5">Max transfer usage today</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700">ACH Outgoing</span>
                    <span className="text-xs font-semibold text-slate-900">$15k / $50k</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[30%] bg-[#635bff] rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700">Instant P2P</span>
                    <span className="text-xs font-semibold text-slate-900">$600 / $2.5k</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[24%] bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t border-slate-100 bg-slate-50">
                <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-[#635bff] hover:bg-[#635bff]/5">
                  Request Limit Increase
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
