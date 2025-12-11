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
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const recentRecipients = [
  { name: "Sarah Jones", handle: "$sarahj", avatar: "SJ", type: "Taxu P2P" },
  { name: "Acme Corp", handle: "ACH ••4291", avatar: "AC", type: "Vendor" },
  { name: "Alex Smith", handle: "$asmith", avatar: "AS", type: "Taxu P2P" },
]

const recentTransfers = [
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

export function TransfersManager() {
  const [amount, setAmount] = useState("")
  const [transferType, setTransferType] = useState("ach")
  const [activeTab, setActiveTab] = useState("send")
  const router = useRouter()

  const handleTransfer = () => {
    toast.success("Transfer initiated successfully")
    setAmount("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Completed</Badge>
        )
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] text-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Transfers</h1>
              <p className="text-white/80 text-lg">Send money instantly or schedule payments</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Transfer
              </Button>
              <Button variant="secondary" className="bg-white text-[#635bff] hover:bg-white/90">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Available to Send</p>
              <p className="text-3xl font-bold">$47,850.00</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">Pending Transfers</p>
              <p className="text-3xl font-bold">$1,250.00</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold">$24,190.00</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-lg h-full">
              <CardHeader className="border-b border-slate-100 pb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 p-1">
                    <TabsTrigger value="send" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Send className="h-4 w-4 mr-2" />
                      Send Money
                    </TabsTrigger>
                    <TabsTrigger
                      value="internal"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Move Funds
                    </TabsTrigger>
                    <TabsTrigger value="request" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Request
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="send" className="space-y-6 mt-0">
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label className="text-base font-semibold">Send to</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search by name, @handle, email, or account number"
                              className="pl-10 h-12"
                            />
                          </div>
                          <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
                            <Users className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-1">
                          {recentRecipients.map((recipient, i) => (
                            <button
                              key={i}
                              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full cursor-pointer hover:border-[#635bff] hover:bg-[#635bff]/5 transition-all group"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-[#635bff] to-[#00d4ff] text-white">
                                  {recipient.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="text-sm font-medium group-hover:text-[#635bff]">{recipient.name}</p>
                                <p className="text-xs text-slate-500">{recipient.handle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label className="text-base font-semibold">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-4xl font-bold text-slate-400">
                            $
                          </span>
                          <Input
                            className="pl-14 text-4xl font-bold h-20 border-2 focus:border-[#635bff]"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                          />
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Available balance: $47,850.00
                        </p>
                      </div>

                      <div className="grid gap-3">
                        <Label className="text-base font-semibold">Delivery method</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <button
                            onClick={() => setTransferType("ach")}
                            className={cn(
                              "border-2 rounded-xl p-5 cursor-pointer transition-all text-left relative overflow-hidden",
                              transferType === "ach"
                                ? "border-[#635bff] bg-[#635bff]/5 shadow-md"
                                : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                            )}
                          >
                            {transferType === "ach" && (
                              <div className="absolute top-3 right-3">
                                <div className="h-6 w-6 rounded-full bg-[#635bff] flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                            <Building2
                              className={cn(
                                "h-6 w-6 mb-3",
                                transferType === "ach" ? "text-[#635bff]" : "text-slate-400",
                              )}
                            />
                            <p className="font-semibold mb-1">Standard ACH</p>
                            <p className="text-xs text-slate-500 mb-3">1-3 business days</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                Free
                              </Badge>
                            </div>
                          </button>

                          <button
                            onClick={() => setTransferType("wire")}
                            className={cn(
                              "border-2 rounded-xl p-5 cursor-pointer transition-all text-left relative overflow-hidden",
                              transferType === "wire"
                                ? "border-[#635bff] bg-[#635bff]/5 shadow-md"
                                : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                            )}
                          >
                            {transferType === "wire" && (
                              <div className="absolute top-3 right-3">
                                <div className="h-6 w-6 rounded-full bg-[#635bff] flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                            <Clock
                              className={cn(
                                "h-6 w-6 mb-3",
                                transferType === "wire" ? "text-[#635bff]" : "text-slate-400",
                              )}
                            />
                            <p className="font-semibold mb-1">Same-Day Wire</p>
                            <p className="text-xs text-slate-500 mb-3">By 5:00 PM ET</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                                $15.00
                              </Badge>
                            </div>
                          </button>

                          <button
                            onClick={() => setTransferType("p2p")}
                            className={cn(
                              "border-2 rounded-xl p-5 cursor-pointer transition-all text-left relative overflow-hidden",
                              transferType === "p2p"
                                ? "border-[#635bff] bg-[#635bff]/5 shadow-md"
                                : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                            )}
                          >
                            {transferType === "p2p" && (
                              <div className="absolute top-3 right-3">
                                <div className="h-6 w-6 rounded-full bg-[#635bff] flex items-center justify-center">
                                  <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                              </div>
                            )}
                            <Send
                              className={cn(
                                "h-6 w-6 mb-3",
                                transferType === "p2p" ? "text-[#635bff]" : "text-slate-400",
                              )}
                            />
                            <p className="font-semibold mb-1">Taxu Instant</p>
                            <p className="text-xs text-slate-500 mb-3">Immediate</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                Free
                              </Badge>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label className="text-base font-semibold">Memo (optional)</Label>
                        <Input placeholder="Add a note for your records" className="h-12" />
                      </div>

                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#635bff] to-[#00d4ff] hover:opacity-90 text-white shadow-lg"
                        onClick={handleTransfer}
                      >
                        Review Transfer
                        <ArrowUpRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="internal" className="space-y-6 mt-0">
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-base font-semibold">From account</Label>
                          <Select defaultValue="checking">
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-[#635bff]" />
                                  Business Checking
                                </div>
                              </SelectItem>
                              <SelectItem value="savings">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-[#00d4ff]" />
                                  Business Savings
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-slate-500">Balance: $47,850.00</p>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-base font-semibold">To account</Label>
                          <Select defaultValue="tax">
                            <SelectTrigger className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tax">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                  Federal Tax Bucket
                                </div>
                              </SelectItem>
                              <SelectItem value="savings">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-[#00d4ff]" />
                                  Business Savings
                                </div>
                              </SelectItem>
                              <SelectItem value="checking">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-[#635bff]" />
                                  Business Checking
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-slate-500">Balance: $8,420.00</p>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label className="text-base font-semibold">Amount</Label>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-4xl font-bold text-slate-400">
                            $
                          </span>
                          <Input
                            className="pl-14 text-4xl font-bold h-20 border-2 focus:border-[#635bff]"
                            placeholder="0.00"
                            type="number"
                          />
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#635bff] to-[#00d4ff] hover:opacity-90 text-white shadow-lg"
                        onClick={handleTransfer}
                      >
                        Transfer Instantly
                        <ArrowLeftRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="request" className="mt-0">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-16 w-16 bg-gradient-to-br from-[#635bff] to-[#00d4ff] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <Download className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Request payment from anyone</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                        Create a shareable payment link or send an invoice directly to your client's email address.
                      </p>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-[#635bff] to-[#00d4ff] hover:opacity-90 text-white shadow-lg h-12 px-8"
                      >
                        Create Payment Request
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#635bff]" />
                  Scheduled
                </CardTitle>
                <CardDescription>Upcoming automatic transfers</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#00d4ff] flex items-center justify-center shadow-md">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Payroll Run</p>
                      <p className="text-xs text-slate-500 mt-0.5">Tomorrow at 9:00 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">$12,450</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        ACH
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                      <ArrowLeftRight className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Tax Bucket Auto-Save</p>
                      <p className="text-xs text-slate-500 mt-0.5">Recurring • Monthly</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">$2,100</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        Auto
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 pt-4">
                <Button variant="ghost" className="w-full text-[#635bff] hover:bg-[#635bff]/5">
                  Manage Schedule
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg">Daily Limits</CardTitle>
                <CardDescription>Your current usage today</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">ACH Outgoing</span>
                    <span className="font-semibold">$15k / $50k</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#635bff] to-[#00d4ff] w-[30%] rounded-full shadow-sm" />
                  </div>
                  <p className="text-xs text-slate-500">$35k remaining</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">Instant P2P</span>
                    <span className="font-semibold">$500 / $2.5k</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[20%] rounded-full shadow-sm" />
                  </div>
                  <p className="text-xs text-slate-500">$2k remaining</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 pt-4">
                <Button variant="ghost" className="w-full text-[#635bff] hover:bg-[#635bff]/5">
                  Request Limit Increase
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Card className="border-slate-200 shadow-lg mt-8">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Your transfer history and transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  onClick={() => router.push(`/neobank/transactions/${transfer.id}`)}
                  className="flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center shadow-md",
                      transfer.type === "incoming"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                        : transfer.type === "internal"
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : "bg-gradient-to-br from-[#635bff] to-[#00d4ff]",
                    )}
                  >
                    {transfer.type === "incoming" ? (
                      <ArrowDownRight className="h-6 w-6 text-white" />
                    ) : transfer.type === "internal" ? (
                      <ArrowLeftRight className="h-6 w-6 text-white" />
                    ) : (
                      <ArrowUpRight className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-base">{transfer.recipient}</p>
                      {getStatusBadge(transfer.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{transfer.reference}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {transfer.method}
                      </Badge>
                    </div>
                  </div>

                  {/* Amount and Date */}
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-lg font-bold mb-1",
                        transfer.type === "incoming" ? "text-emerald-600" : "text-slate-900",
                      )}
                    >
                      {transfer.amount > 0 ? "+" : ""}$
                      {Math.abs(transfer.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-slate-500">{transfer.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100">
            <Button
              variant="ghost"
              className="w-full text-[#635bff] hover:bg-[#635bff]/5"
              onClick={() => router.push("/neobank/transactions/all")}
            >
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
