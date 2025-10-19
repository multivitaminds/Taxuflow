"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"

interface CustomFieldDefinitionFormProps {
  entityType: string
  onClose: () => void
  onSave: () => void
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Yes/No" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multi-select", label: "Multi-Select" },
]

export function CustomFieldDefinitionForm({ entityType, onClose, onSave }: CustomFieldDefinitionFormProps) {
  const [formData, setFormData] = useState({
    fieldName: "",
    fieldLabel: "",
    fieldType: "text",
    helpText: "",
    placeholder: "",
    isRequired: false,
    defaultValue: "",
    options: "",
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

    // Convert field name to snake_case
    const fieldName = formData.fieldLabel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")

    const fieldOptions =
      formData.fieldType === "dropdown" || formData.fieldType === "multi-select"
        ? {
            options: formData.options
              .split("\n")
              .map((o) => o.trim())
              .filter((o) => o),
          }
        : null

    const { error } = await supabase.from("custom_field_definitions").insert({
      user_id: user.id,
      entity_type: entityType,
      field_name: fieldName,
      field_label: formData.fieldLabel,
      field_type: formData.fieldType,
      help_text: formData.helpText || null,
      placeholder: formData.placeholder || null,
      is_required: formData.isRequired,
      default_value: formData.defaultValue || null,
      field_options: fieldOptions,
      is_active: true,
    })

    setLoading(false)

    if (!error) {
      onSave()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fieldLabel">Field Label</Label>
            <Input
              id="fieldLabel"
              value={formData.fieldLabel}
              onChange={(e) => setFormData({ ...formData, fieldLabel: e.target.value })}
              placeholder="e.g., Customer Priority"
              required
            />
          </div>

          <div>
            <Label htmlFor="fieldType">Field Type</Label>
            <Select
              value={formData.fieldType}
              onValueChange={(value) => setFormData({ ...formData, fieldType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(formData.fieldType === "dropdown" || formData.fieldType === "multi-select") && (
            <div>
              <Label htmlFor="options">Options (one per line)</Label>
              <Textarea
                id="options"
                value={formData.options}
                onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                placeholder="High&#10;Medium&#10;Low"
                rows={4}
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="helpText">Help Text (Optional)</Label>
            <Input
              id="helpText"
              value={formData.helpText}
              onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
              placeholder="Additional information about this field"
            />
          </div>

          <div>
            <Label htmlFor="placeholder">Placeholder (Optional)</Label>
            <Input
              id="placeholder"
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="Enter value..."
            />
          </div>

          <div>
            <Label htmlFor="defaultValue">Default Value (Optional)</Label>
            <Input
              id="defaultValue"
              value={formData.defaultValue}
              onChange={(e) => setFormData({ ...formData, defaultValue: e.target.value })}
              placeholder="Default value"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isRequired">Required Field</Label>
            <Switch
              id="isRequired"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData({ ...formData, isRequired: checked })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Field"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
