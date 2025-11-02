"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Package, Plus, Search, Filter, MoreVertical, Edit, Trash2, DollarSign, TrendingUp, Loader } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

interface Product {
  id: string
  name: string
  type: "product" | "service"
  sku: string
  price: number
  cost: number
  description: string
  category: string
  is_taxable: boolean
  quantity_on_hand: number | null
  created_at: string
}

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const { data, error } = await supabase
        .from("products_services")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) throw new Error("Supabase not available")

      const { error } = await supabase.from("products_services").delete().eq("id", productId)

      if (error) throw error
      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Failed to delete product")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || product.type === filterType
    return matchesSearch && matchesType
  })

  const stats = {
    totalProducts: products.length,
    services: products.filter((p) => p.type === "service").length,
    physicalProducts: products.filter((p) => p.type === "product").length,
    totalValue: products.reduce((sum, p) => sum + p.price * (p.quantity_on_hand || 1), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Products & Services</h1>
              <p className="text-muted-foreground">Manage your product catalog and service offerings</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Add Product/Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit" : "Add New"} Product or Service</DialogTitle>
                </DialogHeader>
                <ProductForm
                  onClose={() => {
                    setIsCreateDialogOpen(false)
                    setEditingProduct(null)
                    loadProducts()
                  }}
                  initialProduct={editingProduct}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Services</p>
                  <p className="text-2xl font-bold text-foreground">{stats.services}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Products</p>
                  <p className="text-2xl font-bold text-foreground">{stats.physicalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Catalog Value</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Filters and Search */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products and services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="product">Products</SelectItem>
                <SelectItem value="service">Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12 text-center border-border">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first product or service</p>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product or Service</DialogTitle>
                </DialogHeader>
                <ProductForm
                  onClose={() => {
                    setIsCreateDialogOpen(false)
                    loadProducts()
                  }}
                />
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Product/Service</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">SKU</th>
                    <th className="p-4 text-right text-sm font-medium text-muted-foreground">Price</th>
                    <th className="p-4 text-right text-sm font-medium text-muted-foreground">Cost</th>
                    <th className="p-4 text-right text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="p-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            product.type === "service"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-green-500/10 text-green-600"
                          }`}
                        >
                          {product.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{product.sku}</td>
                      <td className="p-4 text-right font-medium text-foreground">${product.price.toFixed(2)}</td>
                      <td className="p-4 text-right text-sm text-muted-foreground">${product.cost.toFixed(2)}</td>
                      <td className="p-4 text-right text-sm text-muted-foreground">
                        {product.quantity_on_hand !== null ? product.quantity_on_hand : "N/A"}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingProduct(product)
                                setIsCreateDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function ProductForm({ onClose, initialProduct }: { onClose: () => void; initialProduct?: Product | null }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    type: (initialProduct?.type as "product" | "service") || "service",
    sku: initialProduct?.sku || "",
    price: initialProduct?.price?.toString() || "",
    cost: initialProduct?.cost?.toString() || "",
    description: initialProduct?.description || "",
    category: initialProduct?.category || "",
    is_taxable: initialProduct?.is_taxable || false,
    quantity_on_hand: initialProduct?.quantity_on_hand?.toString() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) throw new Error("Supabase not available")

      const payload = {
        name: formData.name,
        type: formData.type,
        sku: formData.sku,
        price: Number.parseFloat(formData.price),
        cost: Number.parseFloat(formData.cost || "0"),
        description: formData.description,
        category: formData.category,
        is_taxable: formData.is_taxable,
        quantity_on_hand: formData.type === "product" ? Number.parseInt(formData.quantity_on_hand || "0") : null,
      }

      if (initialProduct) {
        const { error } = await supabase.from("products_services").update(payload).eq("id", initialProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("products_services").insert(payload)

        if (error) throw error
      }

      onClose()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as "product" | "service" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          />
        </div>
        {formData.type === "product" && (
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity_on_hand}
              onChange={(e) => setFormData({ ...formData, quantity_on_hand: e.target.value })}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialProduct ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
