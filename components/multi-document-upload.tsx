"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Loader2, CheckCircle2, X, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface MultiDocumentUploadProps {
  userId: string
  onUploadComplete?: () => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "complete" | "error"
  documentType?: string
  extractedData?: any
  errorMessage?: string
}

const DOCUMENT_TYPES = [
  { value: "w2", label: "W-2 (Wage Statement)" },
  { value: "w2c", label: "W-2c (Corrected)" },
  { value: "1099-nec", label: "1099-NEC" },
  { value: "1099-misc", label: "1099-MISC" },
  { value: "1098", label: "1098 (Mortgage Interest)" },
  { value: "medical-expenses", label: "Medical Expenses" },
  { value: "charitable-donations", label: "Charitable Donations" },
  { value: "business-receipts", label: "Business Receipts" },
  { value: "k1", label: "Schedule K-1" },
  { value: "income-statement", label: "Income Statement" },
]

export function MultiDocumentUpload({ userId, onUploadComplete }: MultiDocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = async (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setIsProcessing(true)

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const fileId = newFiles[i].id

      try {
        console.log("[v0] Processing document:", file.name)

        // Update status to processing
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString("base64")

        // Extract data using AI
        const extractResponse = await fetch("/api/filing/extract-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileData: base64,
            fileName: file.name,
            mimeType: file.type,
            userId,
          }),
        })

        const extractData = await extractResponse.json()

        if (extractData.success && extractData.data) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: "complete",
                    documentType: extractData.documentType,
                    extractedData: extractData.data,
                  }
                : f,
            ),
          )

          toast({
            title: "Document Processed",
            description: `Successfully extracted data from ${file.name}`,
          })
        } else {
          throw new Error(extractData.error || "Extraction failed")
        }
      } catch (error) {
        console.error("[v0] Processing error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to process document"

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "error",
                  errorMessage,
                }
              : f,
          ),
        )

        toast({
          title: "Processing Failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive",
        })
      }
    }

    setIsProcessing(false)

    // Notify parent component
    if (onUploadComplete) {
      onUploadComplete()
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getStatusDisplay = (file: UploadedFile) => {
    switch (file.status) {
      case "uploading":
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin text-blue-600" />,
          text: "Uploading...",
          color: "text-blue-600",
        }
      case "processing":
        return {
          icon: <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />,
          text: "AI Processing...",
          color: "text-yellow-600",
        }
      case "complete":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          text: "Complete",
          color: "text-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          text: file.errorMessage || "Failed",
          color: "text-red-600",
        }
    }
  }

  const completedCount = files.filter((f) => f.status === "complete").length
  const totalCount = files.length

  return (
    <div className="space-y-6">
      <Card className="border-neon/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Upload Tax Documents</CardTitle>
          <CardDescription>
            Upload W-2s, 1099s, mortgage statements, medical expenses, charitable donations, and other tax documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragging ? "border-neon bg-neon/5" : "border-muted-foreground/25"
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={isProcessing}
            />
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Drop files here or click to upload</h3>
            <p className="text-sm text-muted-foreground mb-4">Supports PDF, JPG, PNG (Max 10MB per file)</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {DOCUMENT_TYPES.map((type) => (
                <Badge key={type.value} variant="outline" className="text-xs">
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="border-neon/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Uploaded Documents ({completedCount}/{totalCount} processed)
              </CardTitle>
              {completedCount === totalCount && totalCount > 0 && (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  All Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((file) => {
              const statusDisplay = getStatusDisplay(file)
              return (
                <div key={file.id} className="flex items-center justify-between rounded-lg border p-4 bg-background/50">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-8 w-8 text-neon flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        {file.documentType && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {DOCUMENT_TYPES.find((t) => t.value === file.documentType)?.label || file.documentType}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {statusDisplay.icon}
                      <span className={`text-sm font-medium ${statusDisplay.color}`}>{statusDisplay.text}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} disabled={isProcessing}>
                      <X className="h-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {completedCount > 0 && (
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.push("/dashboard/documents/all")}>
            View All Documents
          </Button>
          <Button
            onClick={() => {
              toast({
                title: "Documents Saved",
                description: `${completedCount} document(s) have been processed and saved`,
              })
              if (onUploadComplete) {
                onUploadComplete()
              }
            }}
            className="bg-neon hover:bg-neon/90 text-background"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Done
          </Button>
        </div>
      )}
    </div>
  )
}
