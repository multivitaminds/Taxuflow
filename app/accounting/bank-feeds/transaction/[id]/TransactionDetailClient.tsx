"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, DollarSign, Building2, FileText, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "debit" | "credit"
  status: "pending" | "categorized" | "reconciled"
  merchant?: string
  category?: string
  account?: string
  notes?: string
}

export default function TransactionDetailClient({ transactionId }: { transactionId: string }) {
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Fetch transaction details
    // For now, using sample data
    setTimeout(() => {
      setTransaction({
        id: transactionId,
        date: "2024-01-15",
        description: "Amazon Web Services",
        amount: 1250.0,
        type: "debit",
        status: "pending",
        merchant: "AWS",
        category: "Software & Services",
        account: "Business Checking",
        notes: "",
      })
      setIsLoading(false)
    }, 500)
  }, [transactionId])

  const handleSave = async () => {
    setIsSaving(true)
    // Save transaction logic here
    setTimeout(() => {
      setIsSaving(false)
      router.push("/accounting/bank-feeds")
    }, 1000)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      // Delete logic here
      router.push("/accounting/bank-feeds")
    }
  }

  if (isLoading || !transaction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading transaction...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/accounting/bank-feeds">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Transaction Details</h1>
            <p className="text-muted-foreground">Transaction ID: {transactionId}</p>
          </div>
        </div>
        <Badge variant={transaction.status === "reconciled" ? "default" : "secondary"} className="capitalize">
          {transaction.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Transaction Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={transaction.date}
                      onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={transaction.amount}
                      onChange={(e) => setTransaction({ ...transaction, amount: Number.parseFloat(e.target.value) })}
                      className="pl-10"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={transaction.description}
                  onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="merchant"
                    value={transaction.merchant || ""}
                    onChange={(e) => setTransaction({ ...transaction, merchant: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={transaction.category}
                    onValueChange={(value) => setTransaction({ ...transaction, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software & Services">Software & Services</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account">Account</Label>
                  <Select
                    value={transaction.account}
                    onValueChange={(value) => setTransaction({ ...transaction, account: value })}
                  >
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Business Checking">Business Checking</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={transaction.notes || ""}
                  onChange={(e) => setTransaction({ ...transaction, notes: e.target.value })}
                  placeholder="Add any additional notes..."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Transaction Type</p>
                <p className="text-lg font-semibold capitalize">{transaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="secondary" className="capitalize mt-1">
                  {transaction.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">${transaction.amount.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Attachments</h3>
            <Button variant="outline" className="w-full bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Add Receipt
            </Button>
            <p className="text-sm text-muted-foreground mt-4 text-center">No attachments yet</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
