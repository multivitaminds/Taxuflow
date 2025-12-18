"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react"
import Link from "next/link"

export function TimeCalendarClient() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Mock time entries
  const timeEntries: Record<number, Array<{ project: string; hours: number; color: string }>> = {
    5: [{ project: "Website Redesign", hours: 4.5, color: "blue" }],
    12: [{ project: "Mobile App", hours: 3.0, color: "purple" }],
    15: [
      { project: "Client Consultation", hours: 2.0, color: "green" },
      { project: "Website Redesign", hours: 5.5, color: "blue" },
    ],
    20: [{ project: "E-commerce Site", hours: 6.5, color: "orange" }],
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Time Calendar</h1>
          <p className="text-slate-600 mt-1">Visual overview of time tracked across projects</p>
        </div>
        <Link href="/accounting/time/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Entry
          </Button>
        </Link>
      </div>

      <Card className="p-6 bg-white shadow-md">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-slate-600 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50 rounded-lg p-2 min-h-[120px]" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const entries = timeEntries[day] || []
            const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            return (
              <div
                key={day}
                className={`bg-white border-2 rounded-lg p-2 min-h-[120px] hover:shadow-md transition-all cursor-pointer ${
                  isToday ? "border-blue-500 bg-blue-50" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${isToday ? "text-blue-600" : "text-slate-700"}`}>{day}</span>
                  {totalHours > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {totalHours}h
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  {entries.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-1.5 rounded bg-${entry.color}-100 text-${entry.color}-700 font-medium truncate`}
                    >
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {entry.hours}h
                      </div>
                      <div className="truncate">{entry.project}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 bg-white shadow-md">
        <h3 className="font-semibold text-slate-900 mb-3">Projects</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm text-slate-600">Website Redesign</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500" />
            <span className="text-sm text-slate-600">Mobile App</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-sm text-slate-600">Client Consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-sm text-slate-600">E-commerce Site</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
