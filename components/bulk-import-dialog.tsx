"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react"
import { parseCSV } from "@/lib/file-parser"

interface ImportResult {
  success: number
  failed: number
  errors: Array<{ row: number; error: string }>
}

interface BulkImportDialogProps {
  onSuccess: () => void
}

export function BulkImportDialog({ onSuccess }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please upload a CSV file",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      setImportResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    try {
      const parsedData = await parseCSV(file)

      const response = await fetch("/api/recipients/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: parsedData }),
      })

      const result = await response.json()

      if (response.ok) {
        setImportResult(result)
        toast({
          title: "Import Complete",
          description: `Successfully imported ${result.success} recipients`,
        })
        if (result.success > 0) {
          onSuccess()
        }
      } else {
        toast({
          title: "Import Failed",
          description: result.error || "Failed to import recipients",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `first_name,last_name,business_name,email,phone,ssn,ein,tin_type,street_address,city,state,zip_code
John,Doe,Doe Consulting,john@example.com,555-0100,123-45-6789,,SSN,123 Main St,New York,NY,10001
Jane,Smith,Smith LLC,jane@example.com,555-0200,,12-3456789,EIN,456 Oak Ave,Los Angeles,CA,90001`

    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "recipients-template.csv"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-500" />
          Bulk Import Recipients
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-medium">CSV Format Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Required columns: first_name, last_name, street_address, city, state, zip_code</li>
                <li>TIN: Provide either SSN or EIN (not both)</li>
                <li>tin_type: Must be either "SSN" or "EIN"</li>
                <li>Optional: business_name, email, phone</li>
              </ul>
              <Button variant="link" onClick={downloadTemplate} className="h-auto p-0 text-blue-500">
                <Download className="w-4 h-4 mr-1" />
                Download CSV Template
              </Button>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
            disabled={isUploading}
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              {file ? (
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Click to upload CSV file</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </div>
              )}
            </div>
          </label>
        </div>

        {file && (
          <Button onClick={handleUpload} disabled={isUploading} className="w-full bg-purple-500 hover:bg-purple-600">
            {isUploading ? "Importing..." : "Import Recipients"}
          </Button>
        )}

        {importResult && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{importResult.success}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold">{importResult.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-h-48 overflow-y-auto">
                <p className="font-medium mb-2 text-red-500">Errors:</p>
                <ul className="space-y-1 text-sm">
                  {importResult.errors.map((error, index) => (
                    <li key={index} className="text-muted-foreground">
                      Row {error.row}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
