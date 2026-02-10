"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight, Send, Download, Users, Building2, Clock, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const recentRecipients = [
  { name: "Sarah Jones", handle: "$sarahj", avatar: "SJ", type: "Taxu P2P" },
  { name: "Acme Corp", handle: "ACH ••4291", avatar: "AC", type: "Vendor" },
  { name: "Alex Smith", handle: "$asmith", avatar: "AS", type: "Taxu P2P" },
]

export function TransfersManager() {
  const [amount, setAmount] = useState("")
  const [transferType, setTransferType] = useState("ach")

  const handleTransfer = () => {
    toast.success("Transfer initiated successfully")
    setAmount("")
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Move Money</h1>
          <p className="text-slate-500 mt-1">Send ACH, Wires, or instant P2P transfers to anyone.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Transfer Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader>
              <Tabs defaultValue="send" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="send">Send Money</TabsTrigger>
                  <TabsTrigger value="internal">Internal Transfer</TabsTrigger>
                  <TabsTrigger value="request">Request Funds</TabsTrigger>
                </TabsList>

                <TabsContent value="send" className="space-y-6">
                  <div className="grid gap-6 pt-4">
                    <div className="grid gap-2">
                      <Label>To</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Name, @handle, email, or account #" />
                        <Button variant="outline">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {recentRecipients.map((recipient, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px] bg-[#635bff] text-white">
                                {recipient.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{recipient.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                          $
                        </span>
                        <Input
                          className="pl-10 text-3xl font-bold h-16"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Delivery Method</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                          onClick={() => setTransferType("ach")}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all",
                            transferType === "ach"
                              ? "border-[#635bff] bg-[#635bff]/5"
                              : "border-slate-200 hover:border-slate-300",
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Building2
                              className={cn("h-5 w-5", transferType === "ach" ? "text-[#635bff]" : "text-slate-400")}
                            />
                            {transferType === "ach" && <CheckCircle2 className="h-4 w-4 text-[#635bff]" />}
                          </div>
                          <p className="font-semibold text-sm">Standard ACH</p>
                          <p className="text-xs text-slate-500">1-3 Business Days</p>
                          <p className="text-xs font-medium mt-1">Free</p>
                        </div>

                        <div
                          onClick={() => setTransferType("wire")}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all",
                            transferType === "wire"
                              ? "border-[#635bff] bg-[#635bff]/5"
                              : "border-slate-200 hover:border-slate-300",
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Building2
                              className={cn("h-5 w-5", transferType === "wire" ? "text-[#635bff]" : "text-slate-400")}
                            />
                            {transferType === "wire" && <CheckCircle2 className="h-4 w-4 text-[#635bff]" />}
                          </div>
                          <p className="font-semibold text-sm">Same-Day Wire</p>
                          <p className="text-xs text-slate-500">By 5:00 PM ET</p>
                          <p className="text-xs font-medium mt-1">$15.00</p>
                        </div>

                        <div
                          onClick={() => setTransferType("p2p")}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all",
                            transferType === "p2p"
                              ? "border-[#635bff] bg-[#635bff]/5"
                              : "border-slate-200 hover:border-slate-300",
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <Send
                              className={cn("h-5 w-5", transferType === "p2p" ? "text-[#635bff]" : "text-slate-400")}
                            />
                            {transferType === "p2p" && <CheckCircle2 className="h-4 w-4 text-[#635bff]" />}
                          </div>
                          <p className="font-semibold text-sm">Taxu Instant</p>
                          <p className="text-xs text-slate-500">Immediate</p>
                          <p className="text-xs font-medium mt-1">Free</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-[#635bff] hover:bg-[#5851e1] text-white"
                      onClick={handleTransfer}
                    >
                      Review Transfer
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="internal" className="space-y-6">
                  <div className="grid gap-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>From</Label>
                        <Select defaultValue="checking">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="checking">Business Checking</SelectItem>
                            <SelectItem value="savings">Business Savings</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>To</Label>
                        <Select defaultValue="tax">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tax">Federal Tax Bucket</SelectItem>
                            <SelectItem value="savings">Business Savings</SelectItem>
                            <SelectItem value="checking">Business Checking</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                          $
                        </span>
                        <Input className="pl-10 text-3xl font-bold h-16" placeholder="0.00" type="number" />
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-[#635bff] hover:bg-[#5851e1] text-white"
                      onClick={handleTransfer}
                    >
                      Transfer Funds
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="request">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 bg-[#635bff]/10 rounded-full flex items-center justify-center mb-4">
                      <Download className="h-6 w-6 text-[#635bff]" />
                    </div>
                    <h3 className="text-lg font-semibold">Request money from anyone</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 mb-6">
                      Create a payment link or send an invoice directly to your client's email.
                    </p>
                    <Button>Create Payment Request</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity / Scheduled */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Scheduled Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                    <Clock className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payroll Run</p>
                    <p className="text-xs text-slate-500">Tomorrow, 9:00 AM</p>
                  </div>
                  <span className="font-semibold text-sm">-$12,450</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-slate-200">
                    <ArrowLeftRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tax Bucket Auto-Save</p>
                    <p className="text-xs text-slate-500">Recurring • Monthly</p>
                  </div>
                  <span className="font-semibold text-sm">-$2,100</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-[#635bff]">
                View Schedule
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Limits</CardTitle>
              <CardDescription>Your daily transfer limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ACH Outgoing</span>
                  <span className="font-medium">$15k / $50k</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#635bff] w-[30%] rounded-full" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Instant P2P</span>
                  <span className="font-medium">$500 / $2.5k</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00d4ff] w-[20%] rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
