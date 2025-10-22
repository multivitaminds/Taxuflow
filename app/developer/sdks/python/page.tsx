"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

const INIT_CODE = `import taxu
import os

client = taxu.Client(
    api_key=os.environ.get('TAXU_API_KEY')
)`

const UPLOAD_CODE = `with open('w2.pdf', 'rb') as file:
    uploaded = client.documents.upload(
        file=file,
        type='w2',
        year=2024
    )

print(f'Document ID: {uploaded.id}')`

const REFUND_CODE = `# Calculate and print tax refund
print(client.tax.calculate_refund(
    filing_status='single',
    income=75000,
    deductions={'standard': True},
    year=2024
).amount)`

export default function PythonSDKPage() {
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
            <span className="text-5xl">🐍</span>
            <div>
              <h1 className="text-4xl font-bold text-white">Python SDK</h1>
              <p className="text-gray-500">v2.1.0</p>
            </div>
          </div>
          <p className="text-xl text-gray-400">
            Official Python SDK for server-side applications and data science workflows
          </p>
        </div>

        {/* Installation */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
          <Tabs defaultValue="pip" className="w-full">
            <TabsList className="bg-black/50">
              <TabsTrigger value="pip">pip</TabsTrigger>
              <TabsTrigger value="poetry">poetry</TabsTrigger>
              <TabsTrigger value="pipenv">pipenv</TabsTrigger>
            </TabsList>
            <TabsContent value="pip">
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  pip install taxu
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("pip install taxu", 0)}
                >
                  {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="poetry">
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  poetry add taxu
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("poetry add taxu", 1)}
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="pipenv">
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  pipenv install taxu
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("pipenv install taxu", 2)}
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
                  {INIT_CODE}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload a Document</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {UPLOAD_CODE}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Calculate Tax Refund</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {REFUND_CODE}
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
              <h3 className="font-semibold text-white mb-2">Type Hints</h3>
              <p className="text-sm text-gray-400">Full type annotations for IDE support</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Async Support</h3>
              <p className="text-sm text-gray-400">Built-in asyncio compatibility</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Pandas Integration</h3>
              <p className="text-sm text-gray-400">Export data to DataFrames</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Context Managers</h3>
              <p className="text-sm text-gray-400">Pythonic resource management</p>
            </div>
          </div>
        </Card>

        {/* API Reference */}
        <Card className="bg-[#111] border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">client.documents.upload(**kwargs)</h3>
              <p className="text-gray-400 text-sm mb-2">Upload a tax document for processing</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">file</code> - File object or path
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
              <h3 className="font-mono text-[#635BFF] mb-2">client.tax.calculate_refund(**kwargs)</h3>
              <p className="text-gray-400 text-sm mb-2">Calculate estimated tax refund</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">filing_status</code> - Filing status
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
              <h3 className="font-mono text-[#635BFF] mb-2">client.webhooks.verify(payload, signature, secret)</h3>
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
