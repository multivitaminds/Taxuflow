"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Users, FileText, Package, DollarSign } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CustomFieldDefinitionForm } from "./custom-field-definition-form"
import { CustomFieldsList } from "./custom-fields-list"

interface CustomFieldDefinition {
  id: string
  entity_type: string
  field_name: string
  field_label: string
  field_type: string
  is_required: boolean
  is_active: boolean
}

const ENTITY_TYPES = [
  { value: "customer", label: "Customers", icon: Users },
  { value: "invoice", label: "Invoices", icon: FileText },
  { value: "product", label: "Products", icon: Package },
  { value: "project", label: "Projects", icon: Settings },
  { value: "expense", label: "Expenses", icon: DollarSign },
]

export function CustomFieldsManager() {
  const [fields, setFields] = useState<CustomFieldDefinition[]>([])
  const [selectedEntityType, setSelectedEntityType] = useState("customer")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadFields()
  }, [selectedEntityType])

  async function loadFields() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("custom_field_definitions")
      .select("*")
      .eq("user_id", user.id)
      .eq("entity_type", selectedEntityType)
      .order("display_order")

    if (data) setFields(data)
    setLoading(false)
  }

  const entityType = ENTITY_TYPES.find((t) => t.value === selectedEntityType)
  const Icon = entityType?.icon || Settings

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Fields</h1>
          <p className="text-muted-foreground">Add custom data fields to any entity type</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Custom Field
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {ENTITY_TYPES.map((type) => {
          const TypeIcon = type.icon
          const count = fields.filter((f) => f.entity_type === type.value).length

          return (
            <Card key={type.value} className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TypeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{type.label}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Entity Type Tabs */}
      <Tabs value={selectedEntityType} onValueChange={setSelectedEntityType}>
        <TabsList>
          {ENTITY_TYPES.map((type) => {
            const TypeIcon = type.icon
            return (
              <TabsTrigger key={type.value} value={type.value}>
                <TypeIcon className="h-4 w-4 mr-2" />
                {type.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {ENTITY_TYPES.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">{type.label} Custom Fields</h3>
                    <p className="text-sm text-muted-foreground">Manage custom fields for {type.label.toLowerCase()}</p>
                  </div>
                </div>
                <Badge variant="secondary">{fields.length} fields</Badge>
              </div>

              <CustomFieldsList entityType={type.value} fields={fields} onUpdate={loadFields} />
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Custom Field Form */}
      {showForm && (
        <CustomFieldDefinitionForm
          entityType={selectedEntityType}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            loadFields()
          }}
        />
      )}
    </div>
  )
}
