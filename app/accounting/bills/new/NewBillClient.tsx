"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"
import { createBill } from "@/app/actions/accounting"
import { toast } from "sonner"

interface Vendor {
  id: string
  company_name: string
}

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export function NewBillClient() {
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    vendor_id: "",
    bill_number: `BILL-${Date.now()}`,
    bill_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  })
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ])

  useEffect(() => {
    loadVendors()
  }, [])

  async function loadVendors() {
    const supabase = getSupabaseBooksClient()
    if (!supabase) return

    const { data, error } = await supabase
      .from("contacts")
      .select("id, company_name")
      .eq("contact_type", "vendor")
      .order("company_name")

    if (!error && data) {
      setVendors(data)
    }
  }

  function addLineItem() {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ])
  }

  function removeLineItem(id: string) {
    if (lineItems.length === 1) return
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  function updateLineItem(id: string, field: keyof LineItem, value: string | number) {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      }),
    )
  }

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0)

  async function handleSubmit(status: "draft" | "open") {
    if (!formData.vendor_id) {
      toast.error("Please select a vendor")
      return
    }

    if (lineItems.some((item) => !item.description)) {
      toast.error("Please fill in all line item descriptions")
      return
    }

    setLoading(true)

    const result = await createBill({
      vendor_id: formData.vendor_id,
      bill_number: formData.bill_number,
      bill_date: formData.bill_date,
      due_date: formData.due_date,
      total_amount: totalAmount,
      status,
      items: lineItems,
      notes: formData.notes,
    })

    setLoading(false)

    if (result.success) {
      toast.success(`Bill ${status === "draft" ? "saved as draft" : "created"}`)
      router.push("/accounting/bills")
    } else {
      toast.error(result.error || "Failed to create bill")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/accounting/bills")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">New Bill</h1>
                <p className="text-sm text-muted-foreground">Create a new vendor bill</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                Save as Draft
              </Button>
              <Button onClick={() => handleSubmit("open")} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Create Bill
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                          {vendor.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bill_number">Bill Number</Label>
                  <Input
                    id="bill_number"
                    value={formData.bill_number}
                    onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bill_date">Bill Date</Label>
                  <Input
                    id="bill_date"
                    type="date"
                    value={formData.bill_date}
                    onChange={(e) => setFormData({ ...formData, bill_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Line Items</h3>
                <Button variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line
                </Button>
              </div>

              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-12 items-end">
                    <div className="md:col-span-5 space-y-2">
                      <Label>Description *</Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Rate</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateLineItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Amount</Label>
                      <Input value={`$${item.amount.toFixed(2)}`} disabled />
                    </div>
                    <div className="md:col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes or terms..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
