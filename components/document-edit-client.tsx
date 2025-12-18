"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { updateDocumentData } from "@/app/actions/update-document-data"

interface Document {
  id: string
  file_name: string
  document_type: string
  ai_document_type: string
  extracted_data: any
}

interface DocumentEditClientProps {
  document: Document
}

export function DocumentEditClient({ document }: DocumentEditClientProps) {
  const router = useRouter()
  const [extractedData, setExtractedData] = useState(document.extracted_data || {})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    const result = await updateDocumentData(document.id, extractedData)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/documents")
      }, 1500)
    } else {
      setError(result.error || "Failed to save changes")
    }

    setSaving(false)
  }

  const updateField = (field: string, value: any) => {
    setExtractedData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const renderFields = () => {
    const docType = document.ai_document_type || document.document_type

    if (docType === "w2") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_name">Employee Name</Label>
              <Input
                id="employee_name"
                value={extractedData.employee_name || ""}
                onChange={(e) => updateField("employee_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="spouse_name">Spouse Name (if joint)</Label>
              <Input
                id="spouse_name"
                value={extractedData.spouse_name || ""}
                onChange={(e) => updateField("spouse_name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employer_name">Employer Name</Label>
              <Input
                id="employer_name"
                value={extractedData.employer_name || ""}
                onChange={(e) => updateField("employer_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tax_year">Tax Year</Label>
              <Input
                id="tax_year"
                type="number"
                value={extractedData.tax_year || ""}
                onChange={(e) => updateField("tax_year", Number.parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wages">Wages (Box 1)</Label>
              <Input
                id="wages"
                type="number"
                step="0.01"
                value={extractedData.wages || ""}
                onChange={(e) => updateField("wages", Number.parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="federal_tax_withheld">Federal Tax Withheld (Box 2)</Label>
              <Input
                id="federal_tax_withheld"
                type="number"
                step="0.01"
                value={extractedData.federal_tax_withheld || ""}
                onChange={(e) => updateField("federal_tax_withheld", Number.parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="social_security_wages">Social Security Wages (Box 3)</Label>
              <Input
                id="social_security_wages"
                type="number"
                step="0.01"
                value={extractedData.social_security_wages || ""}
                onChange={(e) => updateField("social_security_wages", Number.parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="medicare_wages">Medicare Wages (Box 5)</Label>
              <Input
                id="medicare_wages"
                type="number"
                step="0.01"
                value={extractedData.medicare_wages || ""}
                onChange={(e) => updateField("medicare_wages", Number.parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="filing_status">Filing Status</Label>
            <select
              id="filing_status"
              value={extractedData.filing_status || "single"}
              onChange={(e) => updateField("filing_status", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="single">Single</option>
              <option value="married_joint">Married Filing Jointly</option>
              <option value="married_separate">Married Filing Separately</option>
              <option value="head_of_household">Head of Household</option>
            </select>
          </div>
        </>
      )
    }

    if (docType === "1099") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipient_name">Recipient Name</Label>
              <Input
                id="recipient_name"
                value={extractedData.recipient_name || ""}
                onChange={(e) => updateField("recipient_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payer_name">Payer Name</Label>
              <Input
                id="payer_name"
                value={extractedData.payer_name || ""}
                onChange={(e) => updateField("payer_name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="income">Income Amount</Label>
              <Input
                id="income"
                type="number"
                step="0.01"
                value={extractedData.income || ""}
                onChange={(e) => updateField("income", Number.parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="tax_year">Tax Year</Label>
              <Input
                id="tax_year"
                type="number"
                value={extractedData.tax_year || ""}
                onChange={(e) => updateField("tax_year", Number.parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="form_type">Form Type</Label>
            <select
              id="form_type"
              value={extractedData.form_type || "1099-NEC"}
              onChange={(e) => updateField("form_type", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="1099-NEC">1099-NEC</option>
              <option value="1099-MISC">1099-MISC</option>
              <option value="1099-INT">1099-INT</option>
              <option value="1099-DIV">1099-DIV</option>
            </select>
          </div>
        </>
      )
    }

    // Generic fields for other document types
    return (
      <div>
        <Label>Extracted Data (JSON)</Label>
        <textarea
          value={JSON.stringify(extractedData, null, 2)}
          onChange={(e) => {
            try {
              setExtractedData(JSON.parse(e.target.value))
            } catch (err) {
              // Invalid JSON, ignore
            }
          }}
          className="w-full h-64 p-3 rounded-md border border-input bg-background font-mono text-sm"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Edit Document Data</h1>
          <p className="text-muted-foreground">Review and correct the AI-extracted data from {document.file_name}</p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-500/10 border-red-500/20">
            <p className="text-sm text-red-500">{error}</p>
          </Card>
        )}

        {success && (
          <Card className="p-4 mb-6 bg-green-500/10 border-green-500/20">
            <p className="text-sm text-green-500">Changes saved successfully! Redirecting...</p>
          </Card>
        )}

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
          <div className="space-y-6">{renderFields()}</div>

          <div className="flex gap-4 mt-8">
            <Button variant="outline" onClick={() => router.back()} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 bg-neon hover:bg-neon/90 text-background">
              {saving ? (
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
          </div>
        </Card>
      </div>
    </div>
  )
}
