"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Edit, Download, Trash2 } from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  file_name: string
  document_type: string
  ai_document_type: string
  extracted_data: any
  created_at: string
}

interface DocumentsClientProps {
  documents: Document[]
}

export function DocumentsClient({ documents }: DocumentsClientProps) {
  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-8">Your Documents</h1>

        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6 border-neon/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6 text-neon" />
                  <div>
                    <h3 className="font-semibold">{doc.file_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.ai_document_type || doc.document_type} • {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/documents/${doc.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 bg-transparent">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
