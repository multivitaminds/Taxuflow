"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Copy, Check } from "lucide-react"

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState("sk_test_...")
  const [endpoint, setEndpoint] = useState("/v1/tax/calculate-refund")
  const [method, setMethod] = useState("POST")
  const [requestBody, setRequestBody] = useState(`{
  "filingStatus": "single",
  "income": 75000,
  "deductions": {
    "standard": true
  },
  "year": 2024
}`)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const endpoints = [
    { value: "/v1/tax/calculate-refund", label: "Calculate Refund", method: "POST" },
    { value: "/v1/documents/upload", label: "Upload Document", method: "POST" },
    { value: "/v1/documents/:id", label: "Get Document", method: "GET" },
    { value: "/v1/accounting/invoices", label: "List Invoices", method: "GET" },
    { value: "/v1/ai/chat", label: "AI Chat", method: "POST" },
  ]

  const handleRun = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResponse(
        JSON.stringify(
          {
            success: true,
            data: {
              estimatedRefund: 2450,
              federalRefund: 1800,
              stateRefund: 650,
              effectiveTaxRate: 0.18,
              breakdown: {
                totalIncome: 75000,
                standardDeduction: 14600,
                taxableIncome: 60400,
                totalTax: 8650,
                withheld: 11100,
              },
            },
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      )
      setLoading(false)
    }, 1500)
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">API Playground</h1>
          <p className="text-xl text-gray-400">Test Taxu APIs interactively with live requests and responses</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="space-y-6">
            <Card className="bg-[#111] border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Request</h2>

              {/* API Key */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm"
                  placeholder="sk_test_..."
                />
              </div>

              {/* Endpoint */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Endpoint</label>
                <select
                  value={endpoint}
                  onChange={(e) => {
                    setEndpoint(e.target.value)
                    const selected = endpoints.find((ep) => ep.value === e.target.value)
                    if (selected) setMethod(selected.method)
                  }}
                  className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white"
                >
                  {endpoints.map((ep) => (
                    <option key={ep.value} value={ep.value}>
                      {ep.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Method</label>
                <div className="flex gap-2">
                  {["GET", "POST", "PUT", "DELETE"].map((m) => (
                    <Button
                      key={m}
                      variant={method === m ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMethod(m)}
                      className={method === m ? "bg-[#635BFF]" : "border-gray-700"}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Request Body */}
              {(method === "POST" || method === "PUT") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Request Body</label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm h-64"
                  />
                </div>
              )}

              {/* Run Button */}
              <Button
                onClick={handleRun}
                disabled={loading}
                className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? "Running..." : "Run Request"}
              </Button>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card className="bg-[#111] border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Response</h2>
                {response && (
                  <Button size="sm" variant="ghost" onClick={copyResponse} className="text-gray-400">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {response ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">200 OK</span>
                    <span className="text-xs text-gray-500">1.2s</span>
                  </div>
                  <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-sm overflow-x-auto max-h-[600px]">
                    {response}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Run a request to see the response
                </div>
              )}
            </Card>

            {/* Code Generation */}
            {response && (
              <Card className="bg-[#111] border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Generate Code</h3>
                <Tabs defaultValue="nodejs">
                  <TabsList className="bg-black/50">
                    <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="nodejs">
                    <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-xs overflow-x-auto">
                      {`const taxu = require('@taxu/node');

const client = new taxu('${apiKey}');

const result = await client.tax.calculateRefund(${requestBody});

console.log(result);`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="python">
                    <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-xs overflow-x-auto">
                      {`import taxu

client = taxu.Client('${apiKey}')

result = client.tax.calculate_refund(${requestBody})

print(result)`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="curl">
                    <pre className="bg-black/50 rounded p-4 text-gray-300 font-mono text-xs overflow-x-auto">
                      {`curl -X ${method} https://api.taxu.io${endpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody}'`}
                    </pre>
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
