"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Settings,
  ShieldAlert,
  RefreshCw,
  Wallet,
  Smartphone,
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getNeobankCards } from "@/app/actions/neobank/get-cards"
import { createNeobankCard, updateCardStatus } from "@/app/actions/neobank/create-card"

type CardStatus = "active" | "frozen" | "cancelled"

interface BankingCard {
  id: string
  last4: string
  expiry: string
  cvv: string
  holder: string
  type: "virtual" | "physical"
  status: CardStatus
  limit: number
  spent: number
  name: string
}

const initialCards: BankingCard[] = [
  {
    id: "card_1",
    last4: "4291",
    expiry: "12/28",
    cvv: "123",
    holder: "ALEXANDER SMITH",
    type: "virtual",
    status: "active",
    limit: 5000,
    spent: 1240.5,
    name: "Software Subscriptions",
  },
  {
    id: "card_2",
    last4: "8821",
    expiry: "09/26",
    cvv: "456",
    holder: "ALEXANDER SMITH",
    type: "physical",
    status: "active",
    limit: 10000,
    spent: 450.0,
    name: "Travel & Expenses",
  },
  {
    id: "card_3",
    last4: "1029",
    expiry: "11/27",
    cvv: "789",
    holder: "SARAH JONES",
    type: "virtual",
    status: "frozen",
    limit: 2000,
    spent: 0,
    name: "Marketing Ads",
  },
]

export function CardsManager() {
  const [cards, setCards] = useState<BankingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})
  const [selectedCardId, setSelectedCardId] = useState<string>("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadCards()
  }, [])

  async function loadCards() {
    setLoading(true)
    const { data, error } = await getNeobankCards()

    if (error) {
      toast.error("Failed to load cards")
      setCards(initialCards)
      setSelectedCardId(initialCards[0]?.id)
    } else if (data && data.length > 0) {
      const formattedCards: BankingCard[] = data.map((card: any) => ({
        id: card.id,
        last4: card.last_four,
        expiry: card.expiry_date,
        cvv: card.cvv,
        holder: card.cardholder_name,
        type: card.card_type,
        status: card.status,
        limit: card.monthly_limit,
        spent: card.spent_amount,
        name: card.card_name,
      }))
      setCards(formattedCards)
      setSelectedCardId(formattedCards[0]?.id)
    } else {
      setCards(initialCards)
      setSelectedCardId(initialCards[0]?.id)
    }
    setLoading(false)
  }

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0]

  const toggleCardStatus = async (id: string) => {
    const card = cards.find((c) => c.id === id)
    if (!card) return

    const newStatus = card.status === "active" ? "frozen" : "active"

    setCards(
      cards.map((c) => {
        if (c.id === id) {
          return { ...c, status: newStatus }
        }
        return c
      }),
    )

    const result = await updateCardStatus(id, newStatus)

    if (result.success) {
      toast.success(`Card ${newStatus === "active" ? "unfrozen" : "frozen"} successfully`)
    } else {
      setCards(
        cards.map((c) => {
          if (c.id === id) {
            return { ...c, status: card.status }
          }
          return c
        }),
      )
      toast.error(result.error || "Failed to update card status")
    }
  }

  const toggleDetails = (id: string) => {
    setShowDetails((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const handleCreateCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const cardType = formData.get("card-type") as "virtual" | "physical"
    const cardName = formData.get("name") as string
    const monthlyLimit = Number(formData.get("limit"))
    const cardholder = formData.get("holder") as string

    if (!cardName || !monthlyLimit || !cardholder) {
      toast.error("Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    const result = await createNeobankCard({
      cardType,
      cardName,
      monthlyLimit,
      cardholder,
    })

    if (result.success) {
      toast.success("Card issued successfully!")
      setIsCreateDialogOpen(false)
      loadCards()
    } else {
      toast.error(result.error || "Failed to create card")
    }

    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">Loading cards...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-[#0a2540]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Card Management</h1>
          <p className="text-sm text-slate-500 mt-1">Issue and manage physical and virtual cards for your team.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#635bff] hover:bg-[#5851e1] text-white shadow-sm h-8 text-xs">
              <Plus className="mr-2 h-4 w-4" /> Issue New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateCard}>
              <DialogHeader>
                <DialogTitle className="text-base">Issue New Card</DialogTitle>
                <DialogDescription className="text-xs">
                  Create a new virtual or physical card for business expenses.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="card-type" className="text-xs">
                    Card Type
                  </Label>
                  <Select name="card-type" defaultValue="virtual">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual" className="text-xs">
                        Virtual (Instant)
                      </SelectItem>
                      <SelectItem value="physical" className="text-xs">
                        Physical (Mail)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-xs">
                    Card Name (e.g. Marketing)
                  </Label>
                  <Input id="name" name="name" placeholder="Marketing Expenses" required className="h-8 text-xs" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="limit" className="text-xs">
                    Monthly Limit
                  </Label>
                  <Input id="limit" name="limit" type="number" placeholder="5000" required className="h-8 text-xs" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="holder" className="text-xs">
                    Cardholder Name
                  </Label>
                  <Input id="holder" name="holder" placeholder="John Doe" required className="h-8 text-xs" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#635bff] h-8 text-xs" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Issue Card"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-3 px-4">
              <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Cards</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between",
                      selectedCardId === card.id
                        ? "bg-slate-50 border-l-4 border-[#635bff]"
                        : "border-l-4 border-transparent",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          card.status === "frozen" ? "bg-slate-100 text-slate-400" : "bg-[#635bff]/10 text-[#635bff]",
                        )}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-xs">{card.name}</p>
                        <p className="text-[10px] text-slate-500">•••• {card.last4}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={card.status === "active" ? "outline" : "secondary"}
                        className={cn(
                          "text-[10px]",
                          card.status === "active" ? "text-green-600 border-green-200 bg-green-50" : "text-slate-500",
                        )}
                      >
                        {card.status === "active" ? "Active" : "Frozen"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#f6f9fc] border-slate-200 shadow-none">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-[#635bff] mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#0a2540]">Security Tip</h4>
                <p className="text-[10px] text-slate-500 mt-1">
                  Freeze your card immediately if you notice any suspicious activity. You can unfreeze it anytime.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Card Detail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Card */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div
              className={cn(
                "w-full md:w-[380px] h-[240px] rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-500",
                selectedCard.status === "frozen"
                  ? "bg-slate-600 grayscale"
                  : "bg-gradient-to-br from-[#0a2540] to-[#635bff]",
              )}
            >
              <div className="absolute right-[-20px] top-[-20px] h-40 w-40 bg-white opacity-10 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight">Taxu</span>
                  <Badge className="bg-white/20 text-white border-none hover:bg-white/30 backdrop-blur-sm uppercase text-[10px] tracking-wider">
                    {selectedCard.type}
                  </Badge>
                </div>
                <CreditCard className="h-6 w-6 opacity-80" />
              </div>

              <div className="space-y-4 relative z-10 mt-4">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-mono tracking-wider opacity-90">
                    {showDetails[selectedCard.id]
                      ? `4532 1234 5678 ${selectedCard.last4}`
                      : `•••• •••• •••• ${selectedCard.last4}`}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={() => toggleDetails(selectedCard.id)}
                  >
                    {showDetails[selectedCard.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] opacity-70 uppercase tracking-widest">Card Holder</p>
                    <p className="font-medium tracking-wide text-xs">{selectedCard.holder}</p>
                  </div>
                  <div className="flex gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-70 uppercase tracking-widest">Expires</p>
                      <p className="font-medium tracking-wide text-xs">{selectedCard.expiry}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] opacity-70 uppercase tracking-widest">CVC</p>
                      <p className="font-medium tracking-wide text-xs">
                        {showDetails[selectedCard.id] ? selectedCard.cvv : "•••"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      selectedCard.status === "active" ? "bg-green-100" : "bg-slate-100",
                    )}
                  >
                    <Lock
                      className={cn("h-4 w-4", selectedCard.status === "active" ? "text-green-600" : "text-slate-500")}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Card Status</p>
                    <p className="text-[10px] text-slate-500">
                      {selectedCard.status === "active" ? "Active & Secure" : "Frozen & Locked"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={selectedCard.status === "active"}
                  onCheckedChange={() => toggleCardStatus(selectedCard.id)}
                  className="data-[state=checked]:bg-[#635bff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="bg-white h-8 justify-start border-slate-200 text-slate-600 hover:text-[#635bff] hover:border-[#635bff] text-xs"
                >
                  <Settings className="mr-2 h-4 w-4" /> Limits
                </Button>
                <Button
                  variant="outline"
                  className="bg-white h-8 justify-start border-slate-200 text-slate-600 hover:text-[#635bff] hover:border-[#635bff] text-xs"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Replace
                </Button>
                <Button
                  variant="outline"
                  className="bg-white h-8 justify-start border-slate-200 text-slate-600 hover:text-[#635bff] hover:border-[#635bff] text-xs"
                >
                  <Wallet className="mr-2 h-4 w-4" /> Add to Wallet
                </Button>
                <Button
                  variant="outline"
                  className="bg-white h-8 justify-start border-slate-200 text-slate-600 hover:text-[#635bff] hover:border-[#635bff] text-xs"
                >
                  <Smartphone className="mr-2 h-4 w-4" /> Pin
                </Button>
              </div>
            </div>
          </div>

          {/* Card Details Tab */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Card Details</CardTitle>
                  <CardDescription className="text-xs">Billing address and limits</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#635bff] h-8 text-xs"
                  onClick={() => copyToClipboard("4532 1234 5678 " + selectedCard.last4)}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Number
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-slate-500 uppercase">Billing Address</p>
                <p className="text-xs font-medium">123 Innovation Dr</p>
                <p className="text-xs text-slate-600">Suite 400</p>
                <p className="text-xs text-slate-600">San Francisco, CA 94103</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-slate-500 uppercase">Spending Limit</p>
                <p className="text-xs font-medium">${selectedCard.limit.toLocaleString()} / month</p>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-slate-600">Spent: ${selectedCard.spent.toLocaleString()}</span>
                    <span className="text-[#635bff]">
                      {Math.round((selectedCard.spent / selectedCard.limit) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#635bff] rounded-full"
                      style={{ width: `${(selectedCard.spent / selectedCard.limit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
