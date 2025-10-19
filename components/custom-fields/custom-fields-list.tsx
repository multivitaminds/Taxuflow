"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, GripVertical } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CustomFieldDefinition {
  id: string
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  is_active: boolean
  help_text: string | null
}

interface CustomFieldsListProps {
  entityType: string
  fields: CustomFieldDefinition[]
  onUpdate: () => void
}

export function CustomFieldsList({ entityType, fields, onUpdate }: CustomFieldsListProps) {
  const supabase = createClient()

  async function toggleActive(fieldId: string, currentState: boolean) {
    await supabase.from("custom_field_definitions").update({ is_active: !currentState }).eq("id", fieldId)

    onUpdate()
  }

  async function deleteField(fieldId: string) {
    if (!confirm("Are you sure you want to delete this custom field?")) return

    await supabase.from("custom_field_definitions").delete().eq("id", fieldId)

    onUpdate()
  }

  function getFieldTypeLabel(type: string) {
    const labels: Record<string, string> = {
      text: "Text",
      number: "Number",
      date: "Date",
      boolean: "Yes/No",
      dropdown: "Dropdown",
      "multi-select": "Multi-Select",
    }
    return labels[type] || type
  }

  if (fields.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No custom fields defined yet</p>
        <p className="text-sm text-muted-foreground mt-1">Create your first custom field to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{field.field_label}</h4>
              {field.is_required && <Badge variant="destructive">Required</Badge>}
              <Badge variant="outline">{getFieldTypeLabel(field.field_type)}</Badge>
            </div>
            {field.help_text && <p className="text-sm text-muted-foreground">{field.help_text}</p>}
            <p className="text-xs text-muted-foreground mt-1">Field name: {field.field_name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={field.is_active} onCheckedChange={() => toggleActive(field.id, field.is_active)} />
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteField(field.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
