"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle } from "lucide-react"
import { FileParser, type ParseResult } from "@/lib/file-parser"
import { ETLPipeline, type ETLResult } from "@/lib/etl/etl-pipeline"
import { UploadProgressTracker } from "@/lib/upload-progress-tracker"
import { UploadProgressDisplay } from "@/components/upload-progress-display"
import { DataPreviewTable } from "@/components/data-preview-table"
import { ColumnMappingDialog } from "@/components/column-mapping-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BulkUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function BulkUploadDialog({ open, onOpenChange, onComplete }: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "processing">("upload")
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [etlResult, setETLResult] = useState<ETLResult | null>(null)
  const [columnMapping, setColumnMapping] = useState<Record<string, string> | null>(null)
  const [showMappingDialog, setShowMappingDialog] = useState(false)
  const [progressTracker, setProgressTracker] = useState<UploadProgressTracker | null>(null)
  const [uploadProgress, setUploadProgress] = useState<any>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (selectedFile: File) => {
    const fileType = selectedFile.name.split(".").pop()?.toLowerCase()

    if (!["csv", "xlsx", "xls", "pdf"].includes(fileType || "")) {
      alert("Please upload a CSV, Excel, or PDF file")
      return
    }

    setFile(selectedFile)
    setStep("mapping")

    try {
      let result: ParseResult

      if (fileType === "csv") {
        result = await FileParser.parseCSV(selectedFile)
      } else if (fileType === "xlsx" || fileType === "xls") {
        result = await FileParser.parseExcel(selectedFile)
      } else {
        result = await FileParser.parsePDF(selectedFile)
      }

      setParseResult(result)

      // Auto-detect columns and show mapping dialog
      if (result.data.length > 0) {
        const sourceColumns = Object.keys(result.data[0])
        setShowMappingDialog(true)
      }
    } catch (error) {
      console.error("Error parsing file:", error)
      alert("Failed to parse file. Please check the format and try again.")
    }
  }

  const handleMappingConfirm = async (mapping: Record<string, string>) => {
    setColumnMapping(mapping)
    setShowMappingDialog(false)
    setStep("preview")

    // Run ETL pipeline
    if (parseResult) {
      const result = await ETLPipeline.process(parseResult.data, [])
      setETLResult(result)
    }
  }

  const handleUpload = async () => {
    if (!etlResult || etlResult.unique.length === 0) return

    setStep("processing")
    const tracker = new UploadProgressTracker(etlResult.unique.length)
    setProgressTracker(tracker)

    tracker.subscribe((progress) => {
      setUploadProgress(progress)
    })

    try {
      // Stage 1: Parsing (already done)
      tracker.startStage(0, "File parsed successfully")
      tracker.completeStage(0)

      // Stage 2: Cleaning
      tracker.startStage(1, "Cleaning customer data...")
      await new Promise((resolve) => setTimeout(resolve, 500))
      tracker.completeStage(1, `Cleaned ${etlResult.cleaned.length} records`)

      // Stage 3: Validation
      tracker.startStage(2, "Validating records...")
      await new Promise((resolve) => setTimeout(resolve, 500))
      tracker.completeStage(2, `${etlResult.valid.length} valid records`)

      // Stage 4: Deduplication
      tracker.startStage(3, "Checking for duplicates...")
      await new Promise((resolve) => setTimeout(resolve, 500))
      tracker.completeStage(3, `${etlResult.duplicates.length} duplicates found`)

      // Stage 5: Upload
      tracker.startStage(4, "Uploading to database...")

      const batchSize = 50
      const batches = []

      for (let i = 0; i < etlResult.unique.length; i += batchSize) {
        batches.push(etlResult.unique.slice(i, i + batchSize))
      }

      let successCount = 0
      let failCount = 0

      for (let i = 0; i < batches.length; i++) {
        const response = await fetch("/api/accounting/customers/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customers: batches[i] }),
        })

        if (response.ok) {
          successCount += batches[i].length
        } else {
          failCount += batches[i].length
        }

        const progress = ((i + 1) / batches.length) * 100
        tracker.updateStageProgress(4, progress, `Uploaded ${successCount} of ${etlResult.unique.length} records`)
        tracker.updateRecordProgress(successCount + failCount, successCount, failCount)
      }

      tracker.completeStage(4, `Successfully uploaded ${successCount} customers`)

      setTimeout(() => {
        onComplete()
        onOpenChange(false)
        resetState()
      }, 2000)
    } catch (error) {
      console.error("Error uploading customers:", error)
      if (progressTracker) {
        progressTracker.errorStage(4, "Failed to upload customers")
      }
    }
  }

  const resetState = () => {
    setFile(null)
    setParseResult(null)
    setETLResult(null)
    setColumnMapping(null)
    setStep("upload")
    setProgressTracker(null)
    setUploadProgress(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Upload Customers</DialogTitle>
            <DialogDescription>
              Upload CSV, Excel, or PDF files with customer data. We'll automatically parse, clean, and validate the
              data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Step */}
            {step === "upload" && (
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive ? "border-accent bg-accent/5" : "border-border"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls,.pdf"
                  onChange={handleFileInput}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">Supported formats: CSV, Excel (.xlsx, .xls), PDF</p>
              </div>
            )}

            {/* Preview Step */}
            {step === "preview" && etlResult && (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({etlResult.stats.totalInput})</TabsTrigger>
                  <TabsTrigger value="valid">Valid ({etlResult.stats.valid})</TabsTrigger>
                  <TabsTrigger value="errors">Errors ({etlResult.stats.invalid})</TabsTrigger>
                  <TabsTrigger value="duplicates">Duplicates ({etlResult.stats.duplicates})</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <DataPreviewTable
                    data={etlResult.cleaned}
                    errors={etlResult.invalid}
                    warnings={etlResult.warnings}
                    duplicates={etlResult.duplicates}
                  />
                </TabsContent>
                <TabsContent value="valid" className="mt-4">
                  <DataPreviewTable data={etlResult.valid} />
                </TabsContent>
                <TabsContent value="errors" className="mt-4">
                  <DataPreviewTable data={etlResult.invalid.map((i) => i.customer)} errors={etlResult.invalid} />
                </TabsContent>
                <TabsContent value="duplicates" className="mt-4">
                  <DataPreviewTable
                    data={etlResult.duplicates.map((d) => d.duplicate)}
                    duplicates={etlResult.duplicates}
                  />
                </TabsContent>
              </Tabs>
            )}

            {/* Processing Step */}
            {step === "processing" && uploadProgress && <UploadProgressDisplay progress={uploadProgress} />}

            {/* Actions */}
            {step === "preview" && etlResult && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={resetState}>
                  Start Over
                </Button>
                <Button onClick={handleUpload} disabled={etlResult.unique.length === 0} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Upload {etlResult.unique.length} Customer{etlResult.unique.length !== 1 ? "s" : ""}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Column Mapping Dialog */}
      {parseResult && (
        <ColumnMappingDialog
          open={showMappingDialog}
          onOpenChange={setShowMappingDialog}
          sourceColumns={parseResult.data.length > 0 ? Object.keys(parseResult.data[0]) : []}
          onConfirm={handleMappingConfirm}
        />
      )}
    </>
  )
}
