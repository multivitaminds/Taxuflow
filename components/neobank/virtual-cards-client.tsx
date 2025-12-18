"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import {
  CreditCard,
  Plus,
  Lock,
  Trash2,
  Settings,
  ShoppingCart,
  TrendingUp,
  Shield,
  Calendar,
  DollarSign,
  Store,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface VirtualCard {
  id: string
  name: string
  last4: string
  type: "single-use" | "recurring" | "merchant-locked"
  status: "active" | "frozen" | "expired"
  limit: number
  spent: number
  merchant?: string
  merchantCategory?: string
  expiresAt: string
  createdAt: string
  transactionCount: number
}

const initialCards: VirtualCard[] = [
  {
    id: "vc_1",
    name: "Netflix Subscription",
    last4: "4291",
    type: "recurring",
    status: "active",
    limit: 20,
    spent: 15.99,
    merchant: "Netflix",
    merchantCategory: "Entertainment",
    expiresAt: "2025-12-31",
    createdAt: "2024-01-15",
    transactionCount: 12,
  },
  {
    id: "vc_2",
    name: "Amazon Purchase",
    last4: "8821",
    type: "single-use",
    status: "expired",
    limit: 150,
    spent: 142.5,
    merchant: "Amazon",
    merchantCategory: "Shopping",
    expiresAt: "2024-12-01",
    createdAt: "2024-11-28",
    transactionCount: 1,
  },
  {
    id: "vc_3",
    name: "Spotify Premium",
    last4: "1029",
    type: "merchant-locked",
    status: "active",
    limit: 15,
    spent: 10.99,
    merchant: "Spotify",
    merchantCategory: "Entertainment",
    expiresAt: "2026-06-30",
    createdAt: "2024-02-01",
    transactionCount: 8,
  },
  {
    id: "vc_4",
    name: "Travel Booking",
    last4: "5532",
    type: "single-use",
    status: "active",
    limit: 1000,
    spent: 0,
    merchant: "Expedia",
    merchantCategory: "Travel",
    expiresAt: "2025-01-31",
    createdAt: "2025-01-05",
    transactionCount: 0,
  },
]

const getMerchantLogo = (merchant?: string) => {
  const logos: Record<string, string> = {
    Netflix: "/images/netflix-logo-on-transparent-background-png.png",
    Spotify: "/images/spotify-logo-without-text.png",
    "Adobe Creative Cloud": "/images/creative-cloud-cc-logo-png-seeklogo-284477.png",
    Amazon: "/images/prime-amazon-logo-icon-701751694791861yc1d3bmoov.png",
    LinkedIn: "/images/5-53359-linkedin-logo-png-transparent-png.png",
    Dropbox: "/images/dropbox-2-logo-png-transparent.png",
  }
  return logos[merchant || ""] || null
}

export function VirtualCardsClient() {
  const [cards, setCards] = useState<VirtualCard[]>(initialCards)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")

  const activeCards = cards.filter((c) => c.status === "active")
  const totalSpent = cards.reduce((sum, card) => sum + card.spent, 0)
  const totalLimit = cards.reduce((sum, card) => sum + card.limit, 0)

  const toggleCardStatus = (id: string) => {
    setCards(
      cards.map((card) => {
        if (card.id === id) {
          const newStatus = card.status === "active" ? "frozen" : "active"
          toast.success(`Card ${newStatus === "active" ? "activated" : "frozen"}`)
          return { ...card, status: newStatus }
        }
        return card
      }),
    )
  }

  const deleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id))
    toast.success("Virtual card deleted")
  }

  const getCardsByTab = () => {
    switch (selectedTab) {
      case "active":
        return cards.filter((c) => c.status === "active")
      case "recurring":
        return cards.filter((c) => c.type === "recurring")
      case "single-use":
        return cards.filter((c) => c.type === "single-use")
      default:
        return cards
    }
  }

  const filteredCards = getCardsByTab()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-[#0a2540] to-[#635bff] bg-clip-text text-transparent">
            Virtual Cards
          </h1>
          <p className="text-slate-500 mt-1">Create disposable cards with spending limits and merchant controls</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#635bff] to-[#7c3aed] hover:from-[#5851e1] hover:to-[#6d28d9] text-white shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Create Virtual Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Virtual Card</DialogTitle>
              <DialogDescription>Set up a new virtual card with custom limits and controls</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="card-name">Card Name</Label>
                <Input id="card-name" placeholder="e.g., Netflix Subscription" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-type">Card Type</Label>
                <Select defaultValue="recurring">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-use">Single-Use (Expires after 1 transaction)</SelectItem>
                    <SelectItem value="recurring">Recurring (For subscriptions)</SelectItem>
                    <SelectItem value="merchant-locked">Merchant-Locked (Specific store only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="limit">Spending Limit ($)</Label>
                <Input id="limit" type="number" placeholder="100.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="merchant">Merchant (Optional)</Label>
                <Input id="merchant" placeholder="e.g., Amazon, Netflix" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expires">Expires</Label>
                <Select defaultValue="1month">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1day">1 Day</SelectItem>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#635bff]"
                onClick={() => {
                  toast.success("Virtual card created successfully!")
                  setIsCreateDialogOpen(false)
                }}
              >
                Create Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Cards</p>
                <p className="text-3xl font-bold mt-2">{activeCards.length}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> 2 new this month
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#635bff]/10 to-[#7c3aed]/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#635bff]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Spent</p>
                <p className="text-3xl font-bold mt-2">${totalSpent.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1">of ${totalLimit.toFixed(2)} limit</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Subscriptions</p>
                <p className="text-3xl font-bold mt-2">{cards.filter((c) => c.type === "recurring").length}</p>
                <p className="text-xs text-blue-600 mt-1">Active recurring payments</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Protected</p>
                <p className="text-3xl font-bold mt-2">{cards.filter((c) => c.type === "merchant-locked").length}</p>
                <p className="text-xs text-purple-600 mt-1">Merchant-locked cards</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Cards List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="all">All Cards ({cards.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCards.length})</TabsTrigger>
          <TabsTrigger value="recurring">
            Subscriptions ({cards.filter((c) => c.type === "recurring").length})
          </TabsTrigger>
          <TabsTrigger value="single-use">
            Single-Use ({cards.filter((c) => c.type === "single-use").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredCards.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No virtual cards found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className={cn(
                    "border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group",
                    card.status === "expired" && "opacity-60",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center",
                            card.status === "active"
                              ? "bg-gradient-to-br from-[#635bff]/10 to-[#7c3aed]/10"
                              : "bg-slate-100",
                          )}
                        >
                          <CreditCard
                            className={cn("h-5 w-5", card.status === "active" ? "text-[#635bff]" : "text-slate-400")}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">{card.name}</CardTitle>
                          <p className="text-xs text-slate-500 mt-0.5">•••• {card.last4}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={card.status === "active" ? "outline" : "secondary"}
                          className={cn(
                            "text-[10px]",
                            card.status === "active"
                              ? "text-green-600 border-green-200 bg-green-50"
                              : card.status === "frozen"
                                ? "text-blue-600 border-blue-200 bg-blue-50"
                                : "text-slate-500",
                          )}
                        >
                          {card.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            card.type === "single-use"
                              ? "text-orange-600 border-orange-200 bg-orange-50"
                              : card.type === "recurring"
                                ? "text-blue-600 border-blue-200 bg-blue-50"
                                : "text-purple-600 border-purple-200 bg-purple-50",
                          )}
                        >
                          {card.type === "single-use"
                            ? "Single-Use"
                            : card.type === "recurring"
                              ? "Recurring"
                              : "Merchant-Locked"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Merchant Info */}
                    {card.merchant && (
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        {getMerchantLogo(card.merchant) ? (
                          <div className="h-8 w-8 bg-white rounded p-1 flex items-center justify-center">
                            <Image
                              src={getMerchantLogo(card.merchant)! || "/placeholder.svg"}
                              alt={card.merchant}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <Store className="h-4 w-4 text-slate-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{card.merchant}</p>
                          <p className="text-xs text-slate-500">{card.merchantCategory}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    )}

                    {/* Spending Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Spent: ${card.spent.toFixed(2)}</span>
                        <span className="font-medium text-[#635bff]">${card.limit.toFixed(2)} limit</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            card.spent / card.limit > 0.9
                              ? "bg-red-500"
                              : card.spent / card.limit > 0.7
                                ? "bg-orange-500"
                                : "bg-gradient-to-r from-[#635bff] to-[#7c3aed]",
                          )}
                          style={{ width: `${Math.min((card.spent / card.limit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Card Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Expires</p>
                          <p className="text-sm font-medium">{new Date(card.expiresAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Transactions</p>
                          <p className="text-sm font-medium">{card.transactionCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white"
                        onClick={() => toggleCardStatus(card.id)}
                        disabled={card.status === "expired"}
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        {card.status === "active" ? "Freeze" : "Activate"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-white">
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={() => deleteCard(card.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-[#f6f9fc] to-[#f0f4f8] border-slate-200 shadow-none">
        <CardContent className="p-6 flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-[#635bff]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-[#0a2540] mb-1">Virtual Card Security</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Virtual cards protect your real card details when shopping online. Single-use cards expire after one
              transaction, while merchant-locked cards can only be used at specific stores. Set custom spending limits
              to stay in control of your subscriptions and online purchases.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
