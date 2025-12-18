"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Copy, Check, Code2, Sparkles } from "lucide-react"

export default function APIExplorer() {
  const [selectedLanguage, setSelectedLanguage] = useState("nodejs")
  const [selectedPlatform, setSelectedPlatform] = useState("tax-filing")
  const [selectedEndpoint, setSelectedEndpoint] = useState("/v1/tax/calculate-refund")
  const [requestBody, setRequestBody] = useState(`{
  "income": 75000,
  "filingStatus": "single",
  "deductions": {
    "standard": true
  },
  "year": 2024
}`)
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const languages = [
    { id: "nodejs", name: "Node.js", icon: "📦" },
    { id: "python", name: "Python", icon: "🐍" },
    { id: "ruby", name: "Ruby", icon: "💎" },
    { id: "php", name: "PHP", icon: "🐘" },
    { id: "go", name: "Go", icon: "🔷" },
    { id: "java", name: "Java", icon: "☕" },
    { id: "dotnet", name: ".NET", icon: "🔵" },
    { id: "curl", name: "cURL", icon: "🌐" },
  ]

  const platforms = [
    { id: "tax-filing", name: "Tax Filing", color: "bg-purple-500" },
    { id: "neobank", name: "Neobank", color: "bg-blue-500" },
    { id: "investment", name: "Investment", color: "bg-green-500" },
    { id: "accounting", name: "Accounting", color: "bg-orange-500" },
  ]

  const endpoints: Record<string, Array<{ path: string; method: string; description: string }>> = {
    "tax-filing": [
      { path: "/v1/tax/calculate-refund", method: "POST", description: "Calculate tax refund estimate" },
      { path: "/v1/tax/file-1099", method: "POST", description: "File 1099 forms electronically" },
      { path: "/v1/tax/file-w2", method: "POST", description: "File W-2 forms electronically" },
      { path: "/v1/tax/form-941", method: "POST", description: "File quarterly Form 941" },
      { path: "/v1/documents/upload", method: "POST", description: "Upload tax documents" },
      { path: "/v1/documents/{id}/extract", method: "GET", description: "Extract data from document" },
    ],
    neobank: [
      { path: "/v1/accounts/create", method: "POST", description: "Create bank account" },
      { path: "/v1/accounts/{id}/balance", method: "GET", description: "Get account balance" },
      { path: "/v1/transfers/initiate", method: "POST", description: "Initiate money transfer" },
      { path: "/v1/cards/issue", method: "POST", description: "Issue debit/credit card" },
      { path: "/v1/transactions/list", method: "GET", description: "List transactions" },
    ],
    investment: [
      { path: "/v1/portfolio/create", method: "POST", description: "Create investment portfolio" },
      { path: "/v1/trades/execute", method: "POST", description: "Execute trade order" },
      { path: "/v1/stocks/{symbol}/quote", method: "GET", description: "Get stock quote" },
      { path: "/v1/portfolio/{id}/performance", method: "GET", description: "Get portfolio performance" },
      { path: "/v1/dividends/history", method: "GET", description: "Get dividend history" },
    ],
    accounting: [
      { path: "/v1/invoices/create", method: "POST", description: "Create invoice" },
      { path: "/v1/expenses/track", method: "POST", description: "Track expense" },
      { path: "/v1/reports/profit-loss", method: "GET", description: "Generate P&L report" },
      { path: "/v1/customers/create", method: "POST", description: "Create customer" },
      { path: "/v1/integrations/quickbooks/sync", method: "POST", description: "Sync with QuickBooks" },
    ],
  }

  const getCodeExample = () => {
    const examples: Record<string, string> = {
      nodejs: `const taxu = require('@taxu/node');

const client = new taxu.Taxu('${process.env.TAXU_API_KEY || "your_api_key"}');

const result = await client.tax.calculateRefund(${requestBody});

console.log(result);`,
      python: `import taxu

client = taxu.Client('${process.env.TAXU_API_KEY || "your_api_key"}')

result = client.tax.calculate_refund(${requestBody})

print(result)`,
      ruby: `require 'taxu'

client = Taxu::Client.new('${process.env.TAXU_API_KEY || "your_api_key"}')

result = client.tax.calculate_refund(${requestBody})

puts result`,
      php: `<?php
require_once('vendor/autoload.php');

$taxu = new \\Taxu\\TaxuClient('${process.env.TAXU_API_KEY || "your_api_key"}');

$result = $taxu->tax->calculateRefund(${requestBody});

print_r($result);`,
      go: `package main

import (
    "fmt"
    "github.com/taxu/taxu-go"
)

func main() {
    client := taxu.New("${process.env.TAXU_API_KEY || "your_api_key"}")
    
    result, _ := client.Tax.CalculateRefund(${requestBody})
    
    fmt.Println(result)
}`,
      java: `import com.taxu.Taxu;
import com.taxu.model.TaxCalculation;

public class Main {
    public static void main(String[] args) {
        Taxu taxu = new Taxu("${process.env.TAXU_API_KEY || "your_api_key"}");
        
        TaxCalculation result = taxu.tax()
            .calculateRefund(${requestBody});
        
        System.out.println(result);
    }
}`,
      dotnet: `using Taxu;

var client = new TaxuClient("${process.env.TAXU_API_KEY || "your_api_key"}");

var result = await client.Tax.CalculateRefundAsync(${requestBody});

Console.WriteLine(result);`,
      curl: `curl -X POST https://api.taxu.io${selectedEndpoint} \\
  -H "Authorization: Bearer ${process.env.TAXU_API_KEY || "your_api_key"}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n/g, " ").replace(/\s+/g, " ")}'`,
    }
    return examples[selectedLanguage] || examples.nodejs
  }

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
              effectiveTaxRate: 0.1867,
              breakdown: {
                totalIncome: 75000,
                standardDeduction: 14600,
                taxableIncome: 60400,
                totalTax: 8650,
                withheld: 11100,
              },
            },
            requestId: "req_" + Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      )
      setLoading(false)
    }, 1500)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(getCodeExample())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      {/* Header */}
      <div className="gradient-stripe-hero text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[#00d4ff]" />
            <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
              Interactive
            </Badge>
          </div>
          <h1 className="text-5xl font-bold mb-4">API Explorer</h1>
          <p className="text-xl text-white/80 max-w-3xl leading-relaxed">
            Test Taxu APIs interactively with real-time code examples in 8 programming languages. Explore all four
            platforms: Tax Filing, Neobank, Investment, and Accounting.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 -mt-10">
        {/* Platform Selector */}
        <Card className="p-6 mb-6 bg-white shadow-lg">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Select Platform</h3>
          <div className="flex flex-wrap gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id)
                  setSelectedEndpoint(endpoints[platform.id][0].path)
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedPlatform === platform.id
                    ? `${platform.color} text-white shadow-lg scale-105`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="space-y-6">
            {/* Endpoint Selector */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Select Endpoint</h3>
              <div className="space-y-2">
                {endpoints[selectedPlatform].map((endpoint) => (
                  <button
                    key={endpoint.path}
                    onClick={() => setSelectedEndpoint(endpoint.path)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedEndpoint === endpoint.path
                        ? "border-[#635bff] bg-[#635bff]/5 shadow-sm"
                        : "border-slate-200 hover:border-[#635bff]/50 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <Badge
                        variant="outline"
                        className={`${
                          endpoint.method === "GET"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        }`}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono text-slate-700">{endpoint.path}</code>
                    </div>
                    <p className="text-xs text-slate-500 ml-16">{endpoint.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Request Body */}
            {selectedEndpoint.includes("POST") && (
              <Card className="p-6 bg-white shadow-md">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Request Body</h3>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full h-64 p-4 font-mono text-sm bg-slate-900 text-slate-100 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#635bff]"
                />
              </Card>
            )}

            {/* Language Selector */}
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Choose Language</h3>
              <div className="grid grid-cols-4 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedLanguage === lang.id
                        ? "border-[#635bff] bg-[#635bff] text-white shadow-lg"
                        : "border-slate-200 bg-white hover:border-[#635bff] hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{lang.icon}</div>
                    <div className="text-xs font-semibold">{lang.name}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Code Example */}
            <Card className="p-0 overflow-hidden bg-slate-900 shadow-xl">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Code Example</span>
                </div>
                <Button size="sm" variant="ghost" onClick={copyCode} className="text-slate-300 hover:text-white h-8">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
                <code className="text-slate-100">{getCodeExample()}</code>
              </pre>
            </Card>

            {/* Run Button */}
            <Button
              onClick={handleRun}
              disabled={loading}
              className="w-full h-12 bg-[#635bff] hover:bg-[#5046e5] text-white shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {loading ? "Running..." : "Run Request"}
            </Button>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Response</h3>
                {response && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200">200 OK</Badge>
                    <span className="text-xs text-slate-500">1.2s</span>
                  </div>
                )}
              </div>

              {response ? (
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto max-h-[600px]">
                  <pre className="text-sm text-slate-100 leading-relaxed">
                    <code>{response}</code>
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  <Play className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">Run a request to see the response</p>
                </div>
              )}
            </Card>

            {/* Response Headers */}
            {response && (
              <Card className="p-6 bg-white shadow-md">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Response Headers</h3>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">content-type</span>
                    <span className="text-slate-700">application/json</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">x-request-id</span>
                    <span className="text-slate-700">req_{Math.random().toString(36).substr(2, 9)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">x-ratelimit-remaining</span>
                    <span className="text-slate-700">998</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">x-response-time</span>
                    <span className="text-slate-700">1.2s</span>
                  </div>
                </div>
              </Card>
            )}

            {/* API Info */}
            <Card className="p-6 bg-gradient-to-br from-[#635bff] to-[#5046e5] text-white shadow-xl">
              <h3 className="text-lg font-bold mb-2">Need an API Key?</h3>
              <p className="text-white/90 mb-4 text-sm">Get started with a free API key and explore all endpoints</p>
              <Button variant="secondary" className="w-full bg-white text-[#635bff] hover:bg-white/90">
                Get API Key
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
