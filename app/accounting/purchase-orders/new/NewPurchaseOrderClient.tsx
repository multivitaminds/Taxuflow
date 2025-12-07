"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewPurchaseOrderClient() {
  const router = useRouter()
  const [items, setItems] = useState([{ id: "1", description: "", quantity: 1, unitPrice: 0 }])

  const addItem = () => {
    setItems([...items, { id: String(items.length + 1), description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSave = () => {
    // Save logic here
    router.push("/accounting/purchase-orders")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/purchase-orders">
            <Button variant="outline" size="icon" className="bg-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">New Purchase Order</h1>
            <p className="text-slate-600 mt-1">Create a new purchase order for vendor</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/accounting/purchase-orders">
            <Button variant="outline" className="bg-white">
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="h-4 w-4 mr-2" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4">Vendor Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" placeholder="Select vendor..." className="mt-1" />
              </div>
              <div>
                <Label htmlFor="poNumber">PO Number</Label>
                <Input id="poNumber" placeholder="Auto-generated" className="mt-1" disabled />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Line Items</h3>
              <Button onClick={addItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Input
                      id={`description-${item.id}`}
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`unitPrice-${item.id}`}>Unit Price</Label>
                    <Input
                      id={`unitPrice-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <div className="mt-1 h-10 flex items-center justify-end font-semibold text-slate-900">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t mt-6">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (10%):</span>
                  <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Add any special instructions or notes..."
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <h3 className="font-semibold text-slate-900 mb-4">Order Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderDate">Order Date</Label>
                <Input id="orderDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="dueDate">Expected Delivery</Label>
                <Input id="dueDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="shipTo">Ship To</Label>
                <Input id="shipTo" placeholder="Shipping address" className="mt-1" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-slate-900 mb-2">Approval Required</h3>
            <p className="text-sm text-slate-700">
              This purchase order will be sent for approval based on your company's approval workflow settings.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
