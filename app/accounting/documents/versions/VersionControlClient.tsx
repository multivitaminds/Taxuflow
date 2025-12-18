"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, FileText, Clock, User, Download, Eye, GitBranch } from "lucide-react"

export default function VersionControlClient() {
  const documents = [
    {
      id: 1,
      name: "Annual_Report_2024.pdf",
      versions: [
        {
          version: "v3",
          date: "2024-01-20",
          user: "John Doe",
          changes: "Final version with auditor approval",
          size: "2.4 MB",
        },
        {
          version: "v2",
          date: "2024-01-18",
          user: "Jane Smith",
          changes: "Updated financial statements",
          size: "2.3 MB",
        },
        { version: "v1", date: "2024-01-15", user: "John Doe", changes: "Initial draft", size: "2.1 MB" },
      ],
    },
    {
      id: 2,
      name: "Contract_Acme_Corp.pdf",
      versions: [
        {
          version: "v2",
          date: "2024-01-19",
          user: "Jane Smith",
          changes: "Added payment terms section",
          size: "1.8 MB",
        },
        { version: "v1", date: "2024-01-17", user: "John Doe", changes: "Initial contract draft", size: "1.7 MB" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/accounting/documents"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Version Control
            </h1>
            <p className="text-slate-600 mt-1">Track document changes and manage versions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Documents</p>
                <p className="text-2xl font-bold mt-1">{documents.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Versions</p>
                <p className="text-2xl font-bold mt-1">
                  {documents.reduce((sum, doc) => sum + doc.versions.length, 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Last Updated</p>
                <p className="text-2xl font-bold mt-1">Today</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{doc.name}</h3>
                    <p className="text-sm text-slate-500">{doc.versions.length} versions</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>

              <div className="space-y-3">
                {doc.versions.map((version, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Badge variant={index === 0 ? "default" : "secondary"}>{version.version}</Badge>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{version.changes}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.user}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {version.date}
                          </span>
                          <span className="text-xs text-slate-500">{version.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
