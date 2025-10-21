"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Download, Trash2, Edit, DollarSign } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

export function InvoiceDetailClient({ invoiceId }: { invoiceId: string }) {
  const router = useRouter()
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  async function loadInvoice() {
    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:contacts!customer_id (
            id,
            display_name,
            email,
            phone
          ),
          invoice_lines (
            id,
            description,
            quantity,
            unit_price,
            amount
          )
        `)
        .eq("id", invoiceId)
        .single()

      if (error) throw error
      setInvoice(data)
    } catch (error) {
      console.error("Error loading invoice:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this invoice?")) return

    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) return

      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId)

      if (error) throw error
      router.push("/accounting/invoices")
    } catch (error) {
      console.error("Error deleting invoice:", error)
      alert("Failed to delete invoice")
    }
  }

  async function handleSendEmail() {
    alert("Email functionality coming soon!")
  }

  if (loading) {
    return <div className="p-8 text-center">Loading invoice...</div>
  }

  if (!invoice) {
    return <div className="p-8 text-center">Invoice not found</div>
  }

  const statusColors = {
    draft: "bg-gray-500/10 text-gray-500",
    open: "bg-blue-500/10 text-blue-500",
    paid: "bg-green-500/10 text-green-500",
    void: "bg-red-500/10 text-red-500",
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{invoice.number}</h1>
            <p className="text-muted-foreground">Invoice Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2">Invoice {invoice.number}</h2>
                <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="font-medium">{new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground mt-2">Due Date</p>
                <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="font-medium">{invoice.customer?.display_name}</p>
              {invoice.customer?.email && <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>}
              {invoice.customer?.phone && <p className="text-sm text-muted-foreground">{invoice.customer.phone}</p>}
            </div>

            <div className="border-t pt-6">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoice_lines?.map((line: any) => (
                    <tr key={line.id} className="border-b">
                      <td className="py-3">{line.description}</td>
                      <td className="text-right py-3">{line.quantity}</td>
                      <td className="text-right py-3">${line.unit_price.toFixed(2)}</td>
                      <td className="text-right py-3">${line.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>${invoice.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-orange-600">
                    <span>Balance Due:</span>
                    <span>${invoice.balance.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full" variant="default">
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Payment History</h3>
            <p className="text-sm text-muted-foreground">No payments recorded yet</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
