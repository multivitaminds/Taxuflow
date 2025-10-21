"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatPhoneNumber, formatEIN, unformatNumber } from "@/lib/format-utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CustomerFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    contact_name: "",
    company_name: "",
    email: "",
    phone: "",
    tax_id: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Submitting customer form with data:", formData)

      const payload = {
        contact_name: formData.contact_name,
        company_name: formData.company_name,
        email: formData.email,
        phone: unformatNumber(formData.phone),
        tax_id: unformatNumber(formData.tax_id),
        contact_type: "customer",
      }

      console.log("[v0] Sending payload to API:", payload)

      const response = await fetch("/api/accounting/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("[v0] API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to create customer")
      }

      console.log("[v0] Customer created successfully, redirecting...")
      router.push("/accounting/customers")
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error creating customer:", error)
      setError(error.message || "Failed to create customer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    console.log("[v0] Phone formatted:", e.target.value, "->", formatted)
    setFormData({ ...formData, phone: formatted })
  }

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatEIN(e.target.value)
    console.log("[v0] Tax ID formatted:", e.target.value, "->", formatted)
    setFormData({ ...formData, tax_id: formatted })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="contact_name">Customer Name *</Label>
            <Input
              id="contact_name"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Acme Corp"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              maxLength={14}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input
              id="tax_id"
              value={formData.tax_id}
              onChange={handleTaxIdChange}
              placeholder="XX-XXXXXXX"
              maxLength={10}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/accounting/customers">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || !formData.contact_name || !formData.email}>
            {loading ? "Creating..." : "Add Customer"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
