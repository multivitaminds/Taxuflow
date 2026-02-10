"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

interface Contact {
  id: string
  display_name: string
  kind: string
}

export function RecurringFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [formData, setFormData] = useState({
    name: "",
    type: "" as "invoice" | "expense" | "bill" | "",
    frequency: "" as "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "",
    amount: "",
    next_date: "",
    customer_id: "",
    vendor_id: "",
    description: "",
  })

  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    const supabase = getSupabaseBooksClient()
    if (!supabase) return

    const { data, error } = await supabase
      .from("contacts")
      .select("id, display_name, kind")
      .order("display_name")

    if (error) {
      console.error("[v0] Error loading contacts:", error)
      return
    }

    setContacts(data || [])
  }

  const customers = contacts.filter((c) => c.kind === "customer")
  const vendors = contacts.filter((c) => c.kind === "vendor")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) throw new Error("Supabase client not available")

      const payload: Record<string, unknown> = {
        name: formData.name,
        type: formData.type,
        frequency: formData.frequency,
        amount: parseFloat(formData.amount),
        next_date: formData.next_date,
        description: formData.description || null,
        status: "active",
      }

      if (formData.type === "invoice" && formData.customer_id) {
        payload.customer_id = formData.customer_id
      }
      if (formData.type === "bill" && formData.vendor_id) {
        payload.vendor_id = formData.vendor_id
      }

      console.log("[v0] Creating recurring transaction:", payload)

      const { error } = await supabase
        .from("recurring_transactions")
        .insert(payload)

      if (error) throw error

      console.log("[v0] Recurring transaction created successfully")
      router.push("/accounting/recurring")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error creating recurring transaction:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Monthly Rent Payment"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value as "invoice" | "expense" | "bill", customer_id: "", vendor_id: "" })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="bill">Bill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="frequency">Frequency *</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) =>
                setFormData({ ...formData, frequency: value as "daily" | "weekly" | "monthly" | "quarterly" | "yearly" })
              }
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="next_date">Next Date *</Label>
            <Input
              id="next_date"
              type="date"
              value={formData.next_date}
              onChange={(e) => setFormData({ ...formData, next_date: e.target.value })}
              required
            />
          </div>

          {formData.type === "invoice" && (
            <div>
              <Label htmlFor="customer_id">Customer</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
              >
                <SelectTrigger id="customer_id">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.type === "bill" && (
            <div>
              <Label htmlFor="vendor_id">Vendor</Label>
              <Select
                value={formData.vendor_id}
                onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
              >
                <SelectTrigger id="vendor_id">
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
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description for this recurring transaction"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/accounting/recurring">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.type || !formData.frequency || !formData.amount || !formData.next_date}
          >
            {loading ? "Creating..." : "Create Recurring Transaction"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
