"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock } from "lucide-react"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

interface RecipientFormProps {
  recipientId?: string
  onSuccess: () => void
}

export function RecipientForm({ recipientId, onSuccess }: RecipientFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    ssn: "",
    ein: "",
    tinType: "SSN",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (recipientId) {
      fetchRecipient()
    }
  }, [recipientId])

  const fetchRecipient = async () => {
    try {
      const response = await fetch(`/api/recipients/${recipientId}`)
      const data = await response.json()
      const r = data.recipient
      setFormData({
        firstName: r.first_name,
        lastName: r.last_name,
        businessName: r.business_name || "",
        email: r.email || "",
        phone: r.phone || "",
        ssn: r.ssn || "",
        ein: r.ein || "",
        tinType: r.tin_type,
        streetAddress: r.street_address,
        city: r.city,
        state: r.state,
        zipCode: r.zip_code,
        notes: r.notes || "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipient details",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = recipientId ? `/api/recipients/${recipientId}` : "/api/recipients"
      const method = recipientId ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: recipientId ? "Recipient updated successfully" : "Recipient added successfully",
        })
        onSuccess()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save recipient",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{recipientId ? "Edit Recipient" : "Add New Recipient"}</DialogTitle>
        <DialogDescription>
          {recipientId ? "Update recipient information" : "Add a new contractor or recipient for 1099 filing"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name (Optional)</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ssn" className="flex items-center gap-2">
              SSN *
              <Lock className="w-3 h-3 text-green-500" />
            </Label>
            <Input
              id="ssn"
              value={formData.ssn}
              onChange={(e) => setFormData({ ...formData, ssn: e.target.value, tinType: "SSN" })}
              placeholder="XXX-XX-XXXX"
            />
            <p className="text-xs text-muted-foreground">AES-256 encrypted at rest</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ein" className="flex items-center gap-2">
              EIN (if business)
              <Lock className="w-3 h-3 text-green-500" />
            </Label>
            <Input
              id="ein"
              value={formData.ein}
              onChange={(e) => setFormData({ ...formData, ein: e.target.value, tinType: "EIN" })}
              placeholder="XX-XXXXXXX"
            />
            <p className="text-xs text-muted-foreground">Encrypted and secure</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address *</Label>
          <Input
            id="streetAddress"
            value={formData.streetAddress}
            onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading} className="bg-purple-500 hover:bg-purple-600">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {recipientId ? "Update Recipient" : "Add Recipient"}
          </Button>
        </div>
      </form>
    </>
  )
}
