"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Download, RefreshCw } from "lucide-react"
import Link from "next/link"

export function LogsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "error">("all")

  const allLogs = [
    {
      endpoint: "POST /api/v1/returns",
      status: 200,
      time: "2s ago",
      duration: "45ms",
      ip: "192.168.1.1",
      method: "POST",
    },
    {
      endpoint: "GET /api/v1/refund-estimate",
      status: 200,
      time: "5s ago",
      duration: "32ms",
      ip: "192.168.1.2",
      method: "GET",
    },
    {
      endpoint: "POST /api/v1/documents/upload",
      status: 201,
      time: "12s ago",
      duration: "156ms",
      ip: "192.168.1.1",
      method: "POST",
    },
    {
      endpoint: "GET /api/v1/returns/ret_abc123",
      status: 200,
      time: "18s ago",
      duration: "28ms",
      ip: "192.168.1.3",
      method: "GET",
    },
    {
      endpoint: "POST /api/v1/webhooks",
      status: 200,
      time: "25s ago",
      duration: "41ms",
      ip: "192.168.1.1",
      method: "POST",
    },
    {
      endpoint: "GET /api/v1/deductions",
      status: 200,
      time: "32s ago",
      duration: "38ms",
      ip: "192.168.1.2",
      method: "GET",
    },
    {
      endpoint: "POST /api/v1/returns/file",
      status: 400,
      time: "45s ago",
      duration: "12ms",
      ip: "192.168.1.4",
      method: "POST",
    },
    {
      endpoint: "GET /api/v1/user/profile",
      status: 200,
      time: "1m ago",
      duration: "22ms",
      ip: "192.168.1.1",
      method: "GET",
    },
    {
      endpoint: "PUT /api/v1/returns/ret_xyz789",
      status: 200,
      time: "2m ago",
      duration: "67ms",
      ip: "192.168.1.3",
      method: "PUT",
    },
    {
      endpoint: "DELETE /api/v1/documents/doc_123",
      status: 204,
      time: "3m ago",
      duration: "18ms",
      ip: "192.168.1.2",
      method: "DELETE",
    },
  ]

  const filteredLogs = allLogs.filter((log) => {
    const matchesSearch = log.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "success" && log.status >= 200 && log.status < 300) ||
      (statusFilter === "error" && (log.status >= 400 || log.status < 200))
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <Link
        href="/developer-portal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Developer Portal
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">API Request Logs</h1>
            <p className="text-muted-foreground">View and analyze all API requests to your account</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className={statusFilter === "all" ? "glow-neon-strong" : "bg-transparent"}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "success" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("success")}
              className={statusFilter === "success" ? "glow-neon-strong" : "bg-transparent"}
            >
              Success
            </Button>
            <Button
              variant={statusFilter === "error" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("error")}
              className={statusFilter === "error" ? "glow-neon-strong" : "bg-transparent"}
            >
              Errors
            </Button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-alt border-b border-border">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Method</th>
                  <th className="text-left p-4 font-semibold text-sm">Endpoint</th>
                  <th className="text-left p-4 font-semibold text-sm">Duration</th>
                  <th className="text-left p-4 font-semibold text-sm">IP Address</th>
                  <th className="text-left p-4 font-semibold text-sm">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-background-alt/50 transition-colors">
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono font-semibold ${
                          log.status >= 200 && log.status < 300
                            ? "bg-green-500/10 text-green-500"
                            : log.status >= 400
                              ? "bg-red-500/10 text-red-500"
                              : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-mono text-muted-foreground">{log.method}</span>
                    </td>
                    <td className="p-4">
                      <code className="text-sm font-mono">{log.endpoint}</code>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{log.duration}</td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">{log.ip}</td>
                    <td className="p-4 text-sm text-muted-foreground">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {filteredLogs.length} of {allLogs.length} requests
        </div>
      </div>
    </div>
  )
}
