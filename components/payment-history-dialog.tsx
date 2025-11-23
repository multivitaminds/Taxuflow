"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Calendar, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Payment {
  id: string
  amount: number
  payment_date: string
  description?: string
  tax_year: number
}

interface PaymentHistoryDialogProps {
  recipientId: string
  recipientName: string
  children: React.ReactNode
}

export function PaymentHistoryDialog({ recipientId, recipientName, children }: PaymentHistoryDialogProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [newPayment, setNewPayment] = useState({
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    description: "",
    tax_year: new Date().getFullYear(),
  })
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchPayments()
    }
  }, [isOpen])

  const fetchPayments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/recipients/${recipientId}/payments`)
      const data = await response.json()
      setPayments(data.payments || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payment history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPayment = async () => {
    if (!newPayment.amount || Number.parseFloat(newPayment.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/recipients/${recipientId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(newPayment.amount),
          payment_date: newPayment.payment_date,
          description: newPayment.description,
          tax_year: newPayment.tax_year,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment added successfully",
        })
        setIsAddingPayment(false)
        setNewPayment({
          amount: "",
          payment_date: new Date().toISOString().split("T")[0],
          description: "",
          tax_year: new Date().getFullYear(),
        })
        fetchPayments()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment",
        variant: "destructive",
      })
    }
  }

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Payment History - {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Total Payments</div>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            </div>
            <Button onClick={() => setIsAddingPayment(!isAddingPayment)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
          </div>

          {isAddingPayment && (
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">Add New Payment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_date">Payment Date *</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={newPayment.payment_date}
                    onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tax_year">Tax Year</Label>
                  <Input
                    id="tax_year"
                    type="number"
                    value={newPayment.tax_year}
                    onChange={(e) => setNewPayment({ ...newPayment, tax_year: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Optional"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPayment} className="bg-green-500 hover:bg-green-600">
                  Save Payment
                </Button>
                <Button onClick={() => setIsAddingPayment(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tax Year</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No payments recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.tax_year}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.description || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
