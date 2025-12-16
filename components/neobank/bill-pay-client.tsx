"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, DollarSign, Calendar, Repeat, CheckCircle, Plus } from "lucide-react"
import { createBillPayment } from "@/app/actions/neobank/create-bill-payment"
import { useToast } from "@/hooks/use-toast"

export default function BillPayClient() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    payee_name: "",
    account_id: "",
    amount: "",
    scheduled_date: new Date().toISOString().split("T")[0],
    memo: "",
  })

  const handlePayBill = () => {
    if (!formData.payee_name || !formData.amount) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    startTransition(async () => {
      const result = await createBillPayment({
        ...formData,
        amount: Number.parseFloat(formData.amount),
      })

      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      } else {
        toast({ title: "Success", description: "Bill payment scheduled successfully" })
        setIsPayDialogOpen(false)
        setFormData({
          payee_name: "",
          account_id: "",
          amount: "",
          scheduled_date: new Date().toISOString().split("T")[0],
          memo: "",
        })
      }
    })
  }

  const billStats = [
    { label: "Total Due This Month", value: "$2,456.78", change: "8 bills", trend: "neutral", icon: DollarSign },
    { label: "Due Next 7 Days", value: "$845.23", change: "3 bills", trend: "up", icon: Calendar },
    { label: "Recurring Payments", value: "12 Active", change: "$1,234.56/mo", trend: "neutral", icon: Repeat },
    { label: "On-Time Rate", value: "100%", change: "Last 12 months", trend: "up", icon: CheckCircle },
  ]

  const upcomingBills = [
    {
      id: 1,
      name: "Electric Bill",
      payee: "Con Edison",
      amount: 145.67,
      dueDate: "2024-12-18",
      status: "scheduled",
      recurring: true,
    },
    {
      id: 2,
      name: "Internet",
      payee: "Comcast",
      amount: 89.99,
      dueDate: "2024-12-20",
      status: "pending",
      recurring: true,
    },
    {
      id: 3,
      name: "Rent",
      payee: "Property Management",
      amount: 2500.0,
      dueDate: "2024-12-25",
      status: "pending",
      recurring: true,
    },
    {
      id: 4,
      name: "Insurance",
      payee: "State Farm",
      amount: 234.56,
      dueDate: "2024-12-28",
      status: "pending",
      recurring: true,
    },
    {
      id: 5,
      name: "Cell Phone",
      payee: "Verizon",
      amount: 125.0,
      dueDate: "2024-12-30",
      status: "pending",
      recurring: true,
    },
  ]

  const recurringPayments = [
    { id: 1, name: "Netflix", amount: 15.99, frequency: "Monthly", nextDate: "2024-12-15", category: "Entertainment" },
    { id: 2, name: "Spotify", amount: 9.99, frequency: "Monthly", nextDate: "2024-12-18", category: "Entertainment" },
    { id: 3, name: "Amazon Prime", amount: 14.99, frequency: "Monthly", nextDate: "2024-12-20", category: "Shopping" },
    { id: 4, name: "Gym Membership", amount: 49.99, frequency: "Monthly", nextDate: "2024-12-22", category: "Health" },
    {
      id: 5,
      name: "Cloud Storage",
      amount: 9.99,
      frequency: "Monthly",
      nextDate: "2024-12-25",
      category: "Technology",
    },
  ]

  const paymentHistory = [
    { date: "2024-11-20", payee: "Con Edison", amount: 142.34, status: "paid" },
    { date: "2024-11-18", payee: "Comcast", amount: 89.99, status: "paid" },
    { date: "2024-11-15", payee: "Netflix", amount: 15.99, status: "paid" },
    { date: "2024-11-10", payee: "Verizon", amount: 125.0, status: "paid" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Bill Pay</h1>
          <p className="text-muted-foreground mt-1">Manage bills, set up automatic payments, and track expenses</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Payee
          </Button>
          <Button onClick={() => setIsPayDialogOpen(true)}>Pay Bill</Button>
        </div>
      </div>

      {/* Bill Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {billStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Bills</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Upcoming Bills Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bills</CardTitle>
              <CardDescription>Bills due in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bill.name}</span>
                          {bill.recurring && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{bill.payee}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-medium text-lg">${bill.amount.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Due {bill.dueDate}</div>
                      </div>
                      <Badge variant={bill.status === "scheduled" ? "default" : "secondary"}>{bill.status}</Badge>
                      <Button size="sm" variant="outline">
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recurring Payments Tab */}
        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recurring Payments</CardTitle>
              <CardDescription>Subscriptions and automatic payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recurringPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
                        <Repeat className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.name}</div>
                        <div className="text-sm text-muted-foreground">{payment.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="font-medium">${payment.amount}</div>
                        <div className="text-xs text-muted-foreground">{payment.frequency}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Next payment</div>
                        <div className="text-sm font-medium">{payment.nextDate}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentHistory.map((payment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{payment.payee}</div>
                        <div className="text-sm text-muted-foreground">{payment.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${payment.amount.toLocaleString()}</div>
                      <Badge variant="outline" className="text-green-600">
                        Paid
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Bill Payment</DialogTitle>
            <DialogDescription>Create a new bill payment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payee">Payee Name *</Label>
              <Input
                id="payee"
                value={formData.payee_name}
                onChange={(e) => setFormData({ ...formData, payee_name: e.target.value })}
                placeholder="Enter payee name"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="date">Payment Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="memo">Memo</Label>
              <Input
                id="memo"
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="Optional note"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayDialogOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handlePayBill} disabled={isPending}>
              {isPending ? "Processing..." : "Schedule Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
