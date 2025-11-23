"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  CheckCircle2,
  Terminal,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
  Server,
  FileJson,
  Activity,
} from "lucide-react"
import { useState } from "react"

export default function SandboxPage() {
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  const sandboxApiKey = "sk_test_1234567890abcdef"
  const sandboxUrl = "https://sandbox.api.taxu.io/v1"

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
              Sandbox Mode
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-[#0a2540] mb-4">Sandbox Environment</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Test your integration safely with mock data. The sandbox environment mimics production behavior but
            processes no real data and charges no cards.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Configuration Section */}
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 shadow-sm border-gray-200">
            <h2 className="text-lg font-bold text-[#0a2540] mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-[#635bff]" />
              Configuration
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sandbox API Key</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      readOnly
                      value={sandboxApiKey}
                      className="font-mono bg-gray-50 text-gray-600 pr-10 border-gray-200"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(sandboxApiKey, setCopiedKey)}
                    className="border-gray-200 text-gray-600 hover:text-[#635bff] hover:border-[#635bff]"
                  >
                    {copiedKey ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy API Key</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Use this key for all requests to the sandbox environment.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                <div className="flex gap-2">
                  <Input readOnly value={sandboxUrl} className="font-mono bg-gray-50 text-gray-600 border-gray-200" />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(sandboxUrl, setCopiedUrl)}
                    className="border-gray-200 text-gray-600 hover:text-[#635bff] hover:border-[#635bff]"
                  >
                    {copiedUrl ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy URL</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm border-gray-200 bg-gradient-to-br from-white to-gray-50">
            <h2 className="text-lg font-bold text-[#0a2540] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#635bff]" />
              Limitations
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <RefreshCw className="w-5 h-5 text-gray-400 shrink-0" />
                <span>Data resets automatically every 24 hours at 00:00 UTC.</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <Activity className="w-5 h-5 text-gray-400 shrink-0" />
                <span>Rate limited to 100 requests per minute (same as production).</span>
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <FileJson className="w-5 h-5 text-gray-400 shrink-0" />
                <span>Webhooks are logged but not delivered to external endpoints.</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* Test Data Section */}
        <section>
          <h2 className="text-2xl font-bold text-[#0a2540] mb-6">Test Data & Scenarios</h2>

          <Tabs defaultValue="w2" className="w-full">
            <TabsList className="bg-white border border-gray-200 p-1 mb-6">
              <TabsTrigger value="w2" className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white">
                W-2 Data
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white"
              >
                Customers
              </TabsTrigger>
              <TabsTrigger value="errors" className="data-[state=active]:bg-[#635bff] data-[state=active]:text-white">
                Error Scenarios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="w2">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Sample W-2 Input</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Employer Name</span>
                      <span className="font-mono text-gray-900">Test Corporation</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">EIN</span>
                      <span className="font-mono text-gray-900">12-3456789</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Employee</span>
                      <span className="font-mono text-gray-900">Test User</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Wages</span>
                      <span className="font-mono text-gray-900">$75,000.00</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Federal Tax</span>
                      <span className="font-mono text-gray-900">$12,500.00</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-0 border-gray-200 bg-[#0d1117] overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Response Preview</span>
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-400/30 bg-green-400/10 text-[10px] h-5"
                    >
                      200 OK
                    </Badge>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-[#e6edf3]">
                      <code>{String.raw`{
  "id": "doc_test_123",
  "status": "completed",
  "document_type": "w2",
  "ai_confidence": 0.98,
  "extracted_data": {
    "employer_name": "Test Corporation",
    "wages": 75000.00,
    "federal_tax_withheld": 12500.00,
    "tax_year": 2024
  }
}`}</code>
                    </pre>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customers">
              <Card className="border-gray-200">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <h3 className="font-semibold text-gray-900">Valid Customer</h3>
                    </div>
                    <code className="block bg-gray-100 p-2 rounded text-sm font-mono text-gray-800 mb-2">
                      cust_test_valid
                    </code>
                    <p className="text-sm text-gray-500">Returns a standard customer object with no active issues.</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <h3 className="font-semibold text-gray-900">With Invoices</h3>
                    </div>
                    <code className="block bg-gray-100 p-2 rounded text-sm font-mono text-gray-800 mb-2">
                      cust_test_invoices
                    </code>
                    <p className="text-sm text-gray-500">Returns a customer with 5 associated test invoices.</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <h3 className="font-semibold text-gray-900">Invalid ID</h3>
                    </div>
                    <code className="block bg-gray-100 p-2 rounded text-sm font-mono text-gray-800 mb-2">
                      cust_test_invalid
                    </code>
                    <p className="text-sm text-gray-500">Triggers a 404 Not Found error response.</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="errors">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    code: "-1",
                    label: "Negative Amount",
                    desc: "Triggers a validation error (400 Bad Request)",
                    bg: "bg-orange-50",
                    border: "border-orange-200",
                  },
                  {
                    code: "sk_test_expired",
                    label: "Expired Key",
                    desc: "Triggers an authentication error (401 Unauthorized)",
                    bg: "bg-red-50",
                    border: "border-red-200",
                  },
                  {
                    code: "server_error",
                    label: "Server Error",
                    desc: "Triggers a simulated server error (500 Internal Error)",
                    bg: "bg-gray-100",
                    border: "border-gray-200",
                  },
                ].map((item, i) => (
                  <Card key={i} className={`p-6 border ${item.border} ${item.bg}`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                    </div>
                    <code className="block bg-white/50 p-2 rounded text-sm font-mono mb-3 border border-gray-200/50">
                      {item.code}
                    </code>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Quick Test Terminal */}
        <section>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#161b22]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-300">Quick Test</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm font-mono leading-relaxed text-[#e6edf3]">
                <span className="text-[#8b949e] select-none">$ </span>
                <span className="text-[#ff7b72]">curl</span> https://sandbox.api.taxu.io/v1/tax/calculate \{"\n"}
                {"  "}-H{" "}
                <span className="text-[#a5d6ff]">&quot;Authorization: Bearer sk_test_1234567890abcdef&quot;</span> \
                {"\n"}
                {"  "}-H <span className="text-[#a5d6ff]">&quot;Content-Type: application/json&quot;</span> \{"\n"}
                {"  "}-d{" "}
                <span className="text-[#a5d6ff]">
                  &apos;{"{"}
                  {"\n"}
                  {"    "}&quot;income&quot;: 75000,{"\n"}
                  {"    "}&quot;federal_withheld&quot;: 12500{"\n"}
                  {"  "}
                  {"}"}&apos;
                </span>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
