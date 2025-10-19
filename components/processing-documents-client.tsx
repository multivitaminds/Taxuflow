"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, Clock, Brain, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ProcessingDocumentsClientProps {
  user: User
  profile: any
}

export function ProcessingDocumentsClient({ user, profile }: ProcessingDocumentsClientProps) {
  const router = useRouter()
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchDocuments = async () => {
    setLoading(true)

    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .is("ai_document_type", null)
      .order("created_at", { ascending: false })

    if (docs) setDocuments(docs)

    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()

    // Auto-refresh every 5 seconds to show processing updates
    const interval = setInterval(fetchDocuments, 5000)

    return () => clearInterval(interval)
  }, [user.id])

  const aiAgents = [
    {
      name: "Sophie",
      role: "Filing Assistant",
      color: "text-blue-500",
      status: "Analyzing document structure...",
      progress: 20,
    },
    {
      name: "Leo",
      role: "Refund Analyst",
      color: "text-orange-500",
      status: "Extracting income data...",
      progress: 40,
    },
    {
      name: "Riley",
      role: "Business Planner",
      color: "text-green-500",
      status: "Identifying deductions...",
      progress: 60,
    },
    {
      name: "Kai",
      role: "Audit Advisor",
      color: "text-red-500",
      status: "Checking compliance...",
      progress: 80,
    },
    {
      name: "Jordan",
      role: "Tax Coach",
      color: "text-purple-500",
      status: "Generating strategies...",
      progress: 95,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading processing documents...</p>
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
          <h1 className="text-4xl font-bold mb-2">Processing Documents</h1>
          <p className="text-muted-foreground">Documents currently being analyzed by your AI team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Processing</span>
            </div>
            <p className="text-3xl font-bold">{documents.length}</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">AI Agents Active</span>
            </div>
            <p className="text-3xl font-bold">5</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-sm text-muted-foreground">Avg. Processing Time</span>
            </div>
            <p className="text-3xl font-bold">2-3 min</p>
          </Card>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                Documents in Queue
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-lg bg-background/50">
                    <div className="flex items-center gap-4 mb-3">
                      <FileText className="w-6 h-6 text-neon" />
                      <div className="flex-1">
                        <p className="font-semibold">{doc.file_name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div
                        className="bg-neon h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (Date.now() - new Date(doc.created_at).getTime()) / 1800)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-500" />
                AI Processing Pipeline
              </h2>
              <div className="space-y-4">
                {aiAgents.map((agent, index) => (
                  <div key={agent.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${agent.color.replace("text-", "bg-")} animate-pulse`} />
                        <div>
                          <p className="font-semibold">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{agent.progress}%</span>
                    </div>
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${agent.color.replace("text-", "bg-")}`}
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.status}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-neon/10 border border-neon/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-neon mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Processing in Progress</p>
                    <p className="text-xs text-muted-foreground">
                      Your AI team is working together to analyze your documents. This typically takes 2-3 minutes per
                      document. You'll be notified when processing is complete.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-12 border-neon/20 bg-card/50 backdrop-blur text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">All documents processed!</h3>
            <p className="text-muted-foreground mb-6">There are no documents currently being processed</p>
            <Button
              onClick={() => router.push("/dashboard/documents")}
              className="bg-neon hover:bg-neon/90 text-background"
            >
              View All Documents
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
