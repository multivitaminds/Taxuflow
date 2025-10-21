"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface PersonalInfoClientProps {
  user: User
  profile: any
}

export function PersonalInfoClient({ user, profile }: PersonalInfoClientProps) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    zip_code: profile?.zip_code || "",
    ssn_last_four: profile?.ssn_last_four || "",
    date_of_birth: profile?.date_of_birth || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError } = await supabase.from("user_profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err: any) {
      console.error("[v0] Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
          <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
          <p className="text-muted-foreground mb-8">Update your personal details for tax filing</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-500">Profile updated successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="ssn_last_four">SSN (Last 4 digits)</Label>
                <Input
                  id="ssn_last_four"
                  name="ssn_last_four"
                  maxLength={4}
                  value={formData.ssn_last_four}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  maxLength={2}
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  maxLength={5}
                  value={formData.zip_code}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={loading} className="bg-neon hover:bg-neon/90 text-background">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
