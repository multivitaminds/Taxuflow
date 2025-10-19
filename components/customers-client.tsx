"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Mail, Phone, MapPin, DollarSign, FileText, User, Users } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

export function CustomersClient() {
  const [customers, setCustomers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const supabase = getSupabaseBooksClient()

      if (!supabase) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from("contacts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.total_revenue || 0), 0),
    avgRevenue:
      customers.length > 0 ? customers.reduce((sum, c) => sum + (c.total_revenue || 0), 0) / customers.length : 0,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Customers</h1>
              <p className="text-muted-foreground">Manage your customer relationships</p>
            </div>
            <Link href="/accounting/customers/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Customer
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active</p>
                  <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                </div>
                <User className="h-8 w-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-4 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.avgRevenue.toLocaleString()}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container mx-auto px-6 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Grid */}
        {loading ? (
          <div className="text-center p-8 text-muted-foreground">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <Card className="p-12 text-center border-border">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first customer</p>
            <Link href="/accounting/customers/new">
              <Button>Add Customer</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="p-6 border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <Link
                        href={`/accounting/customers/${customer.id}`}
                        className="font-semibold text-foreground hover:text-accent"
                      >
                        {customer.name}
                      </Link>
                      {customer.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
                    </div>
                  </div>
                  <Badge className={customer.status === "active" ? "bg-green-500/10 text-green-500" : ""}>
                    {customer.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-lg font-semibold text-foreground">
                      ${(customer.total_revenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <Link href={`/accounting/customers/${customer.id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
