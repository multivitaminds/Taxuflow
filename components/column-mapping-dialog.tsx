"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"

interface ColumnMappingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceColumns: string[]
  onConfirm: (mapping: Record<string, string>) => void
}

const targetFields = [
  { value: "contact_name", label: "Contact Name", required: true },
  { value: "company_name", label: "Company Name", required: false },
  { value: "email", label: "Email", required: false },
  { value: "phone", label: "Phone", required: false },
  { value: "address_line1", label: "Address Line 1", required: false },
  { value: "address_line2", label: "Address Line 2", required: false },
  { value: "city", label: "City", required: false },
  { value: "state", label: "State", required: false },
  { value: "zip_code", label: "Zip Code", required: false },
  { value: "country", label: "Country", required: false },
  { value: "tax_id", label: "Tax ID", required: false },
  { value: "notes", label: "Notes", required: false },
]

export function ColumnMappingDialog({ open, onOpenChange, sourceColumns, onConfirm }: ColumnMappingDialogProps) {
  const [mapping, setMapping] = useState<Record<string, string>>({})

  const handleMappingChange = (targetField: string, sourceColumn: string) => {
    setMapping((prev) => ({
      ...prev,
      [targetField]: sourceColumn,
    }))
  }

  const handleConfirm = () => {
    onConfirm(mapping)
    onOpenChange(false)
  }

  const isValid = targetFields.filter((f) => f.required).every((f) => mapping[f.value] && mapping[f.value] !== "skip")

  const getMappedCount = () => {
    return Object.values(mapping).filter((v) => v && v !== "skip").length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Map Columns</DialogTitle>
          <DialogDescription>
            Map your file columns to the customer fields. Required fields are marked with an asterisk.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress */}
          <Card className="p-4 border-border bg-accent/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Mapping Progress</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {getMappedCount()} of {targetFields.length} fields mapped
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-foreground">
                  {Math.round((getMappedCount() / targetFields.length) * 100)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Mapping Grid */}
          <div className="space-y-3">
            {targetFields.map((field) => (
              <div key={field.value} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-foreground">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {field.required ? "Required field" : "Optional field"}
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground" />

                <div className="flex-1">
                  <Select
                    value={mapping[field.value] || ""}
                    onValueChange={(value) => handleMappingChange(field.value, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Skip this field</SelectItem>
                      {sourceColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!isValid}>
              Confirm Mapping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
