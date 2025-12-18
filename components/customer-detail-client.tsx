"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Edit, ArrowLeft, Trash2, Loader, FileText } from "lucide-react"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  status: string
  notes: string
  total_revenue: number
  created_at: string
}

export function CustomerDetailClient({ customerId }: { customerId: string }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadCustomer()
  }, [customerId])

  async function loadCustomer() {
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const [customerRes, invoicesRes] = await Promise.all([
        supabase.from("contacts").select("*").eq("id", customerId).single(),
        supabase
          .from("invoices")
          .select("id, invoice_number, total_amount, status, invoice_date")
          .eq("contact_id", customerId)
          .order("invoice_date", { ascending: false })
          .limit(5),
      ])

      if (customerRes.error) throw customerRes.error
      setCustomer(customerRes.data)
      if (invoicesRes.error) throw invoicesRes.error
      setInvoices(invoicesRes.data || [])
    } catch (error) {
      console.error("Error loading customer:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    setDeleting(true)
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) throw new Error("Supabase not available")

      const { error } = await supabase.from("contacts").delete().eq("id", customerId)

      if (error) throw error
      router.push("/accounting/customers")
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert("Failed to delete customer")
    } finally {
      setDeleting(false)
    }
  }

  const getFullAddress = () => {
    if (!customer) return ""
    const parts = [customer.address, customer.city, customer.state, customer.zip_code].filter(Boolean)
    return parts.join(", ")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Customer not found</p>
        <Link href="/accounting/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <Link href="/accounting/customers">
            <Button variant="outline" size="sm" className="gap-2 mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {customer.company_name || customer.contact_name}
              </h1>
              <div className="flex items-center gap-3">
                <Badge className={customer.status === "active" ? "bg-green-500/10 text-green-500" : ""}>
                  {customer.status || "active"}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/accounting/customers/${customerId}/edit`}>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${customer.email}`} className="text-accent hover:underline">
                    {customer.email}
                  </a>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${customer.phone}`} className="text-accent hover:underline">
                    {customer.phone}
                  </a>
                </div>
              )}
              {getFullAddress() && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span className="text-foreground">{getFullAddress()}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Revenue Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Revenue</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="text-2xl font-bold text-foreground">
                  ${(customer.total_revenue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-muted-foreground">Total Invoices</span>
                <span className="text-lg font-semibold text-foreground">{invoices.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Invoices */}
        {invoices.length > 0 && (
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Recent Invoices
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 text-muted-foreground">Invoice #</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Date</th>
                    <th className="text-right py-2 px-4 text-muted-foreground">Amount</th>
                    <th className="text-left py-2 px-4 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border">
                      <td className="py-3 px-4">
                        <Link href={`/accounting/invoices/${invoice.id}`} className="text-accent hover:underline">
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">${invoice.total_amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge className="text-xs">{invoice.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Notes */}
        {customer.notes && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.notes}</p>
          </Card>
        )}
      </div>
    </div>
  )
}
