"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock, Bell, CheckCircle2, AlertCircle, Info } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface DeadlineDetailsClientProps {
  user: User
  profile: any
}

export function DeadlineDetailsClient({ user, profile }: DeadlineDetailsClientProps) {
  const router = useRouter()
  const [daysUntilDeadline, setDaysUntilDeadline] = useState(0)
  const [deadlineDate, setDeadlineDate] = useState("")
  const [milestones, setMilestones] = useState<any[]>([])

  console.log("[v0] DeadlineDetailsClient rendering", { user: !!user, profile: !!profile })

  useEffect(() => {
    const calculateDeadline = () => {
      console.log("[v0] Calculating deadline")
      const now = new Date()
      const currentYear = now.getFullYear()

      let deadlineYear = currentYear + 1
      if (now.getMonth() < 3 || (now.getMonth() === 3 && now.getDate() <= 15)) {
        deadlineYear = currentYear
      }

      const deadline = new Date(deadlineYear, 3, 15)

      const dayOfWeek = deadline.getDay()
      if (dayOfWeek === 0) {
        deadline.setDate(deadline.getDate() + 1)
      } else if (dayOfWeek === 6) {
        deadline.setDate(deadline.getDate() + 2)
      }

      const timeDiff = deadline.getTime() - now.getTime()
      const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))

      setDaysUntilDeadline(days)
      setDeadlineDate(deadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))

      const milestonesData = [
        {
          name: "Start Gathering Documents",
          date: new Date(deadline.getTime() - 90 * 24 * 60 * 60 * 1000),
          status: now > new Date(deadline.getTime() - 90 * 24 * 60 * 60 * 1000) ? "completed" : "upcoming",
        },
        {
          name: "Upload All W-2s and 1099s",
          date: new Date(deadline.getTime() - 60 * 24 * 60 * 60 * 1000),
          status: now > new Date(deadline.getTime() - 60 * 24 * 60 * 60 * 1000) ? "completed" : "upcoming",
        },
        {
          name: "Review Deductions",
          date: new Date(deadline.getTime() - 30 * 24 * 60 * 60 * 1000),
          status: now > new Date(deadline.getTime() - 30 * 24 * 60 * 60 * 1000) ? "completed" : "upcoming",
        },
        {
          name: "Final Review",
          date: new Date(deadline.getTime() - 7 * 24 * 60 * 60 * 1000),
          status: now > new Date(deadline.getTime() - 7 * 24 * 60 * 60 * 1000) ? "completed" : "upcoming",
        },
        {
          name: "File Tax Return",
          date: deadline,
          status: "upcoming",
        },
      ]

      setMilestones(milestonesData)
    }

    calculateDeadline()
    const interval = setInterval(calculateDeadline, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  const urgencyLevel =
    daysUntilDeadline > 60 ? "low" : daysUntilDeadline > 30 ? "medium" : daysUntilDeadline > 7 ? "high" : "critical"

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tax Filing Deadline</h1>
          <p className="text-muted-foreground">Important dates and milestones for your tax filing</p>
        </div>

        <Card
          className={`p-8 border-2 mb-8 ${
            urgencyLevel === "low"
              ? "border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
              : urgencyLevel === "medium"
                ? "border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
                : urgencyLevel === "high"
                  ? "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                  : "border-red-500/20 bg-gradient-to-br from-red-500/10 to-rose-500/10"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                urgencyLevel === "low"
                  ? "bg-green-500/20"
                  : urgencyLevel === "medium"
                    ? "bg-blue-500/20"
                    : urgencyLevel === "high"
                      ? "bg-yellow-500/20"
                      : "bg-red-500/20"
              }`}
            >
              <Calendar
                className={`w-8 h-8 ${
                  urgencyLevel === "low"
                    ? "text-green-500"
                    : urgencyLevel === "medium"
                      ? "text-blue-500"
                      : urgencyLevel === "high"
                        ? "text-yellow-500"
                        : "text-red-500"
                }`}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Until Deadline</p>
              <h2
                className={`text-5xl font-bold ${
                  urgencyLevel === "low"
                    ? "text-green-500"
                    : urgencyLevel === "medium"
                      ? "text-blue-500"
                      : urgencyLevel === "high"
                        ? "text-yellow-500"
                        : "text-red-500"
                }`}
              >
                {daysUntilDeadline}
              </h2>
            </div>
          </div>
          <p className="text-lg font-semibold mb-2">Filing Deadline: {deadlineDate}</p>
          <p className="text-sm text-muted-foreground">
            {urgencyLevel === "low"
              ? "You have plenty of time to prepare your tax return. Start gathering documents now."
              : urgencyLevel === "medium"
                ? "Good time to start working on your tax return. Upload your documents and review deductions."
                : urgencyLevel === "high"
                  ? "Time to focus on completing your tax return. Make sure all documents are uploaded."
                  : "Urgent! File your tax return as soon as possible to avoid penalties."}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Filing Timeline
            </h3>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3">
                  {milestone.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{milestone.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {milestone.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-500" />
              Important Dates
            </h3>
            <div className="space-y-4">
              <div className="pb-3 border-b border-border">
                <p className="font-semibold">Tax Filing Deadline</p>
                <p className="text-sm text-muted-foreground">{deadlineDate}</p>
              </div>
              <div className="pb-3 border-b border-border">
                <p className="font-semibold">Extension Deadline</p>
                <p className="text-sm text-muted-foreground">October 15, {new Date().getFullYear() + 1}</p>
              </div>
              <div className="pb-3 border-b border-border">
                <p className="font-semibold">Q1 Estimated Tax Payment</p>
                <p className="text-sm text-muted-foreground">April 15, {new Date().getFullYear() + 1}</p>
              </div>
              <div>
                <p className="font-semibold">Q2 Estimated Tax Payment</p>
                <p className="text-sm text-muted-foreground">June 15, {new Date().getFullYear() + 1}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            Deadline Reminders
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Email reminders enabled</span>
              </div>
              <Button variant="outline" size="sm" className="border-neon/20 bg-transparent">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Push notifications enabled</span>
              </div>
              <Button variant="outline" size="sm" className="border-neon/20 bg-transparent">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span>SMS reminders (upgrade required)</span>
              </div>
              <Button variant="outline" size="sm" className="border-neon/20 bg-transparent">
                Upgrade
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button className="bg-neon hover:bg-neon/90 text-background" onClick={() => router.push("/dashboard")}>
            Continue Filing
          </Button>
          <Button variant="outline" className="border-neon/20 bg-transparent" onClick={() => router.push("/review")}>
            Review Tax Return
          </Button>
        </div>
      </div>
    </div>
  )
}
