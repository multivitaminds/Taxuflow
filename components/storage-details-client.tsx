"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, FileText, HardDrive, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface StorageDetailsClientProps {
  user: User
  profile: any
}

export function StorageDetailsClient({ user, profile }: StorageDetailsClientProps) {
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
      .order("file_size", { ascending: false })

    if (docs) setDocuments(docs)

    setLoading(false)
  }

  useEffect(() => {
    fetchDocuments()
  }, [user.id])

  const totalStorage = documents.reduce((acc, d) => acc + d.file_size, 0)
  const storageLimit = 100 * 1024 * 1024 // 100 MB limit
  const storagePercentage = (totalStorage / storageLimit) * 100

  const documentsByType = documents.reduce(
    (acc, doc) => {
      const type = doc.ai_document_type || "other"
      if (!acc[type]) {
        acc[type] = { count: 0, size: 0 }
      }
      acc[type].count++
      acc[type].size += doc.file_size
      return acc
    },
    {} as Record<string, { count: number; size: number }>,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading storage details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 py-6">
        <Button onClick={() => router.push("/dashboard/documents")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Storage Usage</h1>
          <p className="text-muted-foreground">Monitor and manage your document storage</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <HardDrive className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Storage Used</span>
            </div>
            <p className="text-3xl font-bold">{(totalStorage / 1024 / 1024).toFixed(1)} MB</p>
            <p className="text-xs text-muted-foreground mt-1">of 100 MB</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-neon" />
              <span className="text-sm text-muted-foreground">Total Documents</span>
            </div>
            <p className="text-3xl font-bold">{documents.length}</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Avg. File Size</span>
            </div>
            <p className="text-3xl font-bold">
              {documents.length > 0 ? (totalStorage / documents.length / 1024).toFixed(1) : "0"} KB
            </p>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-6">
          <h2 className="text-2xl font-bold mb-4">Storage Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Storage Usage</span>
                <span className="text-sm font-semibold">{storagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-background/50 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    storagePercentage > 90 ? "bg-red-500" : storagePercentage > 70 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(100, storagePercentage)}%` }}
                />
              </div>
            </div>

            {storagePercentage > 80 && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Storage Warning</p>
                    <p className="text-xs text-muted-foreground">
                      You're using {storagePercentage.toFixed(1)}% of your storage. Consider deleting old documents or
                      upgrading your plan.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {storagePercentage <= 80 && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm mb-1">Storage Healthy</p>
                    <p className="text-xs text-muted-foreground">
                      You have {((storageLimit - totalStorage) / 1024 / 1024).toFixed(1)} MB of storage remaining.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4">Storage by Document Type</h2>
            <div className="space-y-4">
              {Object.entries(documentsByType)
                .sort((a, b) => b[1].size - a[1].size)
                .map(([type, data]) => {
                  const percentage = (data.size / totalStorage) * 100

                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold capitalize">{type}</span>
                          <span className="text-sm text-muted-foreground ml-2">({data.count} files)</span>
                        </div>
                        <span className="text-sm font-semibold">{(data.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="w-full bg-background/50 rounded-full h-2">
                        <div className="bg-neon h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
            </div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4">Largest Documents</h2>
            <div className="space-y-3">
              {documents.slice(0, 10).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-neon" />
                    <div>
                      <p className="font-semibold text-sm">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{doc.ai_document_type || "Unknown"}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{(doc.file_size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
