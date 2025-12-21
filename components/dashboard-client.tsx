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
import type { User } from "@supabase/ssr"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { DocumentUpload } from "@/components/document-upload"
import { agents } from "@/data/agents"

interface DashboardClientProps {
  user: User | null // Allow null for client-side auth fallback
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

interface Invoice {
  id: string
  total_amount: number
  status: string
  created_at: string
}

interface Expense {
  id: string
  amount: number
  expense_date: string
}

export function DashboardClient({ user: initialUser, profile: initialProfile }: DashboardClientProps) {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState(initialProfile?.preferred_agent || "Sam")
  const [user, setUser] = useState(initialUser)
  const [profile, setProfile] = useState(initialProfile)
  const [loading, setLoading] = useState(false)

  const [supabaseReady, setSupabaseReady] = useState(!!initialUser)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  const userName =
    (profile || initialProfile)?.full_name?.split(" ")[0] ||
    (user || initialUser)?.user_metadata?.full_name?.split(" ")[0] ||
    (user || initialUser)?.email?.split("@")[0] ||
    "there"
  const fullUserName =
    (profile || initialProfile)?.full_name ||
    (user || initialUser)?.user_metadata?.full_name ||
    (user || initialUser)?.email?.split("@")[0] ||
    "User"

  const [documents, setDocuments] = useState<Document[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [documentError, setDocumentError] = useState<string | null>(null)

  const [taxCalc, setTaxCalc] = useState<TaxCalculation | null>(null)
  const [activities, setActivities] = useState<AgentActivity[]>([])
  const [deductions, setDeductions] = useState<Deduction[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [financialLoading, setFinancialLoading] = useState(true)

  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0)
  const [deadlineDate, setDeadlineDate] = useState("")

  const getDeadlineInfo = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let deadlineYear = currentYear + 1
    if (now.getMonth() < 3 || (now.getMonth() === 3 && now.getDate() <= 15)) {
      deadlineYear = currentYear
    }
    const deadline = new Date(deadlineYear, 3, 15)
    const dayOfWeek = deadline.getDay()
    if (dayOfWeek === 0) deadline.setDate(deadline.getDate() + 1)
    else if (dayOfWeek === 6) deadline.setDate(deadline.getDate() + 2)

    const timeDiff = deadline.getTime() - now.getTime()
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

    return {
      days,
      date: deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
  }

  const deadline = getDeadlineInfo()

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

  useEffect(() => {
    async function initSupabase() {
      if (initialUser?.id === "demo-user-id") {
        console.log("[v0] Demo mode detected, checking for real client-side session")
        const supabase = getSupabaseBrowserClient()

        if (supabase) {
          try {
            const {
              data: { user: clientUser },
              error,
            } = await supabase.auth.getUser()

            if (!error && clientUser && clientUser.id !== "demo-user-id") {
              console.log("[v0] Found real authenticated user:", clientUser.email)

              // Fetch real user profile
              const { data: realProfile } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("id", clientUser.id)
                .maybeSingle()

              const userProfile = realProfile || {
                id: clientUser.id,
                email: clientUser.email || "",
                full_name: clientUser.user_metadata?.full_name || clientUser.email?.split("@")[0] || "User",
                created_at: clientUser.created_at,
                updated_at: clientUser.updated_at || clientUser.created_at,
                preferred_agent: "Sam",
                subscription_tier: "Free",
              }

              console.log("[v0] Using real user data:", { email: clientUser.email, name: userProfile.full_name })
              setUser(clientUser)
              setProfile(userProfile)
              setSupabaseReady(true)
              setLoading(false)
              return
            }
          } catch (err) {
            console.error("[v0] Error checking client-side session:", err)
          }
        }

        console.log("[v0] No real session found, using demo mode")
        setUser(initialUser)
        setProfile(initialProfile)
        setSupabaseReady(true)
        setLoading(false)
        return
      }

      if (initialUser) {
        console.log("[v0] Using server-provided user:", initialUser.email)
        setUser(initialUser)
        setProfile(initialProfile)
        setSupabaseReady(true)
        setLoading(false)
        return
      }

      console.log("[v0] No server user provided, redirecting to login")
      window.location.href = "/login"
    }

    initSupabase()
  }, [initialUser, initialProfile]) // Dependencies updated

  // Dynamically import and get Supabase client once ready
  const supabase = supabaseReady ? getSupabaseBrowserClient() : null

  const fetchDashboardData = async () => {
    if (!user) {
      console.log("[v0] No user available yet, skipping data fetch")
      return
    }

    if (user.id === "demo-user-id" || user.id === "authenticated-user-id") {
      console.log("[v0] Loading demo data for", user.id)
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

      setInvoices([
        { id: "inv-1", total_amount: 1250.0, status: "paid", created_at: new Date().toISOString() },
        { id: "inv-2", total_amount: 850.0, status: "pending", created_at: new Date().toISOString() },
        { id: "inv-3", total_amount: 2400.0, status: "paid", created_at: new Date().toISOString() },
      ])
      setExpenses([
        { id: "exp-1", amount: 120.5, expense_date: new Date().toISOString() },
        { id: "exp-2", amount: 450.0, expense_date: new Date().toISOString() },
      ])
      setFinancialLoading(false)

      setLoadingData(false)
      setLoadingDocuments(false)
      return
    }

    if (!supabase) {
      console.error("[v0] Cannot fetch data: Supabase client not available")
      setDocumentError("Database connection unavailable in preview mode. Try demo account for full functionality.")
      setLoadingData(false)
      setLoadingDocuments(false)
      return
    }

    console.log("[v0] Fetching dashboard data for user:", user.id)
    setLoadingData(true)
    setLoadingDocuments(true) // Set to true to show loading state for documents

    try {
      const fetchWithTimeout = async <T,>(promise: Promise<T>, timeoutMs = 10000): Promise<T> => {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), timeoutMs),
        )
        return Promise.race([promise, timeoutPromise])
      }

      const { data: w2Filings, error: w2Error } = await fetchWithTimeout(
        supabase.from("w2_filings").select("*").eq("user_id", user.id),
      )

      if (w2Error) {
        console.error("[v0] Error fetching W-2 filings:", w2Error)
      }

      let totalRefund = 0
      let totalIncome = 0
      let totalWithheld = 0
      let acceptedFilings = 0
      let pendingFilings = 0

      if (w2Filings && w2Filings.length > 0) {
        w2Filings.forEach((filing) => {
          const wages = filing.wages || 0
          const federalWithheld = filing.federal_tax_withheld || 0

          totalIncome += wages
          totalWithheld += federalWithheld

          const status = (filing.irs_status || "").toLowerCase()
          if (status === "accepted") {
            acceptedFilings++
            totalRefund += filing.refund_amount || 0
          } else if (!status || status === "pending") {
            pendingFilings++
          }
        })
      }

      const documentsComplete = (documents.length / 10) * 100
      const confidence = Math.min(95, Math.round(documentsComplete))

      let auditRisk = "Low"
      if (totalRefund > 50000) auditRisk = "Medium"
      if (totalRefund > 100000) auditRisk = "High"

      setTaxCalc({
        estimated_refund: totalRefund,
        confidence_percentage: confidence,
        audit_risk_score: auditRisk,
      })

      const { data: docsData, error: docsError } = await fetchWithTimeout(
        supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      )

      if (docsError) {
        console.error("[v0] Error fetching documents:", docsError)
        setDocumentError(docsError.message)
      } else {
        console.log("[v0] Documents fetched:", docsData?.length || 0)
        setDocuments(docsData || [])
      }

      const { data: taxData, error: taxError } = await fetchWithTimeout(
        supabase
          .from("tax_calculations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      )

      if (taxError) {
        console.log("[v0] Error fetching tax calculations:", taxError.message)
      } else if (taxData) {
        console.log("[v0] Tax calculation fetched:", taxData)
        setTaxCalc(taxData)
      } else {
        console.log("[v0] No tax calculations yet")
      }

      const { data: activitiesData, error: activitiesError } = await fetchWithTimeout(
        supabase
          .from("agent_activities")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      )

      if (activitiesError) {
        console.log("[v0] No activities yet:", activitiesError.message)
      } else {
        console.log("[v0] Activities fetched:", activitiesData?.length || 0)
        setActivities(activitiesData || [])
      }

      const { data: deductionsData, error: deductionsError } = await fetchWithTimeout(
        supabase.from("deductions_credits").select("*").eq("user_id", user.id),
      )

      if (deductionsError) {
        console.log("[v0] No deductions yet:", deductionsError.message)
      } else {
        console.log("[v0] Deductions fetched:", deductionsData?.length || 0)
        setDeductions(deductionsData || [])
      }

      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("id, total_amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (invoicesData) setInvoices(invoicesData)

      const { data: expensesData } = await supabase
        .from("journal_entries")
        .select("id, amount, entry_date")
        .eq("user_id", user.id)
        .eq("entry_type", "expense")
        .order("entry_date", { ascending: false })
        .limit(10)

      if (expensesData) setExpenses(expensesData.map((e) => ({ ...e, expense_date: e.entry_date })))
      setFinancialLoading(false)
    } catch (err) {
      console.error("[v0] Unexpected error fetching dashboard data:", err)
      if (err instanceof Error && err.message === "Request timeout") {
        setDocumentError("Request timed out. Please check your internet connection.")
      } else {
        setDocumentError("Failed to load data. Please refresh the page.")
      }
    } finally {
      setLoadingData(false)
      setLoadingDocuments(false)
    }
  }

  // This useEffect hook is now correctly placed after the initialisation hooks and before conditional rendering
  // It depends on user and supabaseReady to ensure it only runs when data can be fetched.
  useEffect(() => {
    if (user && supabaseReady) {
      fetchDashboardData()
    }
  }, [user, supabaseReady]) // Depend on user and supabaseReady state

  // The autoRefresh useEffect hook is also moved up and now depends on supabaseReady

  useEffect(() => {
    if (autoRefresh && user && supabaseReady) {
      console.log("[v0] Auto-refresh enabled, will refresh every 3 seconds")
      const interval = setInterval(() => {
        console.log("[v0] Auto-refreshing dashboard data...")
        // Trigger re-fetch by updating a dependency
        window.location.reload()
      }, 3000)

      return () => {
        console.log("[v0] Auto-refresh disabled")
        clearInterval(interval)
      }
    }
  }, [autoRefresh, user, supabaseReady]) // Depend on autoRefresh, user, and supabaseReady state

  if (!supabaseReady) {
    if (supabaseError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{supabaseError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Connecting to database...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <p className="text-lg text-red-600 mb-4">Session expired or authentication failed</p>
          <div className="space-y-2">
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 w-full"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

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

  const handle1099Filing = () => {
    console.log("[v0] Navigating to 1099 filing")
    router.push("/1099-filing")
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

  const handleStartFiling = (formType: string) => {
    console.log(`[v0] Starting ${formType} filing workflow`)
    router.push(`/dashboard/file/${formType}`)
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 pb-6">
          {/* Welcome Section */}
          <div className="mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">
              Your 2024 tax filing is {completionPercentage()}% complete • Sam is monitoring your progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card
              onClick={() => handleStatCardClick("refund")}
              className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/60 hover:bg-card/70 transition-all hover:scale-105 active:scale-100"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-neon" />
                <span className="text-xs text-muted-foreground">Estimated</span>
              </div>
              <div className="text-2xl font-bold text-neon">
                ${taxCalc?.estimated_refund?.toLocaleString("en-US", { maximumFractionDigits: 0 }) || "0"}
              </div>
              <div className="text-sm text-muted-foreground">Expected Refund</div>
            </Card>

            <Card
              onClick={() => handleStatCardClick("audit-risk")}
              className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/60 hover:bg-card/70 transition-all hover:scale-105 active:scale-100"
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
              className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/60 hover:bg-card/70 transition-all hover:scale-105 active:scale-100"
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
              className="p-6 border-neon/20 bg-card/50 backdrop-blur cursor-pointer hover:border-neon/60 hover:bg-card/70 transition-all hover:scale-105 active:scale-100"
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
                    onClick={() => router.push("/accounting/invoices")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <Receipt className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-medium">Invoices</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/expenses")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <Wallet className="w-6 h-6 text-green-500" />
                    <span className="text-xs font-medium">Expenses</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/customers")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <Users className="w-6 h-6 text-purple-500" />
                    <span className="text-xs font-medium">Customers</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/reports")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <BarChart3 className="w-6 h-6 text-orange-500" />
                    <span className="text-xs font-medium">Reports</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/vendors")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <Building2 className="w-6 h-6 text-red-500" />
                    <span className="text-xs font-medium">Vendors</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/banking")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <CreditCard className="w-6 h-6 text-cyan-500" />
                    <span className="text-xs font-medium">Banking</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/products")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <FileText className="w-6 h-6 text-yellow-500" />
                    <span className="text-xs font-medium">Products</span>
                  </button>
                  <button
                    onClick={() => router.push("/accounting/projects")}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all hover:scale-105"
                  >
                    <TrendingUp className="w-6 h-6 text-pink-500" />
                    <span className="text-xs font-medium">Projects</span>
                  </button>
                </div>
              </Card>

              <Card className="p-6 border-neon/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">1099 Filing & Management</h2>
                    <p className="text-sm text-muted-foreground">File 1099 forms for contractors and vendors</p>
                  </div>
                  <Button onClick={handle1099Filing} className="bg-green-600 hover:bg-green-700 text-white">
                    File 1099s
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                    <Users className="w-6 h-6 text-green-500" />
                    <span className="text-xs font-medium text-center">Manage Recipients</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-medium text-center">File Forms</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-neon/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Start New Filing</h2>
                    <p className="text-sm text-muted-foreground">File tax forms directly through Taxu</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleStartFiling("w2")}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-all border border-border hover:border-neon/40"
                  >
                    <FileText className="w-8 h-8 text-green-500" />
                    <div className="text-center">
                      <div className="font-semibold mb-1">File W-2</div>
                      <div className="text-xs text-muted-foreground">Employee wage reporting</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleStartFiling("1099-nec")}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-all border border-border hover:border-neon/40"
                  >
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="text-center">
                      <div className="font-semibold mb-1">File 1099-NEC</div>
                      <div className="text-xs text-muted-foreground">Contractor payments</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleStartFiling("941")}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg bg-background/50 hover:bg-background/80 transition-all border border-border hover:border-neon/40"
                  >
                    <FileText className="w-8 h-8 text-purple-500" />
                    <div className="text-center">
                      <div className="font-semibold mb-1">File Form 941</div>
                      <div className="text-xs text-muted-foreground">Quarterly payroll taxes</div>
                    </div>
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
                      <p className="text-sm text-muted-foreground">
                        {profile?.full_name ? "Completed" : "Not started"}
                      </p>
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
