import { Suspense } from "react"
import { TimeCalendarClient } from "@/components/time-calendar-client"

export default function TimeCalendarPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading calendar...</div>}>
      <TimeCalendarClient />
    </Suspense>
  )
}
