"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  FileSearch,
  Brain,
  Sparkles,
  AlertTriangle,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DocumentIntelligenceHub() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const { toast } = useToast()

  const stats = [
    {
      label: "Documents Processed",
      value: "1,247",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "W-9 Forms Extracted",
      value: "342",
      icon: FileSearch,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Contracts Analyzed",
      value: "128",
      icon: Brain,
      gradient: "from-orange-500 to-red-500",
    },
    {
      label: "AI Confidence",
      value: "98.5%",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setExtractedData(null)
    setAnalysisResults(null)

    try {
      // Convert to base64
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString("base64")

      // Extract document data
      const extractResponse = await fetch("/api/documents/extract-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: base64,
          fileName: file.name,
          mimeType: file.type,
        }),
      })

      const extractData = await extractResponse.json()

      if (extractData.success) {
        setExtractedData(extractData.data)
        setSelectedDocument({
          name: file.name,
          type: extractData.documentType,
          pages: extractData.totalPages || 1,
        })

        // If it's a contract, run analysis
        if (extractData.documentType === "contract") {
          setAnalysisResults(extractData.analysis)
        }

        toast({
          title: "Document Processed",
          description: `Successfully extracted data from ${file.name}`,
        })
      } else {
        throw new Error(extractData.error)
      }
    } catch (error) {
      console.error("[Document Intelligence Error]", error)
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Failed to process document",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Document Intelligence</h1>
            <p className="text-slate-400">
              AI-powered extraction for W-9 forms, multi-page processing, and contract analysis
            </p>
          </div>
          <label htmlFor="doc-upload">
            <Button
              className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              asChild
            >
              <span>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </>
                )}
              </span>
            </Button>
            <input
              id="doc-upload"
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </label>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="p-6 bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Viewer */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-400" />
              Document Viewer
            </h2>

            {!selectedDocument && (
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-2">No document uploaded</p>
                <p className="text-sm text-slate-500">Upload a document to view and extract data</p>
              </div>
            )}

            {selectedDocument && (
              <div className="space-y-4">
                <div className="aspect-[8.5/11] bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">{selectedDocument.name}</p>
                    <Badge className="mt-2 bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {selectedDocument.type}
                    </Badge>
                  </div>
                </div>

                {/* Page Navigation */}
                {selectedDocument.pages > 1 && (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-slate-700 text-slate-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm text-slate-400">
                      Page {currentPage} of {selectedDocument.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(selectedDocument.pages, currentPage + 1))}
                      disabled={currentPage === selectedDocument.pages}
                      className="border-slate-700 text-slate-400 hover:text-white"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700 text-slate-400 hover:text-white bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700 text-slate-400 hover:text-white bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Extracted Data */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Extracted Data
            </h2>

            {isProcessing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-spin" />
                <p className="text-slate-400">Processing document with AI...</p>
                <p className="text-sm text-slate-500 mt-1">This may take a few seconds</p>
              </div>
            )}

            {!isProcessing && !extractedData && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No data extracted yet</p>
                <p className="text-sm text-slate-500 mt-1">Upload a document to begin extraction</p>
              </div>
            )}

            {extractedData && (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* Confidence Score */}
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Extraction Complete</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {(extractedData.confidence * 100).toFixed(1)}% Confidence
                  </Badge>
                </div>

                {/* W-9 Form Data */}
                {extractedData.documentType === "w9" && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white text-sm">Contractor Information</h3>
                    <div>
                      <label className="text-xs font-medium text-slate-400">Name</label>
                      <Input
                        value={extractedData.name || ""}
                        readOnly
                        className="mt-1 bg-slate-950 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">Business Name</label>
                      <Input
                        value={extractedData.businessName || ""}
                        readOnly
                        className="mt-1 bg-slate-950 border-slate-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-400">Tax Classification</label>
                        <Input
                          value={extractedData.taxClassification || ""}
                          readOnly
                          className="mt-1 bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-400">TIN/SSN/EIN</label>
                        <Input
                          value={extractedData.tin || ""}
                          readOnly
                          className="mt-1 bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">Address</label>
                      <Input
                        value={extractedData.address || ""}
                        readOnly
                        className="mt-1 bg-slate-950 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Contract Analysis */}
                {analysisResults && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      Contract Analysis
                    </h3>

                    {/* Key Terms */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <p className="text-xs font-medium text-slate-400 mb-2">Key Terms</p>
                      <div className="space-y-2">
                        {analysisResults.keyTerms?.map((term: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-slate-300">{term.name}</span>
                            <span className="text-white font-medium">{term.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tax Implications */}
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <p className="text-xs font-medium text-orange-400 mb-2">Tax Implications</p>
                      <ul className="space-y-1 text-sm text-slate-300">
                        {analysisResults.taxImplications?.map((implication: string, index: number) => (
                          <li key={index}>• {implication}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk Indicators */}
                    {analysisResults.riskIndicators && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs font-medium text-red-400 mb-2">Risk Indicators</p>
                        <div className="space-y-1">
                          {analysisResults.riskIndicators.map((risk: any, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300">{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Processing Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <FileSearch className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">W-9 Extraction</h3>
                <p className="text-sm text-slate-400">Auto-extract contractor info</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Multi-Page Processing</h3>
                <p className="text-sm text-slate-400">Handle complex documents</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all cursor-pointer backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Contract Analysis</h3>
                <p className="text-sm text-slate-400">Identify tax implications</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
