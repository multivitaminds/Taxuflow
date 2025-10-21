"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

export function ExpenseFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    vendor_id: "",
    expense_date: new Date().toISOString().split("T")[0],
    description: "",
    account_id: "",
    amount: "",
    receipt_url: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = getSupabaseBooksClient()
    if (!supabase) return

    const [vendorsRes, accountsRes] = await Promise.all([
      supabase.from("contacts").select("*").eq("kind", "vendor"),
      supabase.from("accounts").select("*").eq("type", "expense"),
    ])

    setVendors(vendorsRes.data || [])
    setAccounts(accountsRes.data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/accounting/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: formData.vendor_id,
          entry_date: formData.expense_date,
          description: formData.description,
          account_id: formData.account_id,
          total_amount: Number.parseFloat(formData.amount),
          entry_type: "expense",
        }),
      })

      if (!response.ok) throw new Error("Failed to create expense")

      router.push("/accounting/expenses")
    } catch (error) {
      console.error("Error creating expense:", error)
      alert("Failed to create expense")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Select
              value={formData.vendor_id}
              onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expense_date">Expense Date *</Label>
            <Input
              id="expense_date"
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="account">Category *</Label>
            <Select
              value={formData.account_id}
              onValueChange={(value) => setFormData({ ...formData, account_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="receipt">Receipt (Optional)</Label>
          <div className="flex items-center gap-4">
            <Input id="receipt" type="file" accept="image/*,application/pdf" />
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/accounting/expenses">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || !formData.account_id || !formData.amount}>
            {loading ? "Creating..." : "Add Expense"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
