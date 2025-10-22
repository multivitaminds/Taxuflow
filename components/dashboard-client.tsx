"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  FileText,
  TrendingUp,
  Shield,
  Calendar,
  Upload,
  MessageSquare,
  Settings,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  Receipt,
  Users,
  Building2,
  BarChart3,
  Wallet,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { DocumentUpload } from "@/components/document-upload"
import { agents } from "@/data/agents"

interface DashboardClientProps {
  user: User
  profile: {
    full_name: string | null
    preferred_agent: string
    subscription_tier: string
  } | null
}

interface Document {
  id: string
  file_name: string
  file_size: number
  file_type: string
  document_type: string
  created_at: string
  ai_document_type: string | null
  ai_description: string | null
  extracted_data: any
}

interface TaxCalculation {
  estimated_refund: number
  confidence_percentage: number
  audit_risk_score: string
}

interface AgentActivity {
  id: string
  agent_name: string
  title: string
  created_at: string
}

interface Deduction {
  id: string
  name: string
  amount: number
  status: string
}

export function DashboardClient({ user, profile }: DashboardClientProps) {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState(profile?.preferred_agent || "Sam")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const userName = isDemoMode ? "Demo User" : profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there"

  const [documents, setDocuments] = useState<Document[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [documentError, setDocumentError] = useState<string | null>(null)

  const [taxCalc, setTaxCalc] = useState<TaxCalculation | null>(null)
  const [activities, setActivities] = useState<AgentActivity[]>([])
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0)
  const [deadlineDate, setDeadlineDate] = useState("")

  useEffect(() => {
    const calculateDeadline = () => {
      const now = new Date()
      const currentYear = now.getFullYear()

      // Tax deadline is April 15 of the following year
      // If we're past April 15, the deadline is for next year
      let deadlineYear = currentYear + 1
      if (now.getMonth() < 3 || (now.getMonth() === 3 && now.getDate() <= 15)) {
        deadlineYear = currentYear
      }

      const deadline = new Date(deadlineYear, 3, 15) // April 15

      // If April 15 falls on a weekend, move to next Monday
      const dayOfWeek = deadline.getDay()
      if (dayOfWeek === 0) {
        // Sunday
        deadline.setDate(deadline.getDate() + 1)
      } else if (dayOfWeek === 6) {
        // Saturday
        deadline.setDate(deadline.getDate() + 2)
      }

      // Calculate days remaining
      const timeDiff = deadline.getTime() - now.getTime()
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

      setDaysUntilDeadline(days)
      setDeadlineDate(deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }))
    }

    calculateDeadline()
    // Update daily
    const interval = setInterval(calculateDeadline, 1000 * 60 * 60 * 24)
    return () => clearInterval(interval)
  }, [])

  const supabase = createClient()

  // Check if Supabase is properly configured
  if (!supabase) {
    console.error("[v0] Supabase client is not configured")
  }

  const fetchDashboardData = async () => {
    if (isDemoMode) {
      console.log("[v0] Loading demo data")
      setDocuments([
        {
          id: "demo-1",
          file_name: "2024_W2_Form.pdf",
          file_size: 245000,
          file_type: "application/pdf",
          document_type: "w2",
          created_at: new Date().toISOString(),
          ai_document_type: "w2",
          ai_description: "John Doe - 2024 W-2",
          extracted_data: {
            employee_name: "John Doe",
            tax_year: 2024,
            wages: 75000,
            federal_tax: 12500,
          },
        },
        {
          id: "demo-2",
          file_name: "Business_Expenses_2024.pdf",
          file_size: 180000,
          file_type: "application/pdf",
          document_type: "receipt",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          ai_document_type: "receipt",
          ai_description: "Office Supplies Receipt",
          extracted_data: { amount: 450, category: "office_supplies" },
        },
        {
          id: "demo-3",
          file_name: "1099_Freelance_Income.pdf",
          file_size: 156000,
          file_type: "application/pdf",
          document_type: "1099",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          ai_document_type: "1099",
          ai_description: "Freelance Income - 2024 1099-NEC",
          extracted_data: { recipient_name: "John Doe", tax_year: 2024, income: 25000 },
        },
      ])

      setTaxCalc({
        estimated_refund: 3250,
        confidence_percentage: 92,
        audit_risk_score: "Low",
      })

      setActivities([
        {
          id: "activity-1",
          agent_name: "Sam",
          title: "Analyzed your W-2 and found 3 potential deductions",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "activity-2",
          agent_name: "Dexter",
          title: "Identified $450 in business expense deductions",
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: "activity-3",
          agent_name: "Riley",
          title: "Calculated your estimated tax refund: $3,250",
          created_at: new Date(Date.now() - 10800000).toISOString(),
        },
      ])

      setDeductions([
        { id: "ded-1", name: "Home Office Deduction", amount: 1200, status: "suggested" },
        { id: "ded-2", name: "Business Mileage", amount: 850, status: "suggested" },
        { id: "ded-3", name: "Professional Development", amount: 600, status: "suggested" },
      ])

      setLoadingData(false)
      setLoadingDocuments(false)
      return
    }

    if (!supabase) {
      console.error("[v0] Cannot fetch data: Supabase client is not configured")
      setDocumentError("Database connection error. Please check your configuration.")
      setLoadingData(false)
      setLoadingDocuments(false)
      return
    }

    console.log("[v0] Fetching dashboard data for user:", user.id)
    setLoadingData(true)

    try {
      const { data: docsData, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (docsError) {
        console.error("[v0] Error fetching documents:", docsError)
        setDocumentError(docsError.message)
      } else {
        console.log("[v0] Documents fetched:", docsData?.length || 0)
        setDocuments(docsData || [])
      }

      const { data: taxData, error: taxError } = await supabase
        .from("tax_calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (taxError) {
        console.log("[v0] Error fetching tax calculations:", taxError.message)
      } else if (taxData) {
        console.log("[v0] Tax calculation fetched:", taxData)
        setTaxCalc(taxData)
      } else {
        console.log("[v0] No tax calculations yet")
      }

      const { data: activitiesData, error: activitiesError } = await supabase
        .from("agent_activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (activitiesError) {
        console.log("[v0] No activities yet:", activitiesError.message)
      } else {
        console.log("[v0] Activities fetched:", activitiesData?.length || 0)
        setActivities(activitiesData || [])
      }

      const { data: deductionsData, error: deductionsError } = await supabase
        .from("deductions_credits")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "suggested")

      if (deductionsError) {
        console.log("[v0] No deductions yet:", deductionsError.message)
      } else {
        console.log("[v0] Deductions fetched:", deductionsData?.length || 0)
        setDeductions(deductionsData || [])
      }
    } catch (err) {
      console.error("[v0] Unexpected error fetching dashboard data:", err)
    }

    setLoadingData(false)
    setLoadingDocuments(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user.id])

  useEffect(() => {
    const demoMode = localStorage.getItem("demo_mode") === "true"
    setIsDemoMode(demoMode)
    if (demoMode) {
      console.log("[v0] Demo mode detected, loading sample data")
    }
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      console.log("[v0] Auto-refresh enabled, will refresh every 3 seconds")
      const interval = setInterval(() => {
        console.log("[v0] Auto-refreshing dashboard data...")
        fetchDashboardData()
      }, 3000)

      return () => {
        console.log("[v0] Auto-refresh disabled")
        clearInterval(interval)
      }
    }
  }, [autoRefresh, user.id])

  const handleStatCardClick = (type: string) => {
    console.log(`[v0] Navigating to ${type} details`)
    router.push(`/dashboard/${type}`)
  }

  const handlePersonalInfo = () => {
    console.log("[v0] Navigating to personal information")
    router.push("/dashboard/personal-info")
  }

  const handleIncomeDocuments = () => {
    console.log("[v0] Navigating to income documents")
    router.push("/dashboard/income")
  }

  const handleChatWithAgent = (agentName: string) => {
    console.log(`[v0] Opening chat with ${agentName}`)
    router.push(`/chat?agent=${agentName.toLowerCase()}`)
  }

  const handleReviewDeductions = () => {
    console.log("[v0] Navigating to review page")
    router.push("/review")
  }

  const handleUploadDocument = () => {
    console.log("[v0] Opening upload modal")
    setShowUploadModal(true)
    setAutoRefresh(true)
  }

  const handleDownloadDocument = async (documentId: string, fileName: string) => {
    if (!supabase) {
      alert("Database connection error. Please refresh the page.")
      return
    }

    console.log(`[v0] Downloading document: ${fileName}`)

    try {
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("file_path")
        .eq("id", documentId)
        .single()

      if (docError || !doc) {
        console.error("[v0] Error fetching document:", docError)
        alert("Failed to download document. Please try again.")
        return
      }

      const { data, error } = await supabase.storage.from("tax-documents").download(doc.file_path)

      if (error) {
        console.error("[v0] Error downloading file:", error)
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
      console.error("[v0] Unexpected error downloading document:", err)
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const handleActivityClick = (activityId: string) => {
    console.log(`[v0] Viewing activity: ${activityId}`)
    router.push(`/dashboard/activity/${activityId}`)
  }

  const handleScheduleReview = () => {
    console.log("[v0] Navigating to schedule review")
    router.push("/dashboard/schedule")
  }

  const handleManageSubscription = () => {
    console.log("[v0] Navigating to subscription management")
    router.push("/pricing")
  }

  const handleAccountSettings = () => {
    console.log("[v0] Navigating to account settings")
    router.push("/dashboard/settings")
  }

  const handleUpgrade = () => {
    console.log("[v0] Navigating to upgrade page")
    router.push("/pricing?upgrade=true")
  }

  const handleAccountingDashboard = () => {
    console.log("[v0] Navigating to accounting dashboard")
    router.push("/accounting")
  }

  const handleUploadComplete = () => {
    console.log("[v0] Document upload complete, refreshing dashboard data")
    setAutoRefresh(false)
    fetchDashboardData()
    setShowUploadModal(false)
  }

  const handleDeleteDocument = async (documentId: string, fileName: string) => {
    if (!supabase) {
      alert("Database connection error. Please refresh the page.")
      return
    }

    console.log(`[v0] Attempting to delete document: ${fileName}`)

    const confirmed = window.confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)

    if (!confirmed) {
      console.log("[v0] Document deletion cancelled by user")
      return
    }

    try {
      const response = await fetch(`/api/delete-document?id=${documentId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("[v0] Error deleting document:", result.error)
        alert(`Failed to delete document: ${result.error}`)
        return
      }

      console.log("[v0] Document deleted successfully, refreshing dashboard")
      alert("Document deleted successfully")
      fetchDashboardData()
    } catch (err) {
      console.error("[v0] Unexpected error deleting document:", err)
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const completionPercentage = () => {
    let completed = 0
    if (profile?.full_name) completed += 25
    if (documents.length > 0) completed += 25
    if (taxCalc) completed += 25
    if (deductions.length > 0) completed += 25
    return completed
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  const getDocumentDisplayName = (doc: Document) => {
    if (doc.ai_document_type === "w2" && doc.extracted_data) {
      const employeeName = doc.extracted_data.employee_name
      const spouseName = doc.extracted_data.spouse_name
      const filingStatus = doc.extracted_data.filing_status
      const taxYear = doc.extracted_data.tax_year || new Date(doc.created_at).getFullYear()

      if (employeeName && spouseName && filingStatus === "married_joint") {
        return `${employeeName} & ${spouseName} - ${taxYear} W-2 (Joint)`
      }
      if (employeeName) {
        return `${employeeName} - ${taxYear} W-2`
      }
      return `${taxYear} W-2 Form`
    }

    if (doc.ai_document_type === "1099" && doc.extracted_data) {
      const recipientName = doc.extracted_data.recipient_name
      const spouseName = doc.extracted_data.spouse_name
      const filingStatus = doc.extracted_data.filing_status
      const taxYear = doc.extracted_data.tax_year || new Date(doc.created_at).getFullYear()
      const formType = doc.extracted_data.form_type || "1099"

      if (recipientName && spouseName && filingStatus === "married_joint") {
        return `${recipientName} & ${spouseName} - ${taxYear} ${formType} (Joint)`
      }
      if (recipientName) {
        return `${recipientName} - ${taxYear} ${formType}`
      }
      return `${taxYear} ${formType} Form`
    }

    if (doc.ai_document_type === "1040" && doc.extracted_data) {
      const taxpayerName = doc.extracted_data.taxpayer_name
      const spouseName = doc.extracted_data.spouse_name
      const filingStatus = doc.extracted_data.filing_status
      const taxYear = doc.extracted_data.tax_year || new Date(doc.created_at).getFullYear()

      if (taxpayerName && spouseName && filingStatus === "married_joint") {
        return `${taxpayerName} & ${spouseName} - ${taxYear} Form 1040 (Joint)`
      }
      if (taxpayerName) {
        return `${taxpayerName} - ${taxYear} Form 1040`
      }
      return `${taxYear} Form 1040`
    }

    if (doc.ai_description) {
      return doc.ai_description
    }

    return doc.file_name
  }

  const getDocumentIcon = (doc: Document) => {
    const docType = doc.ai_document_type || doc.document_type

    if (docType === "w2" || docType === "1099") {
      return <FileText className="w-5 h-5 text-green-500" />
    }
    if (docType === "receipt") {
      return <FileText className="w-5 h-5 text-blue-500" />
    }
    if (docType === "1040") {
      return <FileText className="w-5 h-5 text-purple-500" />
    }
    return <FileText className="w-5 h-5 text-neon" />
  }

  const getDocumentSubtitle = (doc: Document) => {
    const parts = []

    if (doc.ai_document_type) {
      parts.push(doc.ai_document_type.toUpperCase())
    }

    parts.push(new Date(doc.created_at).toLocaleDateString())
    parts.push(`${(doc.file_size / 1024).toFixed(1)} KB`)

    return parts.join(" • ")
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        {isDemoMode && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-purple-400">🚀 Demo Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  You're exploring Taxu with sample data. Create a free account to use your own data.
                </p>
              </div>
              <Button onClick={() => router.push("/signup")} className="bg-purple-600 hover:bg-purple-700 text-white">
                Create Account
              </Button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">
            Your 2024 tax filing is {completionPercentage()}% complete • Sam is monitoring your progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            onClick={() => handleStatCardClick("refund")}
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-neon" />
              <span className="text-xs text-muted-foreground">Estimated</span>
            </div>
            <div className="text-2xl font-bold text-neon">${taxCalc?.estimated_refund?.toFixed(0) || "0"}</div>
            <div className="text-sm text-muted-foreground">Expected Refund</div>
          </Card>

          <Card
            onClick={() => handleStatCardClick("audit-risk")}
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-xs text-muted-foreground">Audit Risk</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{taxCalc?.audit_risk_score || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {taxCalc?.confidence_percentage?.toFixed(0) || "0"}% Confidence
            </div>
          </Card>

          <Card
            onClick={() => handleStatCardClick("documents")}
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-xs text-muted-foreground">Documents</span>
            </div>
            <div className="text-2xl font-bold">{documents.length}/10</div>
            <div className="text-sm text-muted-foreground">Uploaded</div>
          </Card>

          <Card
            onClick={() => handleStatCardClick("deadline")}
            className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/40 transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-muted-foreground">Deadline</span>
            </div>
            <div className="text-2xl font-bold">{daysUntilDeadline}</div>
            <div className="text-sm text-muted-foreground">Days Left</div>
            <div className="text-xs text-muted-foreground mt-1">{deadlineDate}</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* QuickBooks-Style Accounting Features card */}
            <Card className="p-6 border-neon/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">QuickBooks-Style Accounting</h2>
                  <p className="text-sm text-muted-foreground">Complete business accounting and bookkeeping tools</p>
                </div>
                <Button onClick={handleAccountingDashboard} className="bg-neon hover:bg-neon/90 text-background">
                  Open Accounting
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => router.push("/accounting/invoices/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <Receipt className="w-6 h-6 text-blue-500" />
                  <span className="text-xs font-medium">Invoices</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/expenses/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <Wallet className="w-6 h-6 text-green-500" />
                  <span className="text-xs font-medium">Expenses</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/customers/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <Users className="w-6 h-6 text-purple-500" />
                  <span className="text-xs font-medium">Customers</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/reports/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                  <span className="text-xs font-medium">Reports</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/vendors/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <Building2 className="w-6 h-6 text-red-500" />
                  <span className="text-xs font-medium">Vendors</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/banking/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <CreditCard className="w-6 h-6 text-cyan-500" />
                  <span className="text-xs font-medium">Banking</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/products/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <FileText className="w-6 h-6 text-yellow-500" />
                  <span className="text-xs font-medium">Products</span>
                </button>
                <button
                  onClick={() => router.push("/accounting/projects/dashboard")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all"
                >
                  <TrendingUp className="w-6 h-6 text-pink-500" />
                  <span className="text-xs font-medium">Projects</span>
                </button>
              </div>
            </Card>

            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Continue Filing</h2>
              <div className="space-y-4">
                <button
                  onClick={handlePersonalInfo}
                  className="w-full flex items-start gap-4 text-left hover:bg-background/50 p-3 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-neon" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Personal Information</h3>
                    <p className="text-sm text-muted-foreground">{profile?.full_name ? "Completed" : "Not started"}</p>
                  </div>
                </button>

                <button
                  onClick={handleIncomeDocuments}
                  className="w-full flex items-start gap-4 text-left hover:bg-background/50 p-3 rounded-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
                    {documents.length > 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-neon" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Income Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      {documents.length > 0 ? `${documents.length} documents uploaded` : "No documents yet"}
                    </p>
                  </div>
                </button>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${
                      deductions.length > 0 ? "bg-neon animate-pulse" : "bg-muted"
                    } flex items-center justify-center flex-shrink-0`}
                  >
                    {deductions.length > 0 ? (
                      <AlertCircle className="w-5 h-5 text-background" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Deductions & Credits</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {deductions.length > 0
                        ? `Found ${deductions.length} potential deductions for you`
                        : "Upload W-2 to find deductions"}
                    </p>
                    {deductions.length > 0 && (
                      <Button onClick={handleReviewDeductions} className="bg-neon hover:bg-neon/90 text-background">
                        Review Tax Return
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity yet. Upload a W-2 to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivityClick(activity.id)}
                      className="w-full flex items-center gap-4 text-sm text-left hover:bg-background/50 p-2 rounded-lg transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-neon" />
                      <span className="text-muted-foreground">{timeAgo(activity.created_at)}</span>
                      <span>{activity.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Documents</h2>
                <Button
                  onClick={handleUploadDocument}
                  variant="outline"
                  size="sm"
                  className="border-neon/20 bg-transparent"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>

              {documentError && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500">{documentError}</p>
                  <Button
                    onClick={fetchDashboardData}
                    variant="outline"
                    size="sm"
                    className="mt-2 border-red-500/20 bg-transparent"
                  >
                    Retry
                  </Button>
                </div>
              )}

              {loadingDocuments ? (
                <div className="text-center py-8 text-muted-foreground">Loading documents...</div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                  <Button onClick={handleUploadDocument} className="bg-neon hover:bg-neon/90 text-background">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc)}
                        <div>
                          <div className="font-medium">{getDocumentDisplayName(doc)}</div>
                          <div className="text-xs text-muted-foreground">{getDocumentSubtitle(doc)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadDocument(doc.id, doc.file_name)
                          }}
                          variant="ghost"
                          size="sm"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteDocument(doc.id, doc.file_name)
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Your AI Team</h2>
              <p className="text-sm text-muted-foreground mb-4">Led by Sam, your Lead Tax Strategist</p>
              <div className="space-y-3">
                {agents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => {
                      setSelectedAgent(agent.name)
                      handleChatWithAgent(agent.name)
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedAgent === agent.name
                        ? "bg-neon/10 border border-neon/20"
                        : "bg-background/50 hover:bg-background/80"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white font-bold`}
                    >
                      {agent.name[0]}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => handleChatWithAgent(selectedAgent)}
                className="w-full mt-4 bg-neon hover:bg-neon/90 text-background"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with {selectedAgent}
              </Button>
            </Card>

            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button
                  onClick={handleScheduleReview}
                  variant="outline"
                  className="w-full justify-start border-neon/20 bg-transparent"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>
                <Button
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="w-full justify-start border-neon/20 bg-transparent"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
                <Button
                  onClick={handleAccountSettings}
                  variant="outline"
                  className="w-full justify-start border-neon/20 bg-transparent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </Card>

            {profile?.subscription_tier === "Free" && (
              <Card
                onClick={handleUpgrade}
                className="p-6 border-neon/20 bg-gradient-to-br from-neon/10 to-blue-500/10 cursor-pointer hover:border-neon/40 transition-all"
              >
                <h3 className="font-bold mb-2">Unlock AI Co-Pilot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get year-round tax advice, reminders, and planning for just $5/month
                </p>
                <Button className="w-full bg-neon hover:bg-neon/90 text-background">Upgrade Now</Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-6 border-neon/20 bg-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upload Tax Documents</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowUploadModal(false)
                  setAutoRefresh(false)
                }}
              >
                ✕
              </Button>
            </div>

            <DocumentUpload onUploadComplete={handleUploadComplete} />

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Supported formats: PDF, JPG, PNG, DOCX (max 10MB)</p>
              {autoRefresh && (
                <p className="text-xs text-neon mt-2 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Dashboard auto-refreshing...
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
