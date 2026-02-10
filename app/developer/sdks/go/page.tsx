"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function GoSDKPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🔷</span>
            <div>
              <h1 className="text-4xl font-bold text-white">Go SDK</h1>
              <p className="text-gray-500">v2.1.0</p>
            </div>
          </div>
          <p className="text-xl text-gray-400">Official Go SDK for high-performance server applications</p>
        </div>

        {/* Installation */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
          <div className="relative">
            <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
              go get github.com/multivitaminds/taxu-go
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() => copyCode("go get github.com/multivitaminds/taxu-go", 0)}
            >
              {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </Card>

        {/* Quick Start */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Initialize the Client</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`package main

import (
    "os"
    "github.com/multivitaminds/taxu-go"
)

func main() {
    client := taxu.NewClient(os.Getenv("TAXU_API_KEY"))
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload a Document</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`file, err := os.Open("w2.pdf")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

uploaded, err := client.Documents.Upload(&taxu.DocumentUploadParams{
    File: file,
    Type: "w2",
    Year: 2024,
})

fmt.Printf("Document ID: %s\\n", uploaded.ID)`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Calculate Tax Refund</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`refund, err := client.Tax.CalculateRefund(&taxu.RefundParams{
    FilingStatus: "single",
    Income:       75000,
    Deductions: &taxu.Deductions{
        Standard: true,
    },
    Year: 2024,
})

fmt.Printf("Estimated Refund: $%.2f\\n", refund.Amount)`}
                </pre>
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Type Safety</h3>
              <p className="text-sm text-gray-400">Strong typing with Go structs</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Context Support</h3>
              <p className="text-sm text-gray-400">Built-in context.Context for cancellation</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Zero Dependencies</h3>
              <p className="text-sm text-gray-400">Only uses Go standard library</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Concurrent-Safe</h3>
              <p className="text-sm text-gray-400">Safe for goroutine usage</p>
            </div>
          </div>
        </Card>

        {/* API Reference */}
        <Card className="bg-[#111] border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">client.Documents.Upload(params)</h3>
              <p className="text-gray-400 text-sm mb-2">Upload a tax document for processing</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">File</code> - io.Reader interface
                  </li>
                  <li>
                    <code className="text-[#635BFF]">Type</code> - Document type (w2, 1099, etc.)
                  </li>
                  <li>
                    <code className="text-[#635BFF]">Year</code> - Tax year
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">client.Tax.CalculateRefund(params)</h3>
              <p className="text-gray-400 text-sm mb-2">Calculate estimated tax refund</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">FilingStatus</code> - Filing status
                  </li>
                  <li>
                    <code className="text-[#635BFF]">Income</code> - Total income
                  </li>
                  <li>
                    <code className="text-[#635BFF]">Deductions</code> - Deduction details
                  </li>
                  <li>
                    <code className="text-[#635BFF]">Year</code> - Tax year
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">client.Webhooks.Verify(payload, signature, secret)</h3>
              <p className="text-gray-400 text-sm mb-2">Verify webhook signature</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">payload</code> - Webhook payload bytes
                  </li>
                  <li>
                    <code className="text-[#635BFF]">signature</code> - X-Taxu-Signature header
                  </li>
                  <li>
                    <code className="text-[#635BFF]">secret</code> - Webhook secret
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
