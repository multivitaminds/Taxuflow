"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Upload, FileText, CheckCircle2, Loader2, X, FileCheck, FileWarning } from "lucide-react"

interface UploadedDocument {
  id: string
  file: File
  status: "pending" | "uploading" | "extracting" | "completed" | "error"
  progress: number
  extractedData?: any
  error?: string
}

export function DocumentUpload() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const acceptedFileTypes = ".pdf,.jpg,.jpeg,.png,.heic"

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const newDocuments: UploadedDocument[] = Array.from(files).map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        status: "pending",
        progress: 0,
      }))

      setDocuments((prev) => [...prev, ...newDocuments])

      toast({
        title: "Documents Added",
        description: `${files.length} document(s) ready to upload`,
      })
    },
    [toast],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }, [])

  const processDocument = async (doc: UploadedDocument) => {
    try {
      // Update status to uploading
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "uploading", progress: 30 } : d)))

      // Create form data
      const formData = new FormData()
      formData.append("file", doc.file)
      formData.append("documentId", doc.id)

      // Upload document
      const uploadResponse = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      const uploadData = await uploadResponse.json()

      // Update status to extracting
      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "extracting", progress: 60 } : d)))

      // Extract document data (OCR + AI)
      const extractResponse = await fetch("/api/documents/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          fileUrl: uploadData.fileUrl,
          fileName: doc.file.name,
        }),
      })

      if (!extractResponse.ok) {
        throw new Error("Extraction failed")
      }

      const extractData = await extractResponse.json()

      // Mark as completed
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, status: "completed", progress: 100, extractedData: extractData } : d,
        ),
      )

      return { success: true, data: extractData }
    } catch (error) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? { ...d, status: "error", error: error instanceof Error ? error.message : "Unknown error" }
            : d,
        ),
      )
      return { success: false, error }
    }
  }

  const processAllDocuments = async () => {
    const pendingDocs = documents.filter((doc) => doc.status === "pending")

    if (pendingDocs.length === 0) {
      toast({
        title: "No Documents",
        description: "Please add documents to upload",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Process all documents in parallel
      const results = await Promise.allSettled(pendingDocs.map((doc) => processDocument(doc)))

      const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length
      const failed = results.length - successful

      if (failed === 0) {
        toast({
          title: "All Documents Processed",
          description: `Successfully processed ${successful} document(s)`,
        })
      } else {
        toast({
          title: "Processing Complete",
          description: `${successful} succeeded, ${failed} failed`,
          variant: failed > successful ? "destructive" : "default",
        })
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "An error occurred while processing documents",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingCount = documents.filter((d) => d.status === "pending").length
  const completedCount = documents.filter((d) => d.status === "completed").length
  const errorCount = documents.filter((d) => d.status === "error").length
  const processingCount = documents.filter((d) => d.status === "uploading" || d.status === "extracting").length

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card
        className={`p-8 border-2 border-dashed transition-all ${
          isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-background/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="text-center">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-accent" : "text-muted-foreground"}`} />
          <h3 className="text-lg font-semibold mb-2">Upload Tax Documents</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop multiple files or click to browse</p>
          <p className="text-xs text-muted-foreground mb-4">
            Supports PDF, JPG, PNG, HEIC • W-2, 1099, 1098, receipts, and more
          </p>
          <input
            type="file"
            id="file-upload"
            multiple
            accept={acceptedFileTypes}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            aria-label="Upload tax documents"
          />
          <Button asChild variant="outline" className="border-accent/20 bg-transparent">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Browse Files
            </label>
          </Button>
        </div>
      </Card>

      {/* Summary Stats */}
      {documents.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-accent/20">
            <div className="text-2xl font-bold">{documents.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4 border-green-500/20">
            <div className="text-2xl font-bold text-green-500">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4 border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-500">{processingCount}</div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </Card>
          <Card className="p-4 border-red-500/20">
            <div className="text-2xl font-bold text-red-500">{errorCount}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </Card>
        </div>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <Card className="p-6 border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Documents ({documents.length})</h3>
            <div className="flex gap-2">
              {pendingCount > 0 && (
                <Button
                  onClick={processAllDocuments}
                  disabled={isProcessing}
                  className="bg-accent hover:bg-accent/90 text-background"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 mr-2" />
                      Process All ({pendingCount})
                    </>
                  )}
                </Button>
              )}
              {documents.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setDocuments([])}
                  disabled={isProcessing}
                  className="border-accent/20"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border"
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {doc.status === "pending" && <FileText className="w-5 h-5 text-muted-foreground" />}
                  {(doc.status === "uploading" || doc.status === "extracting") && (
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  )}
                  {doc.status === "completed" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {doc.status === "error" && <FileWarning className="w-5 h-5 text-red-500" />}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{doc.file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(doc.file.size / 1024).toFixed(1)} KB
                    {doc.status === "uploading" && " • Uploading..."}
                    {doc.status === "extracting" && " • Extracting data..."}
                    {doc.status === "completed" && " • Completed"}
                    {doc.status === "error" && ` • Error: ${doc.error}`}
                  </div>

                  {/* Progress Bar */}
                  {(doc.status === "uploading" || doc.status === "extracting") && (
                    <Progress value={doc.progress} className="h-1 mt-2" />
                  )}

                  {/* Extracted Data Preview */}
                  {doc.status === "completed" && doc.extractedData?.extractedData && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {doc.extractedData.extractedData.formType && `Form: ${doc.extractedData.extractedData.formType}`}
                      {doc.extractedData.extractedData.taxYear && ` • Year: ${doc.extractedData.extractedData.taxYear}`}
                      {doc.extractedData.extractedData.amount &&
                        ` • Amount: $${doc.extractedData.extractedData.amount}`}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(doc.id)}
                  disabled={doc.status === "uploading" || doc.status === "extracting"}
                  className="flex-shrink-0"
                  aria-label={`Remove ${doc.file.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Help Text */}
      {documents.length === 0 && (
        <Card className="p-6 border-accent/20 bg-background/50">
          <h4 className="font-semibold mb-2">Supported Documents</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• W-2 (Wage and Tax Statement)</li>
            <li>• 1099 Forms (Income, Interest, Dividends)</li>
            <li>• 1098 Forms (Mortgage Interest, Education)</li>
            <li>• Receipts and expense documentation</li>
            <li>• Previous year tax returns</li>
            <li>• Any other tax-related documents</li>
          </ul>
        </Card>
      )}
    </div>
  )
}
