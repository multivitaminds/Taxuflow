"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Package, TrendingUp, DollarSign, MapPin, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

interface StockMovement {
  id: string
  date: string
  type: "purchase" | "sale" | "adjustment" | "return"
  quantity: number
  unit_cost: number
  reference: string
  notes: string
}

export default function InventoryDetailClient({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<any>(null)
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInventoryDetail()
  }, [itemId])

  async function loadInventoryDetail() {
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const { data, error } = await supabase.from("products").select("*").eq("id", itemId).single()

      if (error) throw error
      setItem(data)

      // Mock stock movements data
      setMovements([
        {
          id: "1",
          date: "2024-01-15",
          type: "purchase",
          quantity: 100,
          unit_cost: data.cost,
          reference: "PO-001",
          notes: "Initial stock purchase",
        },
        {
          id: "2",
          date: "2024-01-20",
          type: "sale",
          quantity: -25,
          unit_cost: data.cost,
          reference: "INV-001",
          notes: "Sold to Customer A",
        },
        {
          id: "3",
          date: "2024-01-25",
          type: "adjustment",
          quantity: -5,
          unit_cost: data.cost,
          reference: "ADJ-001",
          notes: "Damaged items write-off",
        },
      ])
    } catch (error) {
      console.error("Error loading inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !item) {
    return <div className="p-6">Loading...</div>
  }

  const currentStock = item.quantity_on_hand || 0
  const reorderPoint = 10
  const avgCost = item.cost || 0
  const totalValue = currentStock * avgCost

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container mx-auto px-6 py-8">
          <Link href="/accounting/inventory">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{item.name}</h1>
              <p className="text-muted-foreground">SKU: {item.sku || "N/A"}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Plus className="h-5 w-5" />
                Add Stock
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Minus className="h-5 w-5" />
                Remove Stock
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Stock</p>
                  <p className="text-2xl font-bold text-foreground">{currentStock}</p>
                </div>
                <Package className="h-10 w-10 text-purple-500" />
              </div>
            </Card>

            <Card className="p-5 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reorder Point</p>
                  <p className="text-2xl font-bold text-foreground">{reorderPoint}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-500" />
              </div>
            </Card>

            <Card className="p-5 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Unit Cost</p>
                  <p className="text-2xl font-bold text-foreground">${avgCost.toFixed(2)}</p>
                </div>
                <DollarSign className="h-10 w-10 text-blue-500" />
              </div>
            </Card>

            <Card className="p-5 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</p>
                </div>
                <MapPin className="h-10 w-10 text-green-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Movements */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Stock Movement History</h2>
              <div className="space-y-4">
                {movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            movement.type === "purchase"
                              ? "bg-green-500/10 text-green-600"
                              : movement.type === "sale"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-orange-500/10 text-orange-600"
                          }`}
                        >
                          {movement.type}
                        </span>
                        <span className="text-sm text-muted-foreground">{movement.date}</span>
                        <span className="text-sm text-muted-foreground">Ref: {movement.reference}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{movement.notes}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">@ ${movement.unit_cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* COGS & Valuation */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">COGS Calculation</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Opening Stock</span>
                  <span className="font-medium text-foreground">100 units</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Purchases</span>
                  <span className="font-medium text-green-600">+100 units</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Sales</span>
                  <span className="font-medium text-red-600">-25 units</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Adjustments</span>
                  <span className="font-medium text-orange-600">-5 units</span>
                </div>
                <div className="flex justify-between items-center pt-3">
                  <span className="font-bold text-foreground">Closing Stock</span>
                  <span className="font-bold text-foreground">{currentStock} units</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-border">
                  <span className="font-bold text-foreground">COGS</span>
                  <span className="font-bold text-foreground">${(30 * avgCost).toFixed(2)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Warehouse Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{item.category || "Main"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bin</span>
                  <span className="font-medium text-foreground">A-12-3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Counted</span>
                  <span className="font-medium text-foreground">Jan 15, 2024</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
