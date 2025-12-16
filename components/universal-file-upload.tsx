"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, File, X, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FileUploadProps {
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
  category?: string
}

export function UniversalFileUpload({
  onUploadComplete,
  maxFiles = 10,
  acceptedFileTypes,
  category = "documents",
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, maxFiles))
    },
    [maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes ? Object.fromEntries(acceptedFileTypes.map((type) => [type, []])) : undefined,
    maxFiles,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    const urls: string[] = []

    try {
      for (const file of files) {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}&category=${category}`, {
          method: "POST",
          body: file,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        urls.push(data.url)
      }

      setUploadedUrls(urls)
      toast.success(`Successfully uploaded ${files.length} file(s)`)
      onUploadComplete?.(urls)
      setFiles([])
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast.error("Failed to upload files")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto text-slate-400 mb-3" />
        <p className="text-sm text-slate-600 mb-1">
          {isDragActive ? "Drop files here" : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-xs text-slate-400">Maximum {maxFiles} files</p>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">{files.length} file(s) ready to upload</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-slate-400" />
                <span className="text-xs">{file.name}</span>
                <span className="text-[10px] text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button onClick={uploadFiles} disabled={uploading} className="w-full h-8 text-xs">
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3 w-3 mr-2" />
                Upload {files.length} File(s)
              </>
            )}
          </Button>
        </div>
      )}

      {uploadedUrls.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-green-600 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Successfully uploaded {uploadedUrls.length} file(s)
          </p>
        </div>
      )}
    </div>
  )
}
