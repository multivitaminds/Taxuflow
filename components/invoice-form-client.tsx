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
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"
import { createClient } from "@/lib/supabase/client"

export function InvoiceFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [customers, setCustomers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    customer_id: "",
    invoice_number: `INV-${Date.now()}`,
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
    terms: "Net 30",
  })
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, unit_price: 0, amount: 0 }])

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    console.log("[v0] Loading customers...")
    setLoadingCustomers(true)

    try {
      const supabaseBooks = getSupabaseBooksClient()
      const supabasePublic = createClient()

      let allCustomers: any[] = []

      // Try books schema first
      if (supabaseBooks) {
        const { data: booksContacts, error: booksError } = await supabaseBooks
          .from("contacts")
          .select("*")
          .eq("kind", "customer")
          .order("display_name")

        if (!booksError && booksContacts) {
          console.log("[v0] Loaded", booksContacts.length, "customers from books.contacts")
          allCustomers = [
            ...allCustomers,
            ...booksContacts.map((c) => ({
              ...c,
              source: "books",
            })),
          ]
        } else if (booksError) {
          console.error("[v0] Error loading from books.contacts:", booksError)
        }
      }

      // Try public schema
      const { data: publicCustomers, error: publicError } = await supabasePublic
        .from("customers")
        .select("*")
        .eq("is_active", true)
        .order("company_name")

      if (!publicError && publicCustomers) {
        console.log("[v0] Loaded", publicCustomers.length, "customers from public.customers")
        allCustomers = [
          ...allCustomers,
          ...publicCustomers.map((c) => ({
            id: c.id,
            display_name: c.company_name || c.contact_name || "Unnamed Customer",
            email: c.email,
            source: "public",
          })),
        ]
      } else if (publicError) {
        console.error("[v0] Error loading from public.customers:", publicError)
      }

      // Try public contacts as fallback
      if (allCustomers.length === 0) {
        const { data: publicContacts, error: contactsError } = await supabasePublic
          .from("contacts")
          .select("*")
          .eq("contact_type", "customer")
          .order("name")

        if (!contactsError && publicContacts) {
          console.log("[v0] Loaded", publicContacts.length, "customers from public.contacts")
          allCustomers = publicContacts.map((c) => ({
            id: c.id,
            display_name: c.display_name || c.name || c.company_name || "Unnamed Customer",
            email: c.email,
            source: "contacts",
          }))
        }
      }

      console.log("[v0] Total customers loaded:", allCustomers.length)
      setCustomers(allCustomers)
    } catch (error) {
      console.error("[v0] Error loading customers:", error)
    } finally {
      setLoadingCustomers(false)
    }
  }

  function addLineItem() {
    setLineItems([...lineItems, { description: "", quantity: 1, unit_price: 0, amount: 0 }])
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  function updateLineItem(index: number, field: string, value: any) {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }

    // Recalculate amount
    if (field === "quantity" || field === "unit_price") {
      updated[index].amount = updated[index].quantity * updated[index].unit_price
    }

    setLineItems(updated)
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Creating invoice with data:", { ...formData, items: lineItems })

      const response = await fetch("/api/accounting/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: formData.customer_id,
          invoice_number: formData.invoice_number,
          invoice_date: formData.invoice_date,
          due_date: formData.due_date,
          notes: formData.notes,
          terms: formData.terms,
          items: lineItems,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("[v0] Invoice creation failed:", result)
        throw new Error(result.error || "Failed to create invoice")
      }

      console.log("[v0] Invoice created successfully:", result)
      router.push("/accounting/invoices")
    } catch (error) {
      console.error("[v0] Error creating invoice:", error)
      alert(error instanceof Error ? error.message : "Failed to create invoice")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="customer">Customer *</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) => {
                console.log("[v0] Selected customer:", value)
                setFormData({ ...formData, customer_id: value })
              }}
              disabled={loadingCustomers}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingCustomers
                      ? "Loading customers..."
                      : customers.length === 0
                        ? "No customers found"
                        : "Select customer"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {customers.length === 0 && !loadingCustomers && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No customers available.{" "}
                    <Link href="/accounting/customers" className="text-primary underline">
                      Add a customer
                    </Link>{" "}
                    first.
                  </div>
                )}
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.display_name} {customer.email && `(${customer.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="invoice_number">Invoice Number *</Label>
            <Input
              id="invoice_number"
              value={formData.invoice_number}
              onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="invoice_date">Invoice Date *</Label>
            <Input
              id="invoice_date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="due_date">Due Date *</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Label>Line Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Line
            </Button>
          </div>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(index, "unit_price", Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Amount</Label>
                  <Input value={`$${item.amount.toFixed(2)}`} disabled />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(index)}
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6 mb-6">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="terms">Payment Terms</Label>
            <Input
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              placeholder="Net 30"
            />
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes or terms..."
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/accounting/invoices">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={
              loading || !formData.customer_id || lineItems.length === 0 || lineItems.some((item) => !item.description)
            }
            className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
