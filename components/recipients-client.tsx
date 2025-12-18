"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Download, Upload, Edit, Trash2, DollarSign, Lock, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { RecipientForm } from "@/components/recipient-form"
import { PaymentHistoryDialog } from "@/components/payment-history-dialog"
import { BulkImportDialog } from "@/components/bulk-import-dialog"

interface Recipient {
  id: string
  first_name: string
  last_name: string
  business_name?: string
  email?: string
  phone?: string
  ssn_masked?: string
  ein_masked?: string
  tin_type: string
  street_address: string
  city: string
  state: string
  zip_code: string
  total_payments: number
  payment_count: number
  last_payment_date?: string
  is_active: boolean
}

export function RecipientsClient({ userId }: { userId: string }) {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [filteredRecipients, setFilteredRecipients] = useState<Recipient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRecipients()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = recipients.filter(
        (r) =>
          r.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.business_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRecipients(filtered)
    } else {
      setFilteredRecipients(recipients)
    }
  }, [searchQuery, recipients])

  const fetchRecipients = async () => {
    try {
      const response = await fetch("/api/recipients")
      const data = await response.json()
      setRecipients(data.recipients || [])
      setFilteredRecipients(data.recipients || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipients",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipient?")) return

    try {
      const response = await fetch(`/api/recipients/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Recipient deleted successfully",
        })
        fetchRecipients()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recipient",
        variant: "destructive",
      })
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/recipients/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `recipients-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Recipients exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export recipients",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Link href="/1099-filing">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to 1099 Filing
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold">Manage Recipients</h1>
          </div>
          <p className="text-muted-foreground">
            Add and manage contractor information for easy filing and record keeping
          </p>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search recipients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <BulkImportDialog
                    onSuccess={() => {
                      setIsImportOpen(false)
                      fetchRecipients()
                    }}
                  />
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleExport} className="flex-1 md:flex-none bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-500 hover:bg-purple-600 flex-1 md:flex-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Recipient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <RecipientForm
                    onSuccess={() => {
                      setIsFormOpen(false)
                      fetchRecipients()
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        <Card className="border-neon/20 bg-card/50 backdrop-blur">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-green-500" />
                    TIN
                  </div>
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Payments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Loading recipients...
                  </TableCell>
                </TableRow>
              ) : filteredRecipients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? "No recipients found matching your search"
                      : "No recipients yet. Add your first recipient to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecipients.map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {recipient.first_name} {recipient.last_name}
                        </div>
                        {recipient.business_name && (
                          <div className="text-sm text-muted-foreground">{recipient.business_name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {recipient.email && <div>{recipient.email}</div>}
                        {recipient.phone && <div className="text-muted-foreground">{recipient.phone}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-green-500" />
                          {recipient.tin_type}
                        </div>
                        <div className="text-muted-foreground font-mono">
                          {recipient.ssn_masked || recipient.ein_masked}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{recipient.street_address}</div>
                        <div className="text-muted-foreground">
                          {recipient.city}, {recipient.state} {recipient.zip_code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PaymentHistoryDialog
                        recipientId={recipient.id}
                        recipientName={`${recipient.first_name} ${recipient.last_name}`}
                      >
                        <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                          <div className="text-left">
                            <div className="font-medium">${recipient.total_payments?.toFixed(2) || "0.00"}</div>
                            <div className="text-xs text-muted-foreground">{recipient.payment_count || 0} payments</div>
                          </div>
                        </Button>
                      </PaymentHistoryDialog>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <RecipientForm recipientId={recipient.id} onSuccess={() => fetchRecipients()} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(recipient.id)}
                          className="hover:bg-red-500/10 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-neon/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{recipients.length}</div>
                <div className="text-sm text-muted-foreground">Total Recipients</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-neon/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  ${recipients.reduce((sum, r) => sum + (r.total_payments || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Payments</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-neon/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <div className="flex items-center gap-3">
              <Lock className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">AES-256</div>
                <div className="text-sm text-muted-foreground">Encrypted Storage</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
