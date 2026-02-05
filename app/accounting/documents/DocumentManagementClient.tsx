"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Upload,
  FileText,
  ImageIcon,
  File,
  Download,
  Eye,
  Search,
  Filter,
  FolderOpen,
  Clock,
  Users,
  HardDrive,
} from "lucide-react"

export default function DocumentManagementClient() {
  const [documents, setDocuments] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents/list")
      const data = await response.json()
      setDocuments(data.files || [])
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("category", selectedCategory)

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (response.ok) {
        await fetchDocuments()
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const categories = ["Invoices", "Bills", "Receipts", "Contracts", "Tax Documents", "Reports", "Other"]

  const stats = [
    {
      label: "Total Documents",
      value: documents.length.toString(),
      icon: FileText,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Storage Used",
      value: `${(documents.reduce((sum, doc) => sum + (doc.size || 0), 0) / 1024 / 1024).toFixed(2)} MB`,
      icon: HardDrive,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Categories",
      value: categories.length.toString(),
      icon: FolderOpen,
      color: "from-green-500 to-green-600",
    },
    {
      label: "This Month",
      value: documents
        .filter((doc) => {
          const uploadDate = new Date(doc.uploadedAt)
          const now = new Date()
          return uploadDate.getMonth() === now.getMonth()
        })
        .length.toString(),
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getFileIcon = (type: string) => {
    if (!type) return File
    if (type.startsWith("image/")) return ImageIcon
    if (type === "application/pdf") return FileText
    return File
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Document Management
            </h1>
            <p className="text-slate-600 mt-1">Centralized file storage with OCR scanning and version control</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <label htmlFor="file-upload">
              <Button
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </span>
              </Button>
              <input id="file-upload" type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                size="sm"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No documents found</p>
                <p className="text-sm text-slate-400 mt-1">Upload your first document to get started</p>
              </div>
            ) : (
              filteredDocuments.map((doc, index) => {
                const FileIcon = getFileIcon(doc.type)
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{doc.filename}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {doc.category}
                          </Badge>
                          <span className="text-xs text-slate-500">{(doc.size / 1024).toFixed(2)} KB</span>
                          <span className="text-xs text-slate-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Link href="/accounting/documents/ocr">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">OCR Scanning</h3>
                  <p className="text-sm text-slate-600">Extract text from documents</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Link href="/accounting/documents/versions">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Version Control</h3>
                  <p className="text-sm text-slate-600">Track document changes</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Link href="/accounting/documents/linked">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Linked Documents</h3>
                  <p className="text-sm text-slate-600">View transaction links</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
