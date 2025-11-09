"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Loader2, CheckCircle2, X, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface DocumentUploadProps {
  userId?: string
  onExtractComplete?: (data: any, metadata: any) => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "complete" | "error"
  extractedData?: any
  errorMessage?: string
}

export function DocumentUpload({ userId, onExtractComplete }: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFiles = async (fileList: File[]) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please wait for authentication to complete, then try uploading again.",
        variant: "destructive",
      })
      return
    }

    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const fileId = newFiles[i].id

      try {
        console.log("[v0] Starting AI extraction for:", file.name)

        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > 10) {
          throw new Error("File too large. Maximum size is 10MB. Please compress the document.")
        }

        // Update status to processing
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))

        // Convert file to base64 for AI processing
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString("base64")

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

        try {
          // Extract data using AI directly from file
          const extractResponse = await fetch("/api/filing/extract-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: base64,
              fileName: file.name,
              mimeType: file.type,
              userId,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          const extractData = await extractResponse.json()

          console.log("[v0] Extraction response:", JSON.stringify(extractData).substring(0, 200))

          if (extractData.success && extractData.data) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? {
                      ...f,
                      status: "complete",
                      extractedData: extractData.data,
                    }
                  : f,
              ),
            )

            if (extractData.warning === "demo_mode") {
              toast({
                title: "⚠️ Demo Mode Active",
                description: "AI service unavailable. Demo data provided - please verify all information.",
                variant: "default",
              })
            } else if (extractData.warning === "template_data_detected") {
              toast({
                title: "📋 Sample Document Detected",
                description: `Extracted from ${file.name}. Please verify this is not a demo document.`,
              })
            } else {
              toast({
                title: "✅ Document Processed",
                description: `Successfully extracted data from ${file.name}`,
              })
            }

            // Notify parent component with metadata
            if (onExtractComplete) {
              onExtractComplete(extractData.data, {
                warning: extractData.warning,
                message: extractData.message,
              })
            }
          } else {
            throw new Error(extractData.error || "Extraction failed")
          }
        } catch (fetchError) {
          clearTimeout(timeoutId)
          if (fetchError instanceof Error && fetchError.name === "AbortError") {
            throw new Error(
              "Request timed out. The document may be too large or complex. Please try with a smaller/clearer document.",
            )
          }
          throw fetchError
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
          title: "❌ Processing Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSubmit = async () => {
    const completedFiles = files.filter((f) => f.status === "complete")

    if (completedFiles.length === 0) {
      toast({
        title: "No Documents Ready",
        description: "Please wait for documents to finish processing",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/filing/submit-extracted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          documents: completedFiles.map((f) => f.extractedData),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Filing Submitted",
          description: "Your tax documents have been filed successfully",
        })
        router.push("/dashboard/filing")
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit tax filing",
        variant: "destructive",
      })
    }
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
          text: "AI Extracting Data...",
          color: "text-yellow-600",
        }
      case "complete":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          text: "✓ Extracted Successfully",
          color: "text-green-600",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          text: file.errorMessage || "Processing Failed",
          color: "text-red-600",
        }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Tax Documents</CardTitle>
          <CardDescription>Upload W-2s, 1099s, receipts, and other tax documents for AI extraction</CardDescription>
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
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Drop files here or click to upload</h3>
            <p className="text-sm text-muted-foreground">Supports PDF, JPG, PNG (Max 10MB per file)</p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((file) => {
              const statusDisplay = getStatusDisplay(file)
              return (
                <div key={file.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {statusDisplay.icon}
                      <span className={`text-sm font-medium ${statusDisplay.color}`}>{statusDisplay.text}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {files.some((f) => f.status === "complete") && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setFiles([])}>
            Clear All
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-orange-600">
            Submit Filing
          </Button>
        </div>
      )}
    </div>
  )
}
