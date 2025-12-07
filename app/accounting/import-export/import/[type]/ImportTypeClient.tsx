"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Info } from "lucide-react"
import Link from "next/link"

export default function ImportTypeClient({ type }: { type: string }) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [validationResults, setValidationResults] = useState<any>(null)

  const typeName = type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // Simulate validation results
          setValidationResults({
            totalRows: 156,
            validRows: 152,
            invalidRows: 4,
            errors: [
              { row: 23, field: "Email", message: "Invalid email format" },
              { row: 45, field: "Phone", message: "Phone number too short" },
              { row: 67, field: "Amount", message: "Amount must be positive" },
              { row: 89, field: "Date", message: "Invalid date format" },
            ],
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/accounting/import-export">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Import {typeName}</h1>
          <p className="text-muted-foreground">Upload your {typeName.toLowerCase()} data</p>
        </div>
      </div>

      {/* Steps */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Import Process</h2>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#635bff] text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="text-sm font-medium">Download Template</span>
            </div>
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#635bff] text-white flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium">Fill Data</span>
            </div>
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#635bff] text-white flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium">Upload File</span>
            </div>
            <div className="h-px bg-border flex-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <span className="text-sm text-muted-foreground">Review & Import</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Template Download */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Step 1: Download Template</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download the {typeName.toLowerCase()} import template and fill it with your data. Make sure to follow the
              format exactly.
            </p>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Excel Template
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Required Fields */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Info className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Required Fields</h3>
            <p className="text-sm text-muted-foreground mb-3">The following fields are required in your import file:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Name</Badge>
              <Badge variant="secondary">Email</Badge>
              <Badge variant="secondary">Phone</Badge>
              <Badge variant="secondary">Address</Badge>
              <Badge variant="secondary">City</Badge>
              <Badge variant="secondary">State</Badge>
              <Badge variant="secondary">ZIP Code</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* File Upload */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <Upload className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Step 2: Upload File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your completed CSV or Excel file. We'll validate the data and show you any errors.
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-[#635bff] transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">CSV or Excel files (max 10MB)</p>
              </label>
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Validation Results</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{validationResults.totalRows}</p>
                  <p className="text-xs text-muted-foreground">Total Rows</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{validationResults.validRows}</p>
                  <p className="text-xs text-muted-foreground">Valid Rows</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{validationResults.invalidRows}</p>
                  <p className="text-xs text-muted-foreground">Invalid Rows</p>
                </div>
              </div>
            </div>
          </div>

          {validationResults.errors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Errors Found</h4>
              <div className="space-y-2">
                {validationResults.errors.map((error: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">
                        Row {error.row}: {error.field}
                      </p>
                      <p className="text-xs text-red-700">{error.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button className="flex-1" disabled={validationResults.invalidRows > 0}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Import {validationResults.validRows} Records
            </Button>
            <Button variant="outline">Download Error Report</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
