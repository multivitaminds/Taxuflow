"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, CheckCircle2, AlertCircle, Clock, X } from "lucide-react"
import { useState } from "react"

interface DocumentDetailModalProps {
  document: any
  isOpen: boolean
  onClose: () => void
}

export function DocumentDetailModal({ document, isOpen, onClose }: DocumentDetailModalProps) {
  const [downloading, setDownloading] = useState(false)

  if (!document) return null

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      w2: "Form W-2 (Wage and Tax Statement)",
      w2c: "Form W-2c (Corrected Wage and Tax Statement)",
      "1099-nec": "Form 1099-NEC (Nonemployee Compensation)",
      "1099-misc": "Form 1099-MISC (Miscellaneous Income)",
      "1098": "Form 1098 (Mortgage Interest Statement)",
      "medical-expenses": "Medical Expense Records",
      "charitable-donations": "Charitable Donation Records",
      "business-receipts": "Business Receipts",
      k1: "Schedule K-1 (Partnership Income)",
      "income-statement": "Income Statement",
    }
    return labels[type] || "Tax Document"
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      // Download original document
      const response = await fetch(`/api/documents/${document.id}/download`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = document.file_name
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Download error:", error)
    } finally {
      setDownloading(false)
    }
  }

  const extractedData = document.extracted_data || {}
  const processingStatus = document.processing_status || "pending"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{document.file_name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Document Type</p>
                <Badge variant="outline" className="text-neon border-neon/50">
                  {document.ai_document_type ? getDocumentTypeLabel(document.ai_document_type) : "Processing..."}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {processingStatus === "completed" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Processed</span>
                    </>
                  ) : processingStatus === "failed" ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Failed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-500">Processing</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">File Size</p>
                <p className="font-medium">{(document.file_size / 1024).toFixed(1)} KB</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Uploaded</p>
                <p className="font-medium">{new Date(document.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* AI Confidence */}
          {document.ai_confidence_score && (
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h3 className="font-semibold mb-3">AI Extraction Confidence</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon to-green-500 transition-all"
                      style={{ width: `${document.ai_confidence_score * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold text-neon">{(document.ai_confidence_score * 100).toFixed(0)}%</span>
              </div>
            </Card>
          )}

          {/* Extracted Data */}
          {Object.keys(extractedData).length > 0 && (
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h3 className="font-semibold mb-4">Extracted Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key} className="p-3 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1 capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="font-medium">{typeof value === "object" ? JSON.stringify(value) : String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* AI Suggestions */}
          {document.ai_suggestions && document.ai_suggestions.length > 0 && (
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur">
              <h3 className="font-semibold mb-4">AI Suggestions</h3>
              <div className="space-y-2">
                {document.ai_suggestions.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-neon flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleDownload} disabled={downloading} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              {downloading ? "Downloading..." : "Download Original"}
            </Button>
            {document.ai_document_type === "w2" &&
              document.tax_year &&
              document.tax_year < new Date().getFullYear() && (
                <Button variant="outline" className="flex-1 border-neon/50 text-neon hover:bg-neon/10 bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Penalty Letter ($39)
                </Button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
