"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Download, ChevronRight, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface ScheduleClientProps {
  user: User
  profile: {
    full_name: string | null
    subscription_tier: string
  } | null
}

interface TaxSchedule {
  id: string
  name: string
  title: string
  description: string
  status: "completed" | "in-progress" | "not-started"
  amount?: number
  icon: string
}

export function ScheduleClient({ user, profile }: ScheduleClientProps) {
  const router = useRouter()
  const [schedules, setSchedules] = useState<TaxSchedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedules = async () => {
      const supabase = createClient()

      // Fetch user's documents to determine which schedules apply
      const { data: documents } = await supabase.from("documents").select("*").eq("user_id", user.id)

      const hasW2 = documents?.some((doc) => doc.ai_document_type === "w2")
      const has1099 = documents?.some((doc) => doc.ai_document_type === "1099")
      const hasBusinessDocs = documents?.some(
        (doc) => doc.document_type === "receipt" || doc.document_type === "invoice",
      )

      // Define applicable schedules based on user's documents
      const applicableSchedules: TaxSchedule[] = [
        {
          id: "schedule-a",
          name: "Schedule A",
          title: "Itemized Deductions",
          description: "Medical expenses, taxes, interest, charitable contributions",
          status: hasW2 ? "in-progress" : "not-started",
          amount: 12500,
          icon: "📋",
        },
        {
          id: "schedule-c",
          name: "Schedule C",
          title: "Profit or Loss from Business",
          description: "Self-employment income and business expenses",
          status: has1099 || hasBusinessDocs ? "in-progress" : "not-started",
          amount: 45000,
          icon: "💼",
        },
        {
          id: "schedule-se",
          name: "Schedule SE",
          title: "Self-Employment Tax",
          description: "Social Security and Medicare taxes for self-employed",
          status: has1099 ? "in-progress" : "not-started",
          amount: 6358,
          icon: "💰",
        },
        {
          id: "schedule-1",
          name: "Schedule 1",
          title: "Additional Income and Adjustments",
          description: "Unemployment, alimony, student loan interest deduction",
          status: "not-started",
          icon: "📊",
        },
        {
          id: "schedule-2",
          name: "Schedule 2",
          title: "Additional Taxes",
          description: "Alternative minimum tax, self-employment tax",
          status: "not-started",
          icon: "🧾",
        },
        {
          id: "schedule-3",
          name: "Schedule 3",
          title: "Additional Credits and Payments",
          description: "Foreign tax credit, education credits, estimated tax payments",
          status: "not-started",
          icon: "💳",
        },
        {
          id: "schedule-eic",
          name: "Schedule EIC",
          title: "Earned Income Credit",
          description: "Qualifying child information for earned income credit",
          status: "not-started",
          icon: "👨‍👩‍👧‍👦",
        },
      ]

      setSchedules(applicableSchedules)
      setLoading(false)
    }

    fetchSchedules()
  }, [user.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      default:
        return "Not Started"
    }
  }

  const handleScheduleClick = (scheduleId: string) => {
    console.log(`[v0] Opening schedule: ${scheduleId}`)
    router.push(`/dashboard/schedule/${scheduleId}`)
  }

  const handleDownloadAll = () => {
    console.log("[v0] Downloading all schedules")
    alert("Download functionality will be available once you complete your tax return")
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Tax Schedules</h1>
          <p className="text-muted-foreground">Review and complete your tax schedules for the 2024 tax year</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Schedules</span>
              <FileText className="w-5 h-5 text-neon" />
            </div>
            <div className="text-3xl font-bold">{schedules.length}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold">{schedules.filter((s) => s.status === "in-progress").length}</div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Completed</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold">{schedules.filter((s) => s.status === "completed").length}</div>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Tax Schedules</h2>
            <Button onClick={handleDownloadAll} variant="outline" className="border-neon/20 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading schedules...</div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => handleScheduleClick(schedule.id)}
                  className="w-full flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-all border border-border hover:border-neon/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{schedule.icon}</div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{schedule.name}</div>
                      <div className="text-sm font-medium text-muted-foreground">{schedule.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{schedule.description}</div>
                      {schedule.amount && (
                        <div className="text-sm font-semibold text-neon mt-2">${schedule.amount.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(schedule.status)}
                      <span className="text-sm text-muted-foreground">{getStatusText(schedule.status)}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 border-neon/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur">
          <h3 className="font-bold text-lg mb-2">Need Help with Schedules?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI agents can help you understand which schedules apply to your situation and guide you through
            completing them.
          </p>
          <Button onClick={() => router.push("/chat")} className="bg-neon hover:bg-neon/90 text-background">
            Chat with Sam
          </Button>
        </Card>
      </div>
    </div>
  )
}
