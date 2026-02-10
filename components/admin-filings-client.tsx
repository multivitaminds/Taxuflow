"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  ArrowLeft,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"

interface Filing {
  id: string
  user_id: string
  form_type: string | null
  status: string
  created_at: string
  tax_year: number | null
}

export default function AdminFilingsClient({ adminUser }: { adminUser: any }) {
  const [filings, setFilings] = useState<Filing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadFilings()
  }, [])

  const loadFilings = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("tax_filings")
        .select("id, user_id, form_type, status, created_at, tax_year")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error
      setFilings(data || [])
    } catch (error) {
      console.error("[v0] Failed to load filings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFilings = filings.filter(
    (f) =>
      f.id?.toLowerCase().includes(search.toLowerCase()) ||
      f.form_type?.toLowerCase().includes(search.toLowerCase()) ||
      f.status?.toLowerCase().includes(search.toLowerCase())
  )

  const statusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "border-green-500/30 text-green-400"
      case "rejected":
        return "border-red-500/30 text-red-400"
      default:
        return "border-yellow-500/30 text-yellow-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Filing Management</h1>
                  <p className="text-sm text-gray-400">{filteredFilings.length} filings</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search filings by ID, form type, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading filings...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFilings.map((filing) => (
                <Card key={filing.id} className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {statusIcon(filing.status)}
                      <div>
                        <p className="text-white font-medium font-mono text-sm">
                          {filing.id.slice(0, 8)}...
                        </p>
                        <p className="text-sm text-gray-400">
                          {filing.form_type || "Unknown"} {filing.tax_year ? `(${filing.tax_year})` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={statusColor(filing.status)}
                      >
                        {filing.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(filing.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredFilings.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No filings found.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
