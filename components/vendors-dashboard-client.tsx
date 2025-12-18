"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Building2, Plus, Search, DollarSign, Clock } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface VendorsDashboardClientProps {
  user: User
}

export function VendorsDashboardClient({ user }: VendorsDashboardClientProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<any[]>([])

  useEffect(() => {
    fetchVendors()
  }, [user.id])

  const fetchVendors = async () => {
    setLoading(false)
    // TODO: Fetch actual vendors from database
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
              <h1 className="text-4xl font-bold mb-2">Vendors</h1>
              <p className="text-muted-foreground">Manage bills and vendor relationships</p>
            </div>
            <Button
              onClick={() => router.push("/accounting/vendors/new")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Vendor
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-red-500" />
              <span className="text-sm text-muted-foreground">Total Vendors</span>
            </div>
            <div className="text-3xl font-bold">{vendors.length}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Outstanding Bills</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">$0</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Overdue Bills</span>
            </div>
            <div className="text-3xl font-bold text-yellow-500">0</div>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Vendors</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  className="pl-10 pr-4 py-2 bg-background border border-neon/20 rounded-lg focus:outline-none focus:border-neon/40"
                />
              </div>
            </div>
          </div>

          {vendors.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Vendors Yet</h3>
              <p className="text-muted-foreground mb-6">Add your first vendor to start tracking bills and payments</p>
              <Button
                onClick={() => router.push("/accounting/vendors/new")}
                className="bg-neon hover:bg-neon/90 text-background"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => router.push(`/accounting/vendors/${vendor.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="font-semibold">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${vendor.total_billed || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Billed</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/expenses/dashboard")}
            className="border-neon/20"
          >
            View Expenses
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/reports/dashboard")}
            className="border-neon/20"
          >
            View Reports
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/accounting/banking/dashboard")}
            className="border-neon/20"
          >
            View Banking
          </Button>
        </div>
      </div>
    </div>
  )
}
