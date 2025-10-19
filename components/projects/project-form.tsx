"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ProjectFormProps {
  projectId?: string
  onClose: () => void
  onSave: () => void
}

interface Customer {
  id: string
  company_name: string
}

export function ProjectForm({ projectId, onClose, onSave }: ProjectFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [status, setStatus] = useState("active")
  const [billingType, setBillingType] = useState("hourly")
  const [budgetHours, setBudgetHours] = useState("")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(!!projectId)

  const supabase = createClient()

  useEffect(() => {
    loadCustomers()
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  async function loadCustomers() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from("customers").select("id, company_name").eq("user_id", user.id)

    if (data) setCustomers(data)
  }

  async function loadProject() {
    if (!projectId) return

    const { data } = await supabase.from("projects").select("*").eq("id", projectId).single()

    if (data) {
      setName(data.name || "")
      setDescription(data.description || "")
      setCustomerId(data.customer_id || "")
      setStatus(data.status || "active")
      setBillingType(data.billing_type || "hourly")
      setBudgetHours(data.budget_hours?.toString() || "")
      setBudgetAmount(data.budget_amount?.toString() || "")
      setHourlyRate(data.hourly_rate?.toString() || "")
      setStartDate(data.start_date || "")
      setEndDate(data.end_date || "")
    }

    setLoadingData(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const projectData = {
      name,
      description,
      customer_id: customerId || null,
      status,
      billing_type: billingType,
      budget_hours: budgetHours ? Number.parseFloat(budgetHours) : null,
      budget_amount: budgetAmount ? Number.parseFloat(budgetAmount) : null,
      hourly_rate: hourlyRate ? Number.parseFloat(hourlyRate) : null,
      start_date: startDate || null,
      end_date: endDate || null,
      user_id: user.id,
    }

    if (projectId) {
      await supabase.from("projects").update(projectData).eq("id", projectId)
    } else {
      await supabase.from("projects").insert(projectData)
    }

    setLoading(false)
    onSave()
  }

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-6">
          <p>Loading project...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{projectId ? "Edit Project" : "New Project"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Website Redesign"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description and objectives"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingType">Billing Type</Label>
            <Select value={billingType} onValueChange={setBillingType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="non-billable">Non-Billable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {billingType === "hourly" && (
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="150.00"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetHours">Budget Hours</Label>
              <Input
                id="budgetHours"
                type="number"
                step="0.5"
                value={budgetHours}
                onChange={(e) => setBudgetHours(e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount ($)</Label>
              <Input
                id="budgetAmount"
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="15000.00"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : projectId ? "Update Project" : "Create Project"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
