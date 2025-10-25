"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Loader2, CheckCircle2, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface DocumentUploadProps {
  userId: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "complete" | "error"
  extractedData?: any
}

export function DocumentUpload({ userId }: DocumentUploadProps) {
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
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Process each file
    for (const file of fileList) {
      const fileId = newFiles.find((f) => f.name === file.name)?.id
      if (!fileId) continue

      try {
        // Upload file
        const formData = new FormData()
        formData.append("file", file)
        formData.append("userId", userId)

        const uploadResponse = await fetch("/api/filing/upload-document", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error("Upload failed")

        // Update status to processing
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)))

        // Extract data using AI
        const extractResponse = await fetch("/api/filing/extract-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId, userId }),
        })

        const extractData = await extractResponse.json()

        if (extractData.success) {
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
        } else {
          throw new Error("Extraction failed")
        }
      } catch (error) {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error" } : f)))
        toast({
          title: "Processing Failed",
          description: `Failed to process ${file.name}`,
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
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                  {file.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />}
                  {file.status === "complete" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {file.status === "error" && <X className="h-4 w-4 text-red-600" />}
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {files.some((f) => f.status === "complete") && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Submit Filing</Button>
        </div>
      )}
    </div>
  )
}
