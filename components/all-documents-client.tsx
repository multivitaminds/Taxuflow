"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Download, Trash2, CheckCircle2, Clock, Search } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AllDocumentsClientProps {
  user: User
  profile: any
}

export function AllDocumentsClient({ user, profile }: AllDocumentsClientProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  const supabase = createClient()

  const fetchDocuments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

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

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === "all" ||
      (filterType === "processed" && doc.ai_document_type) ||
      (filterType === "processing" && !doc.ai_document_type) ||
      (filterType === "w2" && doc.ai_document_type === "w2") ||
      (filterType === "1099" && doc.ai_document_type === "1099")

    return matchesSearch && matchesFilter
  })

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
        <Button onClick={() => router.push("/dashboard/documents")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Documents</h1>
          <p className="text-muted-foreground">Complete list of all your uploaded tax documents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-neon" />
              <span className="text-sm text-muted-foreground">Total Documents</span>
            </div>
            <p className="text-3xl font-bold">{documents.length}</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Processed</span>
            </div>
            <p className="text-3xl font-bold">{documents.filter((d) => d.ai_document_type).length}</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Processing</span>
            </div>
            <p className="text-3xl font-bold">{documents.filter((d) => !d.ai_document_type).length}</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Storage Used</span>
            </div>
            <p className="text-3xl font-bold">
              {(documents.reduce((acc, d) => acc + d.file_size, 0) / 1024 / 1024).toFixed(1)} MB
            </p>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-neon text-background" : ""}
              >
                All
              </Button>
              <Button
                variant={filterType === "processed" ? "default" : "outline"}
                onClick={() => setFilterType("processed")}
                className={filterType === "processed" ? "bg-neon text-background" : ""}
              >
                Processed
              </Button>
              <Button
                variant={filterType === "processing" ? "default" : "outline"}
                onClick={() => setFilterType("processing")}
                className={filterType === "processing" ? "bg-neon text-background" : ""}
              >
                Processing
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
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
                        {doc.ai_document_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{doc.ai_document_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleDownloadDocument(doc.id, doc.file_name)} variant="ghost" size="sm">
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

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
