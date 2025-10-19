"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

interface CustomFieldDefinition {
  id: string
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  help_text: string | null
  placeholder: string | null
  field_options: any
}

interface CustomFieldRendererProps {
  entityType: string
  entityId: string
  onChange?: (fieldId: string, value: any) => void
}

export function CustomFieldRenderer({ entityType, entityId, onChange }: CustomFieldRendererProps) {
  const [fields, setFields] = useState<CustomFieldDefinition[]>([])
  const [values, setValues] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadFieldsAndValues()
  }, [entityType, entityId])

  async function loadFieldsAndValues() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Load field definitions
    const { data: fieldDefs } = await supabase
      .from("custom_field_definitions")
      .select("*")
      .eq("user_id", user.id)
      .eq("entity_type", entityType)
      .eq("is_active", true)
      .order("display_order")

    if (fieldDefs) {
      setFields(fieldDefs)

      // Load existing values
      const { data: fieldValues } = await supabase
        .from("custom_field_values")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)

      if (fieldValues) {
        const valuesMap: Record<string, any> = {}
        for (const fv of fieldValues) {
          valuesMap[fv.field_definition_id] =
            fv.text_value || fv.number_value || fv.date_value || fv.boolean_value || fv.json_value
        }
        setValues(valuesMap)
      }
    }

    setLoading(false)
  }

  async function handleValueChange(fieldId: string, value: any, fieldType: string) {
    setValues({ ...values, [fieldId]: value })

    if (onChange) {
      onChange(fieldId, value)
    }

    // Save to database
    const valueColumn =
      fieldType === "number"
        ? "number_value"
        : fieldType === "date"
          ? "date_value"
          : fieldType === "boolean"
            ? "boolean_value"
            : fieldType === "multi-select"
              ? "json_value"
              : "text_value"

    await supabase
      .from("custom_field_values")
      .upsert({
        field_definition_id: fieldId,
        entity_type: entityType,
        entity_id: entityId,
        [valueColumn]: value,
      })
      .eq("field_definition_id", fieldId)
      .eq("entity_id", entityId)
  }

  if (loading) {
    return <div>Loading custom fields...</div>
  }

  if (fields.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Custom Fields</h3>
      {fields.map((field) => (
        <div key={field.id}>
          <Label htmlFor={field.field_name}>
            {field.field_label}
            {field.is_required && <span className="text-destructive ml-1">*</span>}
          </Label>
          {field.help_text && <p className="text-sm text-muted-foreground mb-2">{field.help_text}</p>}

          {field.field_type === "text" && (
            <Input
              id={field.field_name}
              value={values[field.id] || ""}
              onChange={(e) => handleValueChange(field.id, e.target.value, field.field_type)}
              placeholder={field.placeholder || ""}
              required={field.is_required}
            />
          )}

          {field.field_type === "number" && (
            <Input
              id={field.field_name}
              type="number"
              value={values[field.id] || ""}
              onChange={(e) => handleValueChange(field.id, Number.parseFloat(e.target.value), field.field_type)}
              placeholder={field.placeholder || ""}
              required={field.is_required}
            />
          )}

          {field.field_type === "date" && (
            <Input
              id={field.field_name}
              type="date"
              value={values[field.id] || ""}
              onChange={(e) => handleValueChange(field.id, e.target.value, field.field_type)}
              required={field.is_required}
            />
          )}

          {field.field_type === "boolean" && (
            <Switch
              id={field.field_name}
              checked={values[field.id] || false}
              onCheckedChange={(checked) => handleValueChange(field.id, checked, field.field_type)}
            />
          )}

          {field.field_type === "dropdown" && (
            <Select
              value={values[field.id] || ""}
              onValueChange={(value) => handleValueChange(field.id, value, field.field_type)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {field.field_options?.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {field.field_type === "multi-select" && (
            <div className="space-y-2">
              {field.field_options?.options?.map((option: string) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    id={`${field.field_name}-${option}`}
                    checked={(values[field.id] || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = values[field.id] || []
                      const newValues = checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option)
                      handleValueChange(field.id, newValues, field.field_type)
                    }}
                  />
                  <Label htmlFor={`${field.field_name}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
