"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Info, CheckCircle2, AlertCircle, XCircle, Upload, FileText, Shield, TrendingUp } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ConfidenceDetailsClientProps {
  user: User
  profile: any
}

export function ConfidenceDetailsClient({ user, profile }: ConfidenceDetailsClientProps) {
  const router = useRouter()
  const [taxCalc, setTaxCalc] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const [taxData, docsData] = await Promise.all([
        supabase
          .from("tax_calculations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from("documents").select("*").eq("user_id", user.id),
      ])

      if (taxData.data) setTaxCalc(taxData.data)
      if (docsData.data) setDocuments(docsData.data)
      setLoading(false)
    }

    fetchData()
  }, [user.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading confidence analysis...</p>
        </div>
      </div>
    )
  }

  const confidenceLevel = taxCalc?.confidence_percentage || 0
  const processedDocs = documents.filter((d) => d.processing_status === "completed").length
  const totalDocs = documents.length

  const requiredDocuments = [
    { name: "W-2 Forms", uploaded: documents.some((d) => d.document_type === "W-2"), importance: "Critical" },
    { name: "1099 Forms", uploaded: documents.some((d) => d.document_type === "1099"), importance: "High" },
    {
      name: "Mortgage Interest (1098)",
      uploaded: documents.some((d) => d.document_type === "1098"),
      importance: "Medium",
    },
    { name: "Student Loan Interest", uploaded: false, importance: "Medium" },
    { name: "Charitable Donations", uploaded: false, importance: "Low" },
    { name: "Medical Expenses", uploaded: false, importance: "Low" },
  ]

  const uploadedCount = requiredDocuments.filter((d) => d.uploaded).length
  const dataCompleteness = (uploadedCount / requiredDocuments.length) * 100

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard/refund")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Refund Details
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Confidence Level Analysis</h1>
          <p className="text-muted-foreground">Understanding the accuracy of your tax estimate</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold">Overall Confidence</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{confidenceLevel}%</p>
            <p className="text-sm text-muted-foreground">Based on uploaded documents and data quality</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold">Documents Processed</h3>
            </div>
            <p className="text-4xl font-bold mb-2">
              {processedDocs}/{totalDocs}
            </p>
            <p className="text-sm text-muted-foreground">AI analysis completed</p>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-purple-500" />
              <h3 className="font-semibold">Data Completeness</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{dataCompleteness.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">Required documents uploaded</p>
          </Card>
        </div>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold mb-6">Confidence Score Breakdown</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Document Upload</span>
                <span className="text-sm text-muted-foreground">{totalDocs > 0 ? "30%" : "0%"}</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${totalDocs > 0 ? "bg-green-500" : "bg-muted-foreground"}`}
                  style={{ width: totalDocs > 0 ? "30%" : "0%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">AI Analysis Complete</span>
                <span className="text-sm text-muted-foreground">
                  {processedDocs === totalDocs && totalDocs > 0 ? "25%" : "0%"}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${processedDocs === totalDocs && totalDocs > 0 ? "bg-green-500" : "bg-muted-foreground"}`}
                  style={{ width: processedDocs === totalDocs && totalDocs > 0 ? "25%" : "0%" }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Data Completeness</span>
                <span className="text-sm text-muted-foreground">{(dataCompleteness * 0.25).toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${dataCompleteness * 0.25}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Data Verification</span>
                <span className="text-sm text-muted-foreground">
                  {taxCalc && taxCalc.total_income > 0 ? "20%" : "0%"}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${taxCalc && taxCalc.total_income > 0 ? "bg-green-500" : "bg-muted-foreground"}`}
                  style={{ width: taxCalc && taxCalc.total_income > 0 ? "20%" : "0%" }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur mb-8">
          <h2 className="text-2xl font-bold mb-6">Required Documents Checklist</h2>
          <div className="space-y-4">
            {requiredDocuments.map((doc, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  doc.uploaded ? "bg-green-500/10 border border-green-500/20" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {doc.uploaded ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-semibold">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">Importance: {doc.importance}</p>
                  </div>
                </div>
                {!doc.uploaded && (
                  <Button size="sm" variant="outline" onClick={() => router.push("/dashboard")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            How to Improve Your Confidence Score
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Upload All Income Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Make sure to upload all W-2s, 1099s, and other income statements to ensure accurate calculations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Include Deduction Documentation</h4>
                <p className="text-sm text-muted-foreground">
                  Upload receipts and forms for deductions like mortgage interest, charitable donations, and medical
                  expenses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Wait for AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Allow our AI agents to complete their analysis of your documents for the most accurate estimate
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Review and Verify Data</h4>
                <p className="text-sm text-muted-foreground">
                  Check that all extracted information is correct and complete any missing fields
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
