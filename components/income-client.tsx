"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Upload, FileText, Download, Trash2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { DocumentUpload } from "@/components/document-upload"

interface IncomeClientProps {
  user: User
  documents: any[]
}

export function IncomeClient({ user, documents: initialDocuments }: IncomeClientProps) {
  const router = useRouter()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [documents, setDocuments] = useState(initialDocuments)

  const handleUploadComplete = () => {
    setShowUploadModal(false)
    router.refresh()
  }

  const getDocumentIcon = (docType: string) => {
    if (docType === "w2") return <FileText className="w-5 h-5 text-green-500" />
    if (docType === "1099") return <FileText className="w-5 h-5 text-blue-500" />
    if (docType === "1040") return <FileText className="w-5 h-5 text-purple-500" />
    return <FileText className="w-5 h-5 text-neon" />
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Income Documents</h1>
            <p className="text-muted-foreground">Upload your W-2s, 1099s, and other income documents</p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="bg-neon hover:bg-neon/90 text-background">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {documents.length === 0 ? (
          <Card className="p-12 border-neon/20 bg-card/50 backdrop-blur text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No income documents yet</h2>
            <p className="text-muted-foreground mb-6">
              Upload your W-2, 1099, or other income documents to get started
            </p>
            <Button onClick={() => setShowUploadModal(true)} className="bg-neon hover:bg-neon/90 text-background">
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Document
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="p-6 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getDocumentIcon(doc.document_type)}
                    <div>
                      <h3 className="font-semibold">{doc.file_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.document_type.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString()} •{" "}
                        {(doc.file_size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 border-neon/20 bg-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upload Income Documents</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                ✕
              </Button>
            </div>
            <DocumentUpload onUploadComplete={handleUploadComplete} />
          </Card>
        </div>
      )}
    </div>
  )
}
