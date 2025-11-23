"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function RubySDKPage() {
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
            <span className="text-5xl">💎</span>
            <div>
              <h1 className="text-4xl font-bold text-white">Ruby SDK</h1>
              <p className="text-gray-500">v2.1.0</p>
            </div>
          </div>
          <p className="text-xl text-gray-400">Official Ruby SDK for Rails applications and Ruby scripts</p>
        </div>

        {/* Installation */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 mb-2">Add to your Gemfile:</p>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  gem 'taxu'
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("gem 'taxu'", 0)}
                >
                  {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Or install directly:</p>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  gem install taxu
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode("gem install taxu", 1)}
                >
                  {copiedIndex === 1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
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
                  {`require 'taxu'

Taxu.api_key = ENV['TAXU_API_KEY']`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload a Document</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`uploaded = Taxu::Document.upload(
  file: File.open('w2.pdf'),
  type: 'w2',
  year: 2024
)

puts "Document ID: #{uploaded.id}"`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Calculate Tax Refund</h3>
              <div className="relative">
                <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto">
                  {`refund = Taxu::Tax.calculate_refund(
  filing_status: 'single',
  income: 75000,
  deductions: { standard: true },
  year: 2024
)

puts "Estimated Refund: $#{refund.amount}"`}
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
              <h3 className="font-semibold text-white mb-2">Rails Integration</h3>
              <p className="text-sm text-gray-400">Seamless Rails ActiveRecord support</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Idiomatic Ruby</h3>
              <p className="text-sm text-gray-400">Follows Ruby conventions and style</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Thread-Safe</h3>
              <p className="text-sm text-gray-400">Safe for concurrent requests</p>
            </div>
            <div className="p-4 bg-black/30 rounded">
              <h3 className="font-semibold text-white mb-2">Enumerable Support</h3>
              <p className="text-sm text-gray-400">Works with Ruby enumerables</p>
            </div>
          </div>
        </Card>

        {/* API Reference */}
        <Card className="bg-[#111] border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">API Reference</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-mono text-[#635BFF] mb-2">Taxu::Document.upload(params)</h3>
              <p className="text-gray-400 text-sm mb-2">Upload a tax document for processing</p>
              <div className="bg-black/30 rounded p-3 text-sm">
                <p className="text-gray-500 mb-1">Parameters:</p>
                <ul className="list-disc list-inside text-gray-400 space-y-1">
                  <li>
                    <code className="text-[#635BFF]">file</code> - File object
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
              <h3 className="font-mono text-[#635BFF] mb-2">Taxu::Tax.calculate_refund(params)</h3>
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
              <h3 className="font-mono text-[#635BFF] mb-2">Taxu::Webhook.verify(payload, signature, secret)</h3>
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
