"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Send } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface ScheduleClientProps {
  user: User
}

export function ScheduleClient({ user }: ScheduleClientProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Scheduling review:", formData)
    setSubmitted(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-neon" />
            <div>
              <h1 className="text-3xl font-bold">Schedule a Review</h1>
              <p className="text-muted-foreground">Book a time to review your tax return with an expert</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-neon" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Review Scheduled!</h2>
              <p className="text-muted-foreground">We'll send you a confirmation email shortly. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any specific questions or concerns?"
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full bg-neon hover:bg-neon/90 text-background">
                <Send className="w-4 h-4 mr-2" />
                Schedule Review
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}
