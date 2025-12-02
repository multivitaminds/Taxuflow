"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  Brain,
  TrendingUp,
  Shield,
  Lightbulb,
  Calculator,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ProcessedDocumentsClientProps {
  user: User
  profile: any
}

export function ProcessedDocumentsClient({ user, profile }: ProcessedDocumentsClientProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)

    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .not("ai_document_type", "is", null)
      .order("created_at", { ascending: false })

    const { data: acts } = await supabase
      .from("agent_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (docs) setDocuments(docs)
    if (acts) setActivities(acts)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
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
      fetchData()
    } catch (err) {
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const getAgentIcon = (agentName: string) => {
    switch (agentName.toLowerCase()) {
      case "sophie":
        return Brain
      case "leo":
        return Calculator
      case "riley":
        return TrendingUp
      case "kai":
        return Shield
      case "jordan":
        return Lightbulb
      default:
        return Brain
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading processed documents...</p>
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
          <h1 className="text-4xl font-bold mb-2">Processed Documents</h1>
          <p className="text-muted-foreground">Documents that have been analyzed by your AI team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/dashboard/documents/all")}
          >
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Processed Documents</span>
            </div>
            <p className="text-3xl font-bold">{documents.length}</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/dashboard")}
          >
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">AI Analyses</span>
            </div>
            <p className="text-3xl font-bold">{activities.length}</p>
          </Card>

          <Card
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:scale-105 transition-transform"
            onClick={() => router.push("/dashboard/documents/storage")}
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Size</span>
            </div>
            <p className="text-3xl font-bold">
              {(documents.reduce((acc, d) => acc + (d.file_size || 0), 0) / 1024 / 1024).toFixed(1)} MB
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Processed Documents
            </h2>
            <div className="space-y-3">
              {documents.map((doc) => (
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
                        <span className="capitalize">{doc.ai_document_type}</span>
                        <span>•</span>
                        <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
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
              ))}

              {documents.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No processed documents yet</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-500" />
              AI Processing Activity
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {activities.map((activity) => {
                const AgentIcon = getAgentIcon(activity.agent_name)

                return (
                  <div key={activity.id} className="p-4 rounded-lg bg-background/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-neon/10">
                        <AgentIcon className="w-5 h-5 text-neon" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{activity.agent_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.activity_description}</p>
                        {activity.metadata && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <pre className="bg-background/50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {activities.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No AI activity yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
