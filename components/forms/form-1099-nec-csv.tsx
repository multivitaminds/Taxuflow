"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { DollarSign, TrendingUp } from "lucide-react"

interface CSVContractor {
  firstName: string
  lastName: string
  ssn: string
  ein: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  compensation: string
}

interface Form1099NECCSVProps {
  userId: string
}

export function Form1099NECCSV({ userId }: Form1099NECCSVProps) {
  const [contractors, setContractors] = useState<CSVContractor[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [importSource, setImportSource] = useState<"csv" | "stripe" | "quickbooks">("csv")
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,ssn,ein,email,address,city,state,zipCode,compensation
John,Doe,123-45-6789,,john@example.com,123 Main St,San Francisco,CA,94102,5000.00
Jane,Smith,,12-3456789,jane@example.com,456 Oak Ave,Los Angeles,CA,90001,7500.00`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "1099-nec-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const parseCSV = (text: string): CSVContractor[] => {
    const lines = text.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())

    const data: CSVContractor[] = []
    const parseErrors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const row: any = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })

      // Validate required fields
      if (!row.firstName || !row.lastName) {
        parseErrors.push(`Row ${i + 1}: First name and last name are required`)
        continue
      }

      if (!row.ssn && !row.ein) {
        parseErrors.push(`Row ${i + 1}: Either SSN or EIN is required`)
        continue
      }

      if (!row.address || !row.city || !row.state || !row.zipCode) {
        parseErrors.push(`Row ${i + 1}: Complete address is required`)
        continue
      }

      const compensation = Number.parseFloat(row.compensation)
      if (isNaN(compensation) || compensation < 600) {
        parseErrors.push(`Row ${i + 1}: Compensation must be at least $600`)
        continue
      }

      data.push({
        firstName: row.firstName,
        lastName: row.lastName,
        ssn: row.ssn,
        ein: row.ein,
        email: row.email,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zipCode,
        compensation: row.compensation,
      })
    }

    setErrors(parseErrors)
    return data
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const text = await file.text()
      const parsed = parseCSV(text)

      if (parsed.length === 0) {
        toast({
          title: "No Valid Data",
          description: "No valid contractor records found in CSV",
          variant: "destructive",
        })
      } else {
        setContractors(parsed)
        toast({
          title: "CSV Uploaded",
          description: `Successfully parsed ${parsed.length} contractor(s)`,
        })
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to parse CSV file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (contractors.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload a CSV file first",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/filing/submit-1099", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          taxYear: new Date().getFullYear() - 1,
          contractors: contractors.map((c) => ({
            firstName: c.firstName,
            lastName: c.lastName,
            ssn: c.ssn.replace(/\D/g, ""),
            ein: c.ein.replace(/\D/g, ""),
            email: c.email,
            address: {
              street: c.address,
              city: c.city,
              state: c.state,
              zipCode: c.zipCode,
            },
            compensation: Number.parseFloat(c.compensation),
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Bulk Filing Submitted",
          description: `Successfully filed ${contractors.length} 1099-NEC form(s)`,
        })
        router.push("/dashboard/filing")
      } else {
        throw new Error(data.error || "Failed to submit filing")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const importFromStripe = async () => {
    setIsImporting(true)
    try {
      const response = await fetch("/api/contractors/import/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear() - 1 }),
      })

      const data = await response.json()

      if (data.success) {
        setContractors(data.contractors)
        toast({
          title: "Stripe Import Complete",
          description: `Imported ${data.contractors.length} contractor(s) from Stripe`,
        })
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import from Stripe",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const importFromQuickBooks = async () => {
    setIsImporting(true)
    try {
      const response = await fetch("/api/contractors/import/quickbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear() - 1 }),
      })

      const data = await response.json()

      if (data.success) {
        setContractors(data.contractors)
        toast({
          title: "QuickBooks Import Complete",
          description: `Imported ${data.contractors.length} contractor(s) from QuickBooks`,
        })
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import from QuickBooks",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-stripe-purple/10 via-stripe-pink/10 to-stripe-orange/10 p-8 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-stripe-purple/5 via-transparent to-stripe-orange/5" />
        <div className="relative">
          <h2 className="bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange bg-clip-text text-3xl font-bold text-transparent">
            Bulk 1099-NEC Upload
          </h2>
          <p className="mt-2 text-muted-foreground">Upload a CSV file to file multiple 1099-NEC forms at once</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Fast bulk processing • Automatic validation • Instant submission</span>
          </div>
        </div>
      </div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Import Source</CardTitle>
          <CardDescription>Choose how you want to import contractor data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={importSource === "csv" ? "default" : "outline"}
              onClick={() => setImportSource("csv")}
              className="h-24 flex-col"
            >
              <FileSpreadsheet className="h-8 w-8 mb-2" />
              CSV File
            </Button>
            <Button
              variant={importSource === "stripe" ? "default" : "outline"}
              onClick={() => {
                setImportSource("stripe")
                importFromStripe()
              }}
              disabled={isImporting}
              className="h-24 flex-col"
            >
              <DollarSign className="h-8 w-8 mb-2" />
              Stripe
            </Button>
            <Button
              variant={importSource === "quickbooks" ? "default" : "outline"}
              onClick={() => {
                setImportSource("quickbooks")
                importFromQuickBooks()
              }}
              disabled={isImporting}
              className="h-24 flex-col"
            >
              <TrendingUp className="h-8 w-8 mb-2" />
              QuickBooks
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-stripe-purple" />
            Step 1: Download Template
          </CardTitle>
          <CardDescription>Download our CSV template to ensure your data is formatted correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={downloadTemplate} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium mb-2">Required Columns:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• firstName, lastName (required)</li>
              <li>• ssn OR ein (at least one required)</li>
              <li>• email (optional)</li>
              <li>• address, city, state, zipCode (required)</li>
              <li>• compensation (required, minimum $600)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-stripe-pink" />
            Step 2: Upload CSV File
          </CardTitle>
          <CardDescription>Upload your completed CSV file with contractor information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
              disabled={isUploading || importSource !== "csv"}
            />
            <label htmlFor="csv-upload">
              <Button
                type="button"
                disabled={isUploading || importSource !== "csv"}
                className="bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => document.getElementById("csv-upload")?.click()}
              >
                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? "Processing..." : "Choose CSV File"}
              </Button>
            </label>
            {contractors.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>{contractors.length} contractor(s) loaded</span>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-red-500 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span>Validation Errors ({errors.length})</span>
              </div>
              <ul className="text-sm text-red-400 space-y-1 max-h-40 overflow-y-auto">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {contractors.length > 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-stripe-orange" />
              Step 3: Review & Submit
            </CardTitle>
            <CardDescription>Review the contractors below and submit to the IRS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contractors.map((contractor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="font-medium">
                      {contractor.firstName} {contractor.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contractor.ssn || contractor.ein} • {contractor.city}, {contractor.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-500">
                      ${Number.parseFloat(contractor.compensation).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Compensation</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setContractors([])
                  setErrors([])
                }}
                className="border-white/10 bg-white/5 hover:bg-white/10"
              >
                Clear
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-stripe-purple via-stripe-pink to-stripe-orange hover:opacity-90 transition-opacity"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting to IRS..." : `Submit ${contractors.length} Form(s) to IRS`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
