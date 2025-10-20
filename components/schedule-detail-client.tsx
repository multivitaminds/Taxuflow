"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Save, CheckCircle2, AlertCircle } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ScheduleDetailClientProps {
  user: User
  profile: {
    full_name: string | null
    subscription_tier: string
  } | null
  scheduleId: string
}

interface ScheduleData {
  id: string
  name: string
  title: string
  description: string
  icon: string
  fields: {
    id: string
    label: string
    type: "text" | "number" | "textarea"
    value: string | number
    description?: string
  }[]
}

export function ScheduleDetailClient({ user, profile, scheduleId }: ScheduleDetailClientProps) {
  const router = useRouter()
  const [schedule, setSchedule] = useState<ScheduleData | null>(null)
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const scheduleMap: Record<string, ScheduleData> = {
      "schedule-a": {
        id: "schedule-a",
        name: "Schedule A",
        title: "Itemized Deductions",
        description: "Medical expenses, taxes, interest, charitable contributions",
        icon: "📋",
        fields: [
          {
            id: "medical_expenses",
            label: "Medical and Dental Expenses",
            type: "number",
            value: 0,
            description: "Enter total medical and dental expenses",
          },
          {
            id: "state_taxes",
            label: "State and Local Taxes",
            type: "number",
            value: 0,
            description: "State income taxes or sales taxes",
          },
          {
            id: "mortgage_interest",
            label: "Home Mortgage Interest",
            type: "number",
            value: 0,
            description: "Interest paid on home mortgage",
          },
          {
            id: "charitable_contributions",
            label: "Charitable Contributions",
            type: "number",
            value: 0,
            description: "Cash and non-cash donations",
          },
        ],
      },
      "schedule-c": {
        id: "schedule-c",
        name: "Schedule C",
        title: "Profit or Loss from Business",
        description: "Self-employment income and business expenses",
        icon: "💼",
        fields: [
          {
            id: "business_name",
            label: "Business Name",
            type: "text",
            value: "",
            description: "Name of your business",
          },
          {
            id: "gross_receipts",
            label: "Gross Receipts or Sales",
            type: "number",
            value: 0,
            description: "Total business income",
          },
          {
            id: "cost_of_goods",
            label: "Cost of Goods Sold",
            type: "number",
            value: 0,
            description: "Direct costs of producing goods",
          },
          {
            id: "advertising",
            label: "Advertising",
            type: "number",
            value: 0,
            description: "Advertising and marketing expenses",
          },
          {
            id: "office_expenses",
            label: "Office Expenses",
            type: "number",
            value: 0,
            description: "Office supplies and expenses",
          },
          {
            id: "utilities",
            label: "Utilities",
            type: "number",
            value: 0,
            description: "Business utilities",
          },
        ],
      },
      "schedule-se": {
        id: "schedule-se",
        name: "Schedule SE",
        title: "Self-Employment Tax",
        description: "Social Security and Medicare taxes for self-employed",
        icon: "💰",
        fields: [
          {
            id: "net_profit",
            label: "Net Profit from Schedule C",
            type: "number",
            value: 0,
            description: "Your net business profit",
          },
          {
            id: "self_employment_tax",
            label: "Self-Employment Tax",
            type: "number",
            value: 0,
            description: "Calculated at 15.3% of net profit",
          },
        ],
      },
      "schedule-1": {
        id: "schedule-1",
        name: "Schedule 1",
        title: "Additional Income and Adjustments",
        description: "Unemployment, alimony, student loan interest deduction",
        icon: "📊",
        fields: [
          {
            id: "unemployment",
            label: "Unemployment Compensation",
            type: "number",
            value: 0,
          },
          {
            id: "alimony",
            label: "Alimony Received",
            type: "number",
            value: 0,
          },
          {
            id: "student_loan_interest",
            label: "Student Loan Interest Deduction",
            type: "number",
            value: 0,
          },
        ],
      },
      "schedule-2": {
        id: "schedule-2",
        name: "Schedule 2",
        title: "Additional Taxes",
        description: "Alternative minimum tax, self-employment tax",
        icon: "🧾",
        fields: [
          {
            id: "amt",
            label: "Alternative Minimum Tax",
            type: "number",
            value: 0,
          },
          {
            id: "self_employment_tax",
            label: "Self-Employment Tax",
            type: "number",
            value: 0,
          },
        ],
      },
      "schedule-3": {
        id: "schedule-3",
        name: "Schedule 3",
        title: "Additional Credits and Payments",
        description: "Foreign tax credit, education credits, estimated tax payments",
        icon: "💳",
        fields: [
          {
            id: "foreign_tax_credit",
            label: "Foreign Tax Credit",
            type: "number",
            value: 0,
          },
          {
            id: "education_credits",
            label: "Education Credits",
            type: "number",
            value: 0,
          },
          {
            id: "estimated_tax",
            label: "Estimated Tax Payments",
            type: "number",
            value: 0,
          },
        ],
      },
      "schedule-eic": {
        id: "schedule-eic",
        name: "Schedule EIC",
        title: "Earned Income Credit",
        description: "Qualifying child information for earned income credit",
        icon: "👨‍👩‍👧‍👦",
        fields: [
          {
            id: "child_name",
            label: "Child's Name",
            type: "text",
            value: "",
          },
          {
            id: "child_ssn",
            label: "Child's SSN",
            type: "text",
            value: "",
          },
          {
            id: "child_dob",
            label: "Child's Date of Birth",
            type: "text",
            value: "",
          },
        ],
      },
    }

    const scheduleData = scheduleMap[scheduleId]
    if (scheduleData) {
      setSchedule(scheduleData)
      const initialData: Record<string, string | number> = {}
      scheduleData.fields.forEach((field) => {
        initialData[field.id] = field.value
      })
      setFormData(initialData)
    }
  }, [scheduleId])

  const handleInputChange = (fieldId: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    console.log("[v0] Saving schedule data:", formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDownload = () => {
    console.log("[v0] Downloading schedule:", scheduleId)
    alert("Download functionality will be available once you complete your tax return")
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Schedule Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested schedule could not be found.</p>
            <Button onClick={() => router.push("/dashboard/schedule")}>Back to Schedules</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard/schedule")} className="mb-4">
            ← Back to All Schedules
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{schedule.icon}</div>
            <div>
              <h1 className="text-4xl font-bold">{schedule.name}</h1>
              <p className="text-xl text-muted-foreground">{schedule.title}</p>
            </div>
          </div>
          <p className="text-muted-foreground">{schedule.description}</p>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Schedule Details</h2>
            <div className="flex gap-2">
              {saved && (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved
                </div>
              )}
              <Button onClick={handleSave} variant="outline" className="border-neon/20 bg-transparent">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleDownload} variant="outline" className="border-neon/20 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {schedule.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-base font-semibold">
                  {field.label}
                </Label>
                {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="bg-background/50"
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      handleInputChange(field.id, field.type === "number" ? Number(e.target.value) : e.target.value)
                    }
                    className="bg-background/50"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-neon/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur">
          <h3 className="font-bold text-lg mb-2">Need Help with This Schedule?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI agents can help you understand what information to enter and ensure you're maximizing your deductions
            or credits.
          </p>
          <Button onClick={() => router.push("/chat")} className="bg-neon hover:bg-neon/90 text-background">
            Chat with Sam
          </Button>
        </Card>
      </div>
    </div>
  )
}
