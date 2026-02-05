"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Download, BookOpen, Zap } from "lucide-react"
import Link from "next/link"

export default function ReactSDKPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#61DAFB]/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-[#61DAFB]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">React SDK</h1>
              <p className="text-gray-400 mt-1">Official Taxu React library with hooks</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#635BFF] hover:bg-[#0A2540] text-white">
              <Download className="w-4 h-4 mr-2" />
              Install via npm
            </Button>
            <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-900 bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Installation</h2>
          <Card className="bg-[#111111] border-gray-800 p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">npm</p>
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">npm install @taxu/react</code>
                </pre>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">yarn</p>
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">yarn add @taxu/react</code>
                </pre>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
          <Card className="bg-[#111111] border-gray-800 p-6">
            <pre className="bg-black p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-gray-300">{`import { TaxuProvider, useTaxu } from '@taxu/react'

function App() {
  return (
    <TaxuProvider apiKey="your_api_key_here">
      <TaxCalculator />
    </TaxuProvider>
  )
}

function TaxCalculator() {
  const { calculateRefund, loading } = useTaxu()
  
  const handleCalculate = async () => {
    const result = await calculateRefund({
      income: 75000,
      filingStatus: 'single'
    })
    console.log(result)
  }
  
  return (
    <button onClick={handleCalculate} disabled={loading}>
      Calculate Refund
    </button>
  )
}`}</code>
            </pre>
          </Card>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: "React Hooks", desc: "Custom hooks for all API operations" },
              { icon: Code, title: "TypeScript", desc: "Full TypeScript support" },
              { icon: BookOpen, title: "Components", desc: "Pre-built UI components" },
              { icon: Download, title: "Next.js Ready", desc: "Works with Next.js and SSR" },
            ].map((feature, i) => (
              <Card key={i} className="bg-[#111111] border-gray-800 p-6">
                <feature.icon className="w-8 h-8 text-[#635BFF] mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Hooks Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Hooks Reference</h2>
          <div className="space-y-4">
            <Card className="bg-[#111111] border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">useTaxu</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm text-gray-300">{`const { calculateRefund, uploadDocument, loading, error } = useTaxu()`}</code>
              </pre>
            </Card>

            <Card className="bg-[#111111] border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">useDocumentUpload</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm text-gray-300">{`const { upload, progress, status } = useDocumentUpload()`}</code>
              </pre>
            </Card>

            <Card className="bg-[#111111] border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">useRefundCalculator</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm text-gray-300">{`const { calculate, result, loading } = useRefundCalculator()`}</code>
              </pre>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/developer/docs/api/documents">
              <Card className="bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                <p className="text-gray-400 text-sm">Explore all available endpoints</p>
              </Card>
            </Link>
            <Link href="/developer/examples">
              <Card className="bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
                <p className="text-gray-400 text-sm">See real-world implementations</p>
              </Card>
            </Link>
            <Link href="/developer/support">
              <Card className="bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Get Help</h3>
                <p className="text-gray-400 text-sm">Contact our support team</p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
