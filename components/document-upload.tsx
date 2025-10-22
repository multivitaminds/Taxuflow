"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UploadedFile {
  id: string
  file_name: string
  file_size: number
  file_type: string
  document_type: string
  created_at: string
}

export function DocumentUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailedError, setDetailedError] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState<string>("")
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return "File size must be less than 10MB"
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, PNG, and DOCX files are allowed"
    }

    return null
  }

  const detectDocumentType = (fileName: string): string => {
    const lower = fileName.toLowerCase()
    if (lower.includes("w-2") || lower.includes("w2")) return "w2"
    if (lower.includes("1099")) return "1099"
    if (lower.includes("receipt")) return "receipt"
    return "other"
  }

  const uploadFile = async (file: File) => {
    console.log("[v0] Starting file upload:", file.name)
    setUploading(true)
    setError(null)
    setDetailedError(null)
    setSuccess(false)

    try {
      const validationError = validateFile(file)
      if (validationError) {
        console.error("[v0] Validation failed:", validationError)
        setError(validationError)
        setUploading(false)
        return
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("[v0] User error:", userError)
        setError("Please sign in to upload documents")
        setDetailedError(userError?.message || "No user found")
        setUploading(false)
        return
      }

      console.log("[v0] User authenticated:", user.id)

      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`

      console.log("[v0] Uploading to storage...")

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("tax-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("[v0] Upload error:", uploadError)
        if (uploadError.message.includes("not found") || uploadError.message.includes("does not exist")) {
          setError("Storage bucket not set up. Please run the database setup scripts first.")
          setDetailedError("Run scripts/004_setup_storage_bucket.sql to create the storage bucket")
        } else {
          setError(`Upload failed: ${uploadError.message}`)
          setDetailedError(JSON.stringify(uploadError, null, 2))
        }
        setUploading(false)
        return
      }

      console.log("[v0] File uploaded to storage successfully")

      const {
        data: { publicUrl },
      } = supabase.storage.from("tax-documents").getPublicUrl(filePath)

      const documentType = detectDocumentType(file.name)
      const currentYear = new Date().getFullYear()

      console.log("[v0] Saving document metadata...")
      const { data: dbData, error: dbError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          document_type: documentType,
          tax_year: currentYear,
        })
        .select()
        .single()

      if (dbError) {
        console.error("[v0] Database error:", dbError)
        if (dbError.message.includes("relation") && dbError.message.includes("does not exist")) {
          setError("Database table not set up. Please run the database setup scripts first.")
          setDetailedError("Run scripts/003_create_documents_table.sql to create the documents table")
        } else {
          setError(`Failed to save document info: ${dbError.message}`)
          setDetailedError(JSON.stringify(dbError, null, 2))
        }
        setUploading(false)
        return
      }

      console.log("[v0] Document saved successfully:", dbData.id)
      setUploading(false)

      console.log("[v0] Starting AI document processing...")
      setProcessing(true)
      setProcessingStatus("Sophie is analyzing your document with AI vision...")

      try {
        const response = await fetch("/api/process-document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ documentId: dbData.id }),
        })

        console.log("[v0] Process document response status:", response.status)

        if (!response.ok) {
          const errorData = await response.json()
          console.error("[v0] Processing API error:", errorData)
          throw new Error(errorData.error || "Processing failed")
        }

        const result = await response.json()
        console.log("[v0] Document processing complete:", result)

        setProcessingStatus(`✓ All 5 AI agents have analyzed your ${result.documentType?.toUpperCase() || "document"}!`)
        setSuccess(true)

        setTimeout(() => {
          setProcessing(false)
          setProcessingStatus("")
          setSuccess(false)
          console.log("[v0] Calling onUploadComplete to refresh dashboard")
          if (onUploadComplete) {
            onUploadComplete()
          }
        }, 3000)
      } catch (processingError) {
        console.error("[v0] Processing error:", processingError)
        setProcessing(false)
        setProcessingStatus("")
        setError("Document uploaded but AI processing failed")
        setDetailedError(processingError instanceof Error ? processingError.message : String(processingError))

        setTimeout(() => {
          if (onUploadComplete) {
            onUploadComplete()
          }
        }, 1000)
      }
    } catch (err) {
      console.error("[v0] Unexpected error:", err)
      setError("An unexpected error occurred")
      setDetailedError(err instanceof Error ? err.message : String(err))
      setUploading(false)
      setProcessing(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

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

    const file = e.dataTransfer.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const isWorking = uploading || processing

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        } ${isWorking ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
          disabled={isWorking}
          accept=".pdf,.jpg,.jpeg,.png,.docx"
        />

        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
          {isWorking ? (
            <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {uploading ? "Uploading..." : processing ? "Processing..." : "Drop your tax documents here"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isWorking ? processingStatus : "or click to browse (PDF, JPG, PNG, DOCX - max 10MB)"}
            </p>
          </div>
        </label>
      </div>

      {processing && (
        <Card className={`p-4 ${success ? "bg-green-500/10 border-green-500" : "bg-primary/10 border-primary"}`}>
          <div className="flex items-start gap-2">
            {success ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 animate-spin" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${success ? "text-green-500" : "text-primary"}`}>
                {success ? "Processing Complete!" : "AI Processing"}
              </p>
              <p className={`text-xs mt-1 ${success ? "text-green-500/80" : "text-primary/80"}`}>{processingStatus}</p>
              {!success && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">• Sophie: Document analysis</p>
                  <p className="text-xs text-muted-foreground">• Leo: Tax calculations</p>
                  <p className="text-xs text-muted-foreground">• Riley: Deduction discovery</p>
                  <p className="text-xs text-muted-foreground">• Kai: Audit risk assessment</p>
                  <p className="text-xs text-muted-foreground">• Jordan: Tax strategy</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Upload Error</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
              {detailedError && (
                <details className="mt-2">
                  <summary className="text-xs text-destructive/60 cursor-pointer hover:text-destructive/80">
                    Technical details
                  </summary>
                  <pre className="text-xs text-destructive/60 mt-1 overflow-auto max-h-32 bg-destructive/5 p-2 rounded">
                    {detailedError}
                  </pre>
                </details>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-6 w-6 p-0 flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
