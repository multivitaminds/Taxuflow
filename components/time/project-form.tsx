"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface ProjectFormProps {
  onClose: () => void
  onSave: () => void
}

export function ProjectForm({ onClose, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    billingType: "time-and-materials",
    budgetHours: "",
    budgetAmount: "",
    startDate: new Date().toISOString().split("T")[0],
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      billing_type: formData.billingType,
      budget_hours: formData.budgetHours ? Number.parseFloat(formData.budgetHours) : null,
      budget_amount: formData.budgetAmount ? Number.parseFloat(formData.budgetAmount) : null,
      start_date: formData.startDate,
      status: "active",
      is_billable: true,
    })

    setLoading(false)

    if (!error) {
      onSave()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Website Redesign"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project details..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="billingType">Billing Type</Label>
            <Select
              value={formData.billingType}
              onValueChange={(value) => setFormData({ ...formData, billingType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time-and-materials">Time & Materials</SelectItem>
                <SelectItem value="fixed-price">Fixed Price</SelectItem>
                <SelectItem value="non-billable">Non-Billable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetHours">Budget Hours</Label>
              <Input
                id="budgetHours"
                type="number"
                value={formData.budgetHours}
                onChange={(e) => setFormData({ ...formData, budgetHours: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="budgetAmount">Budget Amount</Label>
              <Input
                id="budgetAmount"
                type="number"
                value={formData.budgetAmount}
                onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
