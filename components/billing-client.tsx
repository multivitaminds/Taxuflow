"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, Download, Calendar } from "lucide-react"
import Link from "next/link"

export function BillingClient() {
  const invoices = [
    { id: "INV-2025-001", date: "Jan 1, 2025", amount: "$299.00", status: "paid" },
    { id: "INV-2024-012", date: "Dec 1, 2024", amount: "$299.00", status: "paid" },
    { id: "INV-2024-011", date: "Nov 1, 2024", amount: "$299.00", status: "paid" },
    { id: "INV-2024-010", date: "Oct 1, 2024", amount: "$299.00", status: "paid" },
  ]

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Billing Settings</h1>
        <p className="text-xl text-muted-foreground">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-accent/30 bg-card p-8 mb-8 glow-neon">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Business Plan</h2>
            <p className="text-muted-foreground">10,000 requests per minute • 1M monthly quota</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">$299</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Next billing date: February 1, 2025</p>
        </div>

        <div className="flex gap-3">
          <Link href="/pricing">
            <Button variant="outline" className="bg-transparent">
              Change Plan
            </Button>
          </Link>
          <Button variant="outline" className="bg-transparent text-red-500 border-red-500/30 hover:bg-red-500/10">
            Cancel Subscription
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold">•••• •••• •••• 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2026</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent">
            Update
          </Button>
        </div>

        <Button variant="outline" className="bg-transparent">
          Add Payment Method
        </Button>
      </div>

      {/* Billing History */}
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-bold mb-6">Billing History</h2>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-background-alt border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold">Invoice</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Amount</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-background-alt/50 transition-colors">
                  <td className="p-4 font-mono text-sm">{invoice.id}</td>
                  <td className="p-4 text-sm text-muted-foreground">{invoice.date}</td>
                  <td className="p-4 font-semibold">{invoice.amount}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
