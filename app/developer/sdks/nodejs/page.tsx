"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function NodeJSSDKPage() {
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
            <span className="text-5xl">🟢</span>
            <div>
              <h1 className="text-4xl font-bold text-white">Node.js SDK</h1>
              <p className="text-gray-500">v2.1.0</p>
            </div>
          </div>
          <p className="text-xl text-gray-400">
            Official Node.js SDK for server-side JavaScript and TypeScript applications
          </p>
        </div>

        {/* Installation */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
          <Tabs defaultValue="npm" className="w-full">
            <TabsList className="bg-black/50">
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="yarn">yarn</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            </TabsList>
            <TabsContent value="npm">
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  npm install @taxu/node
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("npm install @taxu/node", 0)}
                >
                  {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="yarn">
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  yarn add @taxu/node
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("yarn add @taxu/node", 1)}
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="pnpm">
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  pnpm add @taxu/node
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("pnpm add @taxu/node", 2)}
                >
                  {copiedIndex === 2 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Quick Start */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Initialize the Client</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`const Taxu = require('@taxu/node');

const taxu = new Taxu({
  apiKey: process.env.TAXU_API_KEY
});`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload a Document</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`const fs = require('fs');

const uploadedDoc = await taxu.documents.upload({
  file: fs.createReadStream('./w2.pdf'),
  type: 'w2',
  year: 2024
});

console.log('Document ID:', uploadedDoc.id);`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Calculate Tax Refund</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`const refund = await taxu.tax.calculateRefund({
  filingStatus: 'single',
  income: 75000,
  deductions: {
    standard: true
  },
  year: 2024
});

console.log('Estimated Refund:', refund.amount);`}
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
              <h3 className="font-semibold text-white mb-2">TypeScript Support</h3>
              <p className="text-sm text-gray-400">Full type definitions included</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Automatic Retries</h3>
              <p className="text-sm text-gray-400">Built-in retry logic for failed requests</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Webhook Verification</h3>
              <p className="text-sm text-gray-400">HMAC signature validation helpers</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Promise-based API</h3>
              <p className="text-sm text-gray-400">Modern async/await support</p>
            </div>
          </div>
        </Card>

        {/* API Reference */}
        <Card className="bg-[#111] border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">taxu.documents.upload(params)</h3>
              <p className="text-gray-400 text-sm mb-2">Upload a tax document for processing</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">file</code> - File stream or buffer
                  </li>
                  <li>
                    <code className="text-[#635BFF]">type</code> - Document type (w2, 1099, etc.)
                  </li>
                  <li>
                    <code className="text-[#635BFF]">year</code> - Tax year
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">taxu.tax.calculateRefund(params)</h3>
              <p className="text-gray-400 text-sm mb-2">Calculate estimated tax refund</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">filingStatus</code> - Filing status
                  </li>
                  <li>
                    <code className="text-[#635BFF]">income</code> - Total income
                  </li>
                  <li>
                    <code className="text-[#635BFF]">deductions</code> - Deduction details
                  </li>
                  <li>
                    <code className="text-[#635BFF]">year</code> - Tax year
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">taxu.webhooks.verify(payload, signature, secret)</h3>
              <p className="text-gray-400 text-sm mb-2">Verify webhook signature</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">payload</code> - Webhook payload string
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
