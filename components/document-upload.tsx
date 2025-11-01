"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UploadedFile {
  id: string
  file_name: string
  file_size: number
  file_type: string
  document_type: string
  created_at: string
}

interface FileUploadProgress {
  file: File
  status: "uploading" | "processing" | "complete" | "error"
  progress: string
  error?: string
  documentId?: string
}

export function DocumentUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadProgress[]>([])
  const [dragActive, setDragActive] = useState(false)

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

  const uploadFile = async (file: File, index: number) => {
    console.log("[v0] Starting file upload:", file.name)

    try {
      const validationError = validateFile(file)
      if (validationError) {
        console.error("[v0] Validation failed:", validationError)
        setUploadingFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, status: "error", error: validationError } : f)),
        )
        return
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("[v0] User error:", userError)
        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "error", error: "Please sign in to upload documents" } : f,
          ),
        )
        return
      }

      console.log("[v0] User authenticated:", user.id)

      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`

      console.log("[v0] Uploading to storage...")
      setUploadingFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, progress: "Uploading to secure storage..." } : f)),
      )

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("tax-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("[v0] Upload error:", uploadError)
        let errorMsg = `Upload failed: ${uploadError.message}`
        if (uploadError.message.includes("not found") || uploadError.message.includes("does not exist")) {
          errorMsg = "Storage bucket not set up. Please run the database setup scripts first."
        }
        setUploadingFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "error", error: errorMsg } : f)))
        return
      }

      console.log("[v0] File uploaded to storage successfully")

      const {
        data: { publicUrl },
      } = supabase.storage.from("tax-documents").getPublicUrl(filePath)

      const documentType = detectDocumentType(file.name)
      const currentYear = new Date().getFullYear()

      console.log("[v0] Saving document metadata...")
      setUploadingFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, progress: "Saving document information..." } : f)),
      )

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
        let errorMsg = `Failed to save document info: ${dbError.message}`
        if (dbError.message.includes("relation") && dbError.message.includes("does not exist")) {
          errorMsg = "Database table not set up. Please run the database setup scripts first."
        }
        setUploadingFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "error", error: errorMsg } : f)))
        return
      }

      console.log("[v0] Document saved successfully:", dbData.id)

      console.log("[v0] Starting AI document processing...")
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "processing", progress: "Sophie is analyzing with AI vision...", documentId: dbData.id }
            : f,
        ),
      )

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

        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  status: "complete",
                  progress: `All 5 AI agents analyzed your ${result.documentType?.toUpperCase() || "document"}!`,
                }
              : f,
          ),
        )

        // Remove completed file after 3 seconds
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((_, i) => i !== index))
          // If all files are done, refresh
          if (uploadingFiles.filter((f) => f.status !== "complete").length === 1) {
            console.log("[v0] All files processed, refreshing dashboard")
            if (onUploadComplete) {
              onUploadComplete()
            }
          }
        }, 3000)
      } catch (processingError) {
        console.error("[v0] Processing error:", processingError)
        setUploadingFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  status: "error",
                  error: "Document uploaded but AI processing failed",
                }
              : f,
          ),
        )
      }
    } catch (err) {
      console.error("[v0] Unexpected error:", err)
      setUploadingFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error",
                error: "An unexpected error occurred",
              }
            : f,
        ),
      )
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      console.log("[v0] Selected", files.length, "files for upload")
      const newFiles: FileUploadProgress[] = files.map((file) => ({
        file,
        status: "uploading",
        progress: "Starting upload...",
      }))

      setUploadingFiles((prev) => [...prev, ...newFiles])

      // Upload all files in parallel
      files.forEach((file, index) => {
        uploadFile(file, uploadingFiles.length + index)
      })
    }
    // Reset input
    e.target.value = ""
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

    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) {
      console.log("[v0] Dropped", files.length, "files")
      const newFiles: FileUploadProgress[] = files.map((file) => ({
        file,
        status: "uploading",
        progress: "Starting upload...",
      }))

      setUploadingFiles((prev) => [...prev, ...newFiles])

      // Upload all files in parallel
      files.forEach((file, index) => {
        uploadFile(file, uploadingFiles.length + index)
      })
    }
  }

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
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
          accept=".pdf,.jpg,.jpeg,.png,.docx"
          multiple
        />

        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
          <Upload className="h-12 w-12 text-muted-foreground" />

          <div className="space-y-1">
            <p className="text-sm font-medium">Drop your tax documents here</p>
            <p className="text-xs text-muted-foreground">or click to browse (PDF, JPG, PNG, DOCX - max 10MB each)</p>
            <p className="text-xs text-primary font-medium mt-2">You can upload multiple files at once</p>
          </div>
        </label>
      </div>

      {uploadingFiles.map((fileProgress, index) => (
        <Card
          key={index}
          className={`p-4 ${
            fileProgress.status === "complete"
              ? "bg-green-500/10 border-green-500"
              : fileProgress.status === "error"
                ? "bg-destructive/10 border-destructive"
                : "bg-primary/10 border-primary"
          }`}
        >
          <div className="flex items-start gap-2">
            {fileProgress.status === "complete" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            ) : fileProgress.status === "error" ? (
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 animate-spin" />
            )}
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  fileProgress.status === "complete"
                    ? "text-green-500"
                    : fileProgress.status === "error"
                      ? "text-destructive"
                      : "text-primary"
                }`}
              >
                {fileProgress.file.name}
              </p>
              <p
                className={`text-xs mt-1 ${
                  fileProgress.status === "complete"
                    ? "text-green-500/80"
                    : fileProgress.status === "error"
                      ? "text-destructive/80"
                      : "text-primary/80"
                }`}
              >
                {fileProgress.status === "error" ? fileProgress.error : fileProgress.progress}
              </p>
              {fileProgress.status === "processing" && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">• Sophie: Document analysis</p>
                  <p className="text-xs text-muted-foreground">• Leo: Tax calculations</p>
                  <p className="text-xs text-muted-foreground">• Riley: Deduction discovery</p>
                  <p className="text-xs text-muted-foreground">• Kai: Audit risk assessment</p>
                  <p className="text-xs text-muted-foreground">• Jordan: Tax strategy</p>
                </div>
              )}
            </div>
            {fileProgress.status === "error" && (
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0 flex-shrink-0">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
