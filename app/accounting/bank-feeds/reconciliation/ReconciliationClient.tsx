"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Link2 } from "lucide-react"

const unmatchedTransactions = [
  { id: 1, date: "2025-01-15", description: "Client Payment", amount: 2500.0, source: "bank" },
  { id: 2, date: "2025-01-15", description: "Invoice #1234 Payment", amount: 2500.0, source: "books" },
  { id: 3, date: "2025-01-14", description: "Office Supplies", amount: -125.5, source: "bank" },
  { id: 4, date: "2025-01-13", description: "AWS Services", amount: -450.0, source: "bank" },
  { id: 5, date: "2025-01-13", description: "Expense Report - Software", amount: -450.0, source: "books" },
]

const suggestedMatches = [
  {
    bankTxn: { id: 1, description: "Client Payment", amount: 2500.0 },
    bookTxn: { id: 2, description: "Invoice #1234 Payment", amount: 2500.0 },
    confidence: 95,
  },
  {
    bankTxn: { id: 4, description: "AWS Services", amount: -450.0 },
    bookTxn: { id: 5, description: "Expense Report - Software", amount: -450.0 },
    confidence: 88,
  },
]

export default function ReconciliationClient() {
  const [selectedBank, setSelectedBank] = useState<number[]>([])
  const [selectedBooks, setSelectedBooks] = useState<number[]>([])

  const handleMatch = () => {
    console.log("Matching transactions:", selectedBank, selectedBooks)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Bank Balance</p>
            <p className="text-3xl font-bold">$167,890.50</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Book Balance</p>
            <p className="text-3xl font-bold">$165,390.00</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Difference</p>
            <p className="text-3xl font-bold text-orange-600">$2,500.50</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="suggested" className="w-full">
        <TabsList>
          <TabsTrigger value="suggested">Suggested Matches ({suggestedMatches.length})</TabsTrigger>
          <TabsTrigger value="manual">Manual Matching</TabsTrigger>
          <TabsTrigger value="reconciled">Reconciled</TabsTrigger>
        </TabsList>

        <TabsContent value="suggested" className="space-y-4">
          {suggestedMatches.map((match, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-500">Bank</Badge>
                    <span className="font-medium">{match.bankTxn.description}</span>
                    <span className="text-muted-foreground">${Math.abs(match.bankTxn.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500">Books</Badge>
                    <span className="font-medium">{match.bookTxn.description}</span>
                    <span className="text-muted-foreground">${Math.abs(match.bookTxn.amount).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-green-600">
                    {match.confidence}% Match
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Accept Match
                    </Button>
                    <Button size="sm" variant="outline">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Bank Transactions</h3>
              <div className="space-y-2">
                {unmatchedTransactions
                  .filter((t) => t.source === "bank")
                  .map((txn) => (
                    <div
                      key={txn.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                        selectedBank.includes(txn.id) ? "bg-blue-500/10 border-blue-500" : ""
                      }`}
                      onClick={() => {
                        setSelectedBank((prev) =>
                          prev.includes(txn.id) ? prev.filter((id) => id !== txn.id) : [...prev, txn.id],
                        )
                      }}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{txn.description}</span>
                        <span className={txn.amount > 0 ? "text-green-600" : "text-red-600"}>
                          ${Math.abs(txn.amount).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{txn.date}</span>
                    </div>
                  ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Book Transactions</h3>
              <div className="space-y-2">
                {unmatchedTransactions
                  .filter((t) => t.source === "books")
                  .map((txn) => (
                    <div
                      key={txn.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                        selectedBooks.includes(txn.id) ? "bg-green-500/10 border-green-500" : ""
                      }`}
                      onClick={() => {
                        setSelectedBooks((prev) =>
                          prev.includes(txn.id) ? prev.filter((id) => id !== txn.id) : [...prev, txn.id],
                        )
                      }}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{txn.description}</span>
                        <span className={txn.amount > 0 ? "text-green-600" : "text-red-600"}>
                          ${Math.abs(txn.amount).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{txn.date}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button
              size="lg"
              disabled={selectedBank.length === 0 || selectedBooks.length === 0}
              onClick={handleMatch}
              className="gap-2"
            >
              <Link2 className="h-5 w-5" />
              Match Selected Transactions
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="reconciled">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">No reconciled transactions to display</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
