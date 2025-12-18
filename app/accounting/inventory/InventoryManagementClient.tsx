"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingDown, Warehouse, Search, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

interface InventoryItem {
  id: string
  name: string
  sku: string
  quantity_on_hand: number
  reorder_point: number
  reorder_quantity: number
  warehouse_location: string
  unit_cost: number
  category: string
}

export default function InventoryManagementClient() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("type", "product")
        .order("name", { ascending: true })

      if (error) throw error

      // Transform products to inventory items
      const inventoryItems = (data || []).map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku || "N/A",
        quantity_on_hand: product.quantity_on_hand || 0,
        reorder_point: 10, // Default reorder point
        reorder_quantity: 50, // Default reorder quantity
        warehouse_location: product.category || "Main",
        unit_cost: product.cost || 0,
        category: product.category || "General",
      }))

      setItems(inventoryItems)
    } catch (error) {
      console.error("Error loading inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const lowStockItems = items.filter((item) => item.quantity_on_hand <= item.reorder_point)
  const totalValue = items.reduce((sum, item) => sum + item.quantity_on_hand * item.unit_cost, 0)
  const totalUnits = items.reduce((sum, item) => sum + item.quantity_on_hand, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
              <p className="text-muted-foreground">Track stock levels, manage warehouses, and optimize inventory</p>
            </div>
            <div className="flex gap-3">
              <Link href="/accounting/inventory/adjustments">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <ArrowUpDown className="h-5 w-5" />
                  Stock Adjustments
                </Button>
              </Link>
              <Link href="/accounting/inventory/warehouses">
                <Button size="lg" className="gap-2">
                  <Warehouse className="h-5 w-5" />
                  Manage Warehouses
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/accounting/inventory?view=all">
              <Card className="p-5 border-border hover:border-purple-500/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                    <p className="text-2xl font-bold text-foreground">{items.length}</p>
                  </div>
                  <Package className="h-10 w-10 text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
              </Card>
            </Link>

            <Link href="/accounting/inventory?view=low-stock">
              <Card className="p-5 border-border hover:border-orange-500/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Low Stock Alert</p>
                    <p className="text-2xl font-bold text-orange-500">{lowStockItems.length}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-orange-500 group-hover:scale-110 transition-transform" />
                </div>
              </Card>
            </Link>

            <Card className="p-5 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Units</p>
                  <p className="text-2xl font-bold text-foreground">{totalUnits.toLocaleString()}</p>
                </div>
                <TrendingDown className="h-10 w-10 text-blue-500" />
              </div>
            </Card>

            <Card className="p-5 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
                  <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                </div>
                <Warehouse className="h-10 w-10 text-green-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Inventory Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">SKU</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">On Hand</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">Reorder Point</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">Unit Cost</th>
                  <th className="p-4 text-right text-sm font-medium text-muted-foreground">Total Value</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Location</th>
                  <th className="p-4 text-center text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => {
                  const needsReorder = item.quantity_on_hand <= item.reorder_point
                  const value = item.quantity_on_hand * item.unit_cost

                  return (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <Link href={`/accounting/inventory/${item.id}`} className="hover:underline">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{item.sku}</td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${needsReorder ? "text-orange-500" : "text-foreground"}`}>
                          {item.quantity_on_hand}
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm text-muted-foreground">{item.reorder_point}</td>
                      <td className="p-4 text-right text-sm text-muted-foreground">${item.unit_cost.toFixed(2)}</td>
                      <td className="p-4 text-right font-medium text-foreground">${value.toFixed(2)}</td>
                      <td className="p-4 text-sm text-muted-foreground">{item.warehouse_location}</td>
                      <td className="p-4 text-center">
                        {needsReorder ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
