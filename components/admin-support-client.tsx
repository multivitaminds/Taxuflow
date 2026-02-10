"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  ArrowLeft,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  User,
} from "lucide-react"

interface Ticket {
  id: string
  subject: string
  user: string
  status: "open" | "in_progress" | "resolved"
  priority: "low" | "medium" | "high"
  created: string
}

const sampleTickets: Ticket[] = [
  { id: "TKT-001", subject: "Unable to submit W-2 filing", user: "john@example.com", status: "open", priority: "high", created: "2025-01-15" },
  { id: "TKT-002", subject: "Invoice PDF not generating", user: "jane@company.com", status: "in_progress", priority: "medium", created: "2025-01-14" },
  { id: "TKT-003", subject: "Question about pricing tiers", user: "bob@startup.io", status: "open", priority: "low", created: "2025-01-13" },
  { id: "TKT-004", subject: "Bank connection failing", user: "alice@corp.com", status: "resolved", priority: "high", created: "2025-01-12" },
  { id: "TKT-005", subject: "Need help with API integration", user: "dev@tech.co", status: "in_progress", priority: "medium", created: "2025-01-11" },
]

export default function AdminSupportClient({ adminUser }: { adminUser: any }) {
  const [search, setSearch] = useState("")

  const filteredTickets = sampleTickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  )

  const statusColor = (status: string) => {
    switch (status) {
      case "open":
        return "border-yellow-500/30 text-yellow-400"
      case "in_progress":
        return "border-blue-500/30 text-blue-400"
      case "resolved":
        return "border-green-500/30 text-green-400"
      default:
        return "border-gray-500/30 text-gray-400"
    }
  }

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500/30 text-red-400"
      case "medium":
        return "border-orange-500/30 text-orange-400"
      default:
        return "border-gray-500/30 text-gray-400"
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-400" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const openCount = sampleTickets.filter((t) => t.status === "open").length
  const inProgressCount = sampleTickets.filter((t) => t.status === "in_progress").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Support Tickets</h1>
                <p className="text-sm text-gray-400">
                  {openCount} open, {inProgressCount} in progress
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{openCount}</p>
                  <p className="text-sm text-gray-400">Open</p>
                </div>
              </div>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/20 p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                  <p className="text-sm text-gray-400">In Progress</p>
                </div>
              </div>
            </Card>
            <Card className="bg-green-500/10 border-green-500/20 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {sampleTickets.filter((t) => t.status === "resolved").length}
                  </p>
                  <p className="text-sm text-gray-400">Resolved</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {statusIcon(ticket.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                        <p className="text-white font-medium">{ticket.subject}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <User className="w-3 h-3" />
                        {ticket.user}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline" className={statusColor(ticket.status)}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-gray-500">{ticket.created}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
