"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Contractor {
  id: string
  firstName: string
  lastName: string
  ssn: string
  ein: string
  address: string
  city: string
  state: string
  zipCode: string
  compensation: string
}

interface Form1099NECProps {
  userId: string
}

export function Form1099NEC({ userId }: Form1099NECProps) {
  const [contractors, setContractors] = useState<Contractor[]>([
    {
      id: "1",
      firstName: "",
      lastName: "",
      ssn: "",
      ein: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      compensation: "",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addContractor = () => {
    setContractors([
      ...contractors,
      {
        id: Date.now().toString(),
        firstName: "",
        lastName: "",
        ssn: "",
        ein: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        compensation: "",
      },
    ])
  }

  const removeContractor = (id: string) => {
    setContractors(contractors.filter((c) => c.id !== id))
  }

  const updateContractor = (id: string, field: keyof Contractor, value: string) => {
    setContractors(contractors.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/filing/submit-1099", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          taxYear: new Date().getFullYear() - 1,
          contractors: contractors.map((c) => ({
            firstName: c.firstName,
            lastName: c.lastName,
            ssn: c.ssn,
            ein: c.ein,
            address: {
              street: c.address,
              city: c.city,
              state: c.state,
              zipCode: c.zipCode,
            },
            compensation: Number.parseFloat(c.compensation),
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Filing Submitted",
          description: `Submission ID: ${data.submissionId}`,
        })
        router.push("/dashboard/filing")
      } else {
        throw new Error(data.error || "Failed to submit filing")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1099-NEC Filing</CardTitle>
          <CardDescription>File 1099-NEC forms for your contractors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {contractors.map((contractor, index) => (
            <Card key={contractor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Contractor {index + 1}</CardTitle>
                  {contractors.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeContractor(contractor.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`firstName-${contractor.id}`}>First Name</Label>
                    <Input
                      id={`firstName-${contractor.id}`}
                      value={contractor.firstName}
                      onChange={(e) => updateContractor(contractor.id, "firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`lastName-${contractor.id}`}>Last Name</Label>
                    <Input
                      id={`lastName-${contractor.id}`}
                      value={contractor.lastName}
                      onChange={(e) => updateContractor(contractor.id, "lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`ssn-${contractor.id}`}>SSN</Label>
                    <Input
                      id={`ssn-${contractor.id}`}
                      value={contractor.ssn}
                      onChange={(e) => updateContractor(contractor.id, "ssn", e.target.value)}
                      placeholder="XXX-XX-XXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`ein-${contractor.id}`}>EIN (Optional)</Label>
                    <Input
                      id={`ein-${contractor.id}`}
                      value={contractor.ein}
                      onChange={(e) => updateContractor(contractor.id, "ein", e.target.value)}
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`address-${contractor.id}`}>Address</Label>
                  <Input
                    id={`address-${contractor.id}`}
                    value={contractor.address}
                    onChange={(e) => updateContractor(contractor.id, "address", e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`city-${contractor.id}`}>City</Label>
                    <Input
                      id={`city-${contractor.id}`}
                      value={contractor.city}
                      onChange={(e) => updateContractor(contractor.id, "city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`state-${contractor.id}`}>State</Label>
                    <Input
                      id={`state-${contractor.id}`}
                      value={contractor.state}
                      onChange={(e) => updateContractor(contractor.id, "state", e.target.value)}
                      placeholder="CA"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`zipCode-${contractor.id}`}>ZIP Code</Label>
                    <Input
                      id={`zipCode-${contractor.id}`}
                      value={contractor.zipCode}
                      onChange={(e) => updateContractor(contractor.id, "zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`compensation-${contractor.id}`}>Nonemployee Compensation</Label>
                  <Input
                    id={`compensation-${contractor.id}`}
                    type="number"
                    step="0.01"
                    value={contractor.compensation}
                    onChange={(e) => updateContractor(contractor.id, "compensation", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="button" variant="outline" onClick={addContractor} className="w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Another Contractor
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/dashboard/filing">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit to TaxBandits
        </Button>
      </div>
    </form>
  )
}
