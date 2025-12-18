"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Package, Plus, Search, DollarSign, TrendingUp } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ProductsDashboardClientProps {
  user: User
}

export function ProductsDashboardClient({ user }: ProductsDashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
  }, [user.id])

  const fetchProducts = async () => {
    setLoading(false)
    // TODO: Fetch actual products from database
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Products & Services</h1>
              <p className="text-muted-foreground">Manage your product catalog and pricing</p>
            </div>
            <Button
              onClick={() => router.push("/accounting/products/new")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Total Products</span>
            </div>
            <div className="text-3xl font-bold">{products.length}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Avg. Price</span>
            </div>
            <div className="text-3xl font-bold text-green-500">$0</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Active Products</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">{products.length}</div>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Products</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-background border border-neon/20 rounded-lg focus:outline-none focus:border-neon/40"
                />
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-6">Add your first product or service to start invoicing</p>
              <Button
                onClick={() => router.push("/accounting/products/new")}
                className="bg-neon hover:bg-neon/90 text-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/accounting/products/${product.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${product.price}</div>
                    <div className="text-sm text-muted-foreground">{product.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/invoices/dashboard")}
            className="border-neon/20"
          >
            View Invoices
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/customers/dashboard")}
            className="border-neon/20"
          >
            View Customers
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/reports/dashboard")}
            className="border-neon/20"
          >
            View Reports
          </Button>
        </div>
      </div>
    </div>
  )
}
