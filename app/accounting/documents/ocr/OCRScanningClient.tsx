"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Upload, FileText, CheckCircle, Loader2 } from "lucide-react"

export default function OCRScanningClient() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    // Simulate OCR processing
    setTimeout(() => {
      setExtractedData({
        documentType: "Invoice",
        vendor: "Acme Corporation",
        invoiceNumber: "INV-2024-001",
        date: "2024-01-15",
        amount: "$2,450.00",
        lineItems: [
          { description: "Professional Services", quantity: 10, rate: 200, amount: 2000 },
          { description: "Travel Expenses", quantity: 1, rate: 450, amount: 450 },
        ],
        confidence: 98,
      })
      setIsProcessing(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
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
              OCR Document Scanning
            </h1>
            <p className="text-slate-600 mt-1">Extract text and data from documents using AI-powered OCR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">Drag and drop or click to upload</p>
              <label htmlFor="ocr-upload">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  asChild
                >
                  <span>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Select Document
                      </>
                    )}
                  </span>
                </Button>
                <input
                  id="ocr-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </label>
            </div>

            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-sm text-slate-700">Supported Formats</h3>
              <div className="flex flex-wrap gap-2">
                {["PDF", "JPG", "PNG", "TIFF", "HEIC"].map((format) => (
                  <Badge key={format} variant="secondary">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
            {!extractedData && !isProcessing && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No data extracted yet</p>
                <p className="text-sm text-slate-400 mt-1">Upload a document to begin</p>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-3 animate-spin" />
                <p className="text-slate-600">Processing document...</p>
                <p className="text-sm text-slate-400 mt-1">This may take a few seconds</p>
              </div>
            )}

            {extractedData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">OCR Complete</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{extractedData.confidence}% Confidence</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Document Type</label>
                    <Input value={extractedData.documentType} readOnly className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Vendor/Supplier</label>
                    <Input value={extractedData.vendor} readOnly className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Invoice Number</label>
                      <Input value={extractedData.invoiceNumber} readOnly className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Date</label>
                      <Input value={extractedData.date} readOnly className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Total Amount</label>
                    <Input value={extractedData.amount} readOnly className="mt-1 text-lg font-semibold" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-sm mb-3">Line Items</h3>
                  <div className="space-y-2">
                    {extractedData.lineItems.map((item: any, index: number) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.quantity} x ${item.rate} = ${item.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600">Create Bill</Button>
                  <Button variant="outline">Edit Data</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
