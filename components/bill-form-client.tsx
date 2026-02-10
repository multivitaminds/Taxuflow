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

export function BillFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    vendor_id: "",
    bill_number: `BILL-${Date.now()}`,
    bill_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
    status: "draft",
  })
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, unit_price: 0, amount: 0 }])

  useEffect(() => {
    loadVendors()
  }, [])

  async function loadVendors() {
    const supabase = getSupabaseBooksClient()
    if (!supabase) return

    const { data } = await supabase.from("contacts").select("*").eq("kind", "vendor")
    setVendors(data || [])
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
  const total = subtotal

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/accounting/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          total_amount: total,
          items: lineItems,
        }),
      })

      if (!response.ok) throw new Error("Failed to create bill")

      router.push("/accounting/bills")
    } catch (error) {
      console.error("[v0] Error creating bill:", error)
      alert("Failed to create bill")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="vendor">Vendor *</Label>
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
            <Label htmlFor="bill_number">Bill Number *</Label>
            <Input
              id="bill_number"
              value={formData.bill_number}
              onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="bill_date">Bill Date *</Label>
            <Input
              id="bill_date"
              type="date"
              value={formData.bill_date}
              onChange={(e) => setFormData({ ...formData, bill_date: e.target.value })}
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
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes..."
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/accounting/bills">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || !formData.vendor_id}>
            {loading ? "Creating..." : "Create Bill"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
