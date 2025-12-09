"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Calendar,
  AlertTriangle,
  Archive,
  Clock,
  Shield,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Timer,
  FolderArchive,
  Bell,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  name: string
  type: string
  category: string
  uploadDate: Date
  retentionEndDate: Date
  status: "active" | "expiring-soon" | "expired" | "archived"
  complianceRule: string
  daysUntilExpiration: number
  size: string
  tags: string[]
}

export function DocumentLifecycleHub() {
  const [activeTab, setActiveTab] = useState("overview")
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data with IRS compliance
    const mockDocs: Document[] = [
      {
        id: "1",
        name: "2023-W2-Forms.pdf",
        type: "Tax Form",
        category: "Payroll",
        uploadDate: new Date("2024-01-15"),
        retentionEndDate: new Date("2031-01-15"),
        status: "active",
        complianceRule: "IRS 7-Year Retention",
        daysUntilExpiration: 2557,
        size: "2.4 MB",
        tags: ["W-2", "2023", "Tax"],
      },
      {
        id: "2",
        name: "Q4-2023-1099-NEC.pdf",
        type: "Tax Form",
        category: "Contractors",
        uploadDate: new Date("2024-02-01"),
        retentionEndDate: new Date("2031-02-01"),
        status: "active",
        complianceRule: "IRS 7-Year Retention",
        daysUntilExpiration: 2574,
        size: "1.8 MB",
        tags: ["1099-NEC", "Q4", "2023"],
      },
      {
        id: "3",
        name: "2017-Tax-Returns.pdf",
        type: "Tax Return",
        category: "Annual Filing",
        uploadDate: new Date("2017-04-15"),
        retentionEndDate: new Date("2024-04-15"),
        status: "expiring-soon",
        complianceRule: "IRS 7-Year Retention",
        daysUntilExpiration: 45,
        size: "3.2 MB",
        tags: ["Tax Return", "2017", "Annual"],
      },
      {
        id: "4",
        name: "2016-Expense-Receipts.pdf",
        type: "Receipt",
        category: "Expenses",
        uploadDate: new Date("2016-12-31"),
        retentionEndDate: new Date("2023-12-31"),
        status: "expired",
        complianceRule: "IRS 7-Year Retention",
        daysUntilExpiration: -365,
        size: "5.7 MB",
        tags: ["Receipts", "2016", "Expenses"],
      },
      {
        id: "5",
        name: "2015-Payroll-Records.pdf",
        type: "Payroll Record",
        category: "Payroll",
        uploadDate: new Date("2015-12-31"),
        retentionEndDate: new Date("2022-12-31"),
        status: "archived",
        complianceRule: "IRS 7-Year Retention",
        daysUntilExpiration: -730,
        size: "8.3 MB",
        tags: ["Payroll", "2015", "Archived"],
      },
    ]

    setDocuments(mockDocs)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "expiring-soon":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "expired":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "archived":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4" />
      case "expiring-soon":
        return <Timer className="h-4 w-4" />
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "archived":
        return <FolderArchive className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const stats = {
    active: documents.filter((d) => d.status === "active").length,
    expiringSoon: documents.filter((d) => d.status === "expiring-soon").length,
    expired: documents.filter((d) => d.status === "expired").length,
    archived: documents.filter((d) => d.status === "archived").length,
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Smart Document Lifecycle
            </h1>
            <p className="text-gray-400">Automated retention scheduling and IRS compliance management</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Documents
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-emerald-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">{stats.active}</p>
              <p className="text-sm text-gray-400">Active Documents</p>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-amber-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <Timer className="h-6 w-6 text-amber-500" />
              </div>
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Alert</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">{stats.expiringSoon}</p>
              <p className="text-sm text-gray-400">Expiring Soon</p>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-red-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Expired</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">{stats.expired}</p>
              <p className="text-sm text-gray-400">Expired Documents</p>
            </div>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-blue-500/50 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FolderArchive className="h-6 w-6 text-blue-500" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Archived</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">{stats.archived}</p>
              <p className="text-sm text-gray-400">Archived Documents</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-zinc-800">
          {["overview", "retention", "alerts", "compliance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all capitalize",
                activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expiring-soon">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading documents...</p>
            </Card>
          ) : filteredDocuments.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No documents found</p>
            </Card>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-zinc-900 border-zinc-800 p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{doc.name}</h3>
                        <Badge className={cn("border", getStatusColor(doc.status))}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 capitalize">{doc.status.replace("-", " ")}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Type</p>
                          <p className="text-sm text-gray-300">{doc.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Category</p>
                          <p className="text-sm text-gray-300">{doc.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Compliance Rule</p>
                          <p className="text-sm text-gray-300">{doc.complianceRule}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Retention Ends</p>
                          <p className="text-sm text-gray-300">{doc.retentionEndDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      {doc.status === "expiring-soon" && (
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                          <Bell className="h-4 w-4 text-amber-500" />
                          <p className="text-sm text-amber-400">
                            Expires in {doc.daysUntilExpiration} days. Review or archive this document.
                          </p>
                        </div>
                      )}
                      {doc.status === "expired" && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <p className="text-sm text-red-400">
                            This document has expired. Archive or securely destroy.
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} className="bg-zinc-800 text-gray-300 border-zinc-700 hover:bg-zinc-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="hover:bg-zinc-800">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-zinc-800">
                      <Archive className="h-4 w-4" />
                    </Button>
                    {doc.status === "expired" && (
                      <Button size="sm" variant="ghost" className="hover:bg-red-500/10 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Compliance Info */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">IRS Compliance Guidelines</h3>
              <p className="text-gray-300 mb-4">
                The IRS requires businesses to retain tax-related documents for 7 years from the filing date. This
                includes W-2s, 1099s, receipts, and supporting documentation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-black/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-400 mb-2" />
                  <p className="text-sm text-white font-medium mb-1">7-Year Retention</p>
                  <p className="text-xs text-gray-400">Standard IRS requirement</p>
                </div>
                <div className="p-4 bg-black/30 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-400 mb-2" />
                  <p className="text-sm text-white font-medium mb-1">90-Day Alerts</p>
                  <p className="text-xs text-gray-400">Advanced expiration notice</p>
                </div>
                <div className="p-4 bg-black/30 rounded-lg">
                  <Archive className="h-5 w-5 text-pink-400 mb-2" />
                  <p className="text-sm text-white font-medium mb-1">Auto-Archive</p>
                  <p className="text-xs text-gray-400">Secure post-expiration storage</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
