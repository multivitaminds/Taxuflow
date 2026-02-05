"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Upload, Download, Trash2, CheckCircle2, Clock } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { DocumentUpload } from "@/components/document-upload"

interface DocumentsDetailsClientProps {
  user: User
  profile: any
}

export function DocumentsDetailsClient({ user, profile }: DocumentsDetailsClientProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)

  console.log("[v0] DocumentsDetailsClient rendering", { user: !!user, profile: !!profile })

  const supabase = createClient()

  const fetchDocuments = async () => {
    setLoading(true)
    console.log("[v0] Fetching documents for user", user.id)
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    console.log("[v0] Documents fetched", { count: data?.length, error })
    if (data) {
      setDocuments(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [user.id])

  const handleDownloadDocument = async (documentId: string, fileName: string) => {
    try {
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", documentId)
        .single()

      if (docError || !doc) {
        alert("Failed to download document. Please try again.")
        return
      }

      const { data, error } = await supabase.storage.from("tax-documents").download(doc.file_path)

      if (error) {
        alert("Failed to download file. Please try again.")
        return
      }

      const url = URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)

    if (!confirmed) return

    try {
      const response = await fetch(`/api/delete-document?id=${documentId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        alert(`Failed to delete document: ${result.error}`)
        return
      }

      alert("Document deleted successfully")
      fetchDocuments()
    } catch (err) {
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const getDocumentStatus = (doc: any) => {
    if (doc.ai_document_type) {
      return { status: "processed", label: "Processed", icon: CheckCircle2, color: "text-green-500" }
    }
    return { status: "pending", label: "Processing", icon: Clock, color: "text-yellow-500" }
  }

  const documentsByType = {
    w2: documents.filter((d) => d.ai_document_type === "w2"),
    "1099": documents.filter((d) => d.ai_document_type === "1099"),
    "1040": documents.filter((d) => d.ai_document_type === "1040"),
    receipts: documents.filter((d) => d.ai_document_type === "receipt"),
    other: documents.filter((d) => !d.ai_document_type || d.ai_document_type === "other"),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Documents</h1>
            <p className="text-muted-foreground">Manage and organize all your tax documents</p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="bg-neon hover:bg-neon/90 text-background">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 hover:border-neon/40 transition-all"
            onClick={() => router.push("/dashboard/documents/all")}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-neon" />
              <span className="text-sm text-muted-foreground">Total Documents</span>
            </div>
            <p className="text-3xl font-bold">{documents.length}</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 hover:border-neon/40 transition-all"
            onClick={() => router.push("/dashboard/documents/processed")}
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Processed</span>
            </div>
            <p className="text-3xl font-bold">{documents.filter((d) => d.ai_document_type).length}</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 hover:border-neon/40 transition-all"
            onClick={() => router.push("/dashboard/documents/processing")}
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Processing</span>
            </div>
            <p className="text-3xl font-bold">{documents.filter((d) => !d.ai_document_type).length}</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 hover:border-neon/40 transition-all"
            onClick={() => router.push("/dashboard/documents/storage")}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Storage Used</span>
            </div>
            <p className="text-3xl font-bold">
              {(documents.reduce((acc, d) => acc + d.file_size, 0) / 1024 / 1024).toFixed(1)} MB
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {Object.entries(documentsByType).map(([type, docs]) => {
            if (docs.length === 0) return null

            return (
              <Card key={type} className="p-6 border-neon/20 bg-card/50 backdrop-blur">
                <h3 className="text-xl font-bold mb-4 capitalize">
                  {type === "1099" ? "1099 Forms" : type === "w2" ? "W-2 Forms" : type === "1040" ? "1040 Forms" : type}
                </h3>
                <div className="space-y-3">
                  {docs.map((doc) => {
                    const status = getDocumentStatus(doc)
                    const StatusIcon = status.icon

                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="w-6 h-6 text-neon" />
                          <div>
                            <p className="font-semibold">{doc.file_name}</p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <span className={`flex items-center gap-1 ${status.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {status.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDownloadDocument(doc.id, doc.file_name)}
                            variant="ghost"
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteDocument(doc.id, doc.file_name)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )
          })}
        </div>

        {documents.length === 0 && (
          <Card
            className="p-12 border-neon/20 bg-card/50 backdrop-blur text-center cursor-pointer hover:bg-card/70 hover:border-neon/40 transition-all group"
            onClick={() => setShowUploadModal(true)}
          >
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 group-hover:text-neon transition-colors" />
            <h3 className="text-xl font-bold mb-2">No documents uploaded yet</h3>
            <p className="text-muted-foreground mb-6">Upload your first tax document to get started</p>
            <Button className="bg-neon hover:bg-neon/90 text-background pointer-events-none">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </Card>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 border-neon/20 bg-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upload Tax Documents</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                ✕
              </Button>
            </div>

            <DocumentUpload
              onUploadComplete={() => {
                setShowUploadModal(false)
                fetchDocuments()
              }}
            />

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Supported formats: PDF, JPG, PNG, DOCX (max 10MB)</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
