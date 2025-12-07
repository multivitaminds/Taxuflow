"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowLeftRight, AlertCircle } from "lucide-react"

const bankAccounts = [
  { id: "1", name: "Business Checking", balance: 45230.5, accountNumber: "****1234" },
  { id: "2", name: "Business Savings", balance: 125000.0, accountNumber: "****5678" },
  { id: "3", name: "Payroll Account", balance: 15000.0, accountNumber: "****9012" },
  { id: "4", name: "Reserve Account", balance: 250000.0, accountNumber: "****3456" },
]

export default function NewTransferClient() {
  const router = useRouter()
  const [fromAccount, setFromAccount] = useState("")
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  const selectedFromAccount = bankAccounts.find((acc) => acc.id === fromAccount)
  const selectedToAccount = bankAccounts.find((acc) => acc.id === toAccount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle transfer submission
    console.log({ fromAccount, toAccount, amount, note })
    router.push("/accounting/banking/transfers")
  }

  const isValid = fromAccount && toAccount && amount && fromAccount !== toAccount && Number.parseFloat(amount) > 0

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push("/accounting/banking/transfers")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Transfers
        </Button>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-lg bg-cyan-500/10">
            <ArrowLeftRight className="h-8 w-8 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">New Inter-Account Transfer</h1>
            <p className="text-muted-foreground">Transfer funds between your bank accounts</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* From Account */}
            <div>
              <Label htmlFor="fromAccount">From Account</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger id="fromAccount">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {account.name} ({account.accountNumber})
                        </span>
                        <span className="ml-4 text-muted-foreground">
                          ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFromAccount && (
                <p className="text-sm text-muted-foreground mt-1">
                  Available: ${selectedFromAccount.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Transfer Icon */}
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-cyan-500/10">
                <ArrowLeftRight className="h-6 w-6 text-cyan-600" />
              </div>
            </div>

            {/* To Account */}
            <div>
              <Label htmlFor="toAccount">To Account</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger id="toAccount">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts
                    .filter((acc) => acc.id !== fromAccount)
                    .map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {account.name} ({account.accountNumber})
                          </span>
                          <span className="ml-4 text-muted-foreground">
                            ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Transfer Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {selectedFromAccount && amount && Number.parseFloat(amount) > selectedFromAccount.balance && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Insufficient funds in source account</span>
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this transfer..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Summary */}
            {fromAccount && toAccount && amount && (
              <Card className="p-4 bg-accent/50">
                <h3 className="font-semibold mb-3">Transfer Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium">{selectedFromAccount?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{selectedToAccount?.name}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-bold text-lg">
                      ${Number.parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/accounting/banking/transfers")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValid || (selectedFromAccount && Number.parseFloat(amount) > selectedFromAccount.balance)}
                className="flex-1"
              >
                Complete Transfer
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}
