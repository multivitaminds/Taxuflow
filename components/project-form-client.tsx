"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSupabaseBooksClient } from "@/lib/supabase/books-client"

export function ProjectFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    customer_id: "",
    budget: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    status: "active",
  })

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const supabase = getSupabaseBooksClient()
    if (!supabase) return

    const { data } = await supabase
      .from("contacts")
      .select("*")
      .eq("kind", "customer")

    setCustomers(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = getSupabaseBooksClient()
      if (!supabase) throw new Error("Supabase client not available")

      const { error } = await supabase.from("projects").insert({
        name: formData.name,
        description: formData.description || null,
        customer_id: formData.customer_id || null,
        budget: formData.budget ? Number.parseFloat(formData.budget) : null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        status: formData.status,
      })

      if (error) throw error

      router.push("/accounting/projects")
    } catch (error) {
      console.error("[v0] Error creating project:", error)
      alert("Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Project name"
              required
            />
          </div>

          <div>
            <Label htmlFor="customer_id">Customer</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this project"
          />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="start_date">Start Date *</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/accounting/projects">
            <Button type="button" variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || !formData.name}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </Card>
    </form>
  )
}
