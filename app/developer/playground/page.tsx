"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Copy, Check } from "lucide-react"
import Image from "next/image"

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">API Playground</h1>
          <p className="text-xl text-muted-foreground">Test Taxu APIs interactively with live requests and responses</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Request Panel */}
          <div className="space-y-6">
            <Card className="bg-card border-border p-6 shadow-lg">
              <h2 className="text-xl font-bold text-foreground mb-4">Request</h2>

              {/* API Key */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-foreground font-mono text-sm focus:ring-2 focus:ring-primary"
                  placeholder="sk_test_..."
                />
              </div>

              {/* Endpoint */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Endpoint</label>
                <select
                  value={endpoint}
                  onChange={(e) => {
                    setEndpoint(e.target.value)
                    const selected = endpoints.find((ep) => ep.value === e.target.value)
                    if (selected) setMethod(selected.method)
                  }}
                  className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-foreground focus:ring-2 focus:ring-primary"
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
                <label className="block text-sm font-medium text-muted-foreground mb-2">Method</label>
                <div className="flex gap-2">
                  {["GET", "POST", "PUT", "DELETE"].map((m) => (
                    <Button
                      key={m}
                      variant={method === m ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMethod(m)}
                      className={method === m ? "bg-primary text-primary-foreground" : "border-border hover:bg-muted"}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Request Body */}
              {(method === "POST" || method === "PUT") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Request Body</label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded px-3 py-2 text-foreground font-mono text-sm h-64 focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}

              {/* Run Button */}
              <Button
                onClick={handleRun}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-chart-1 hover:opacity-90 text-primary-foreground shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? "Running..." : "Run Request"}
              </Button>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card className="bg-card border-border p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Response</h2>
                {response && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyResponse}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {response ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded font-medium">200 OK</span>
                    <span className="text-xs text-muted-foreground">1.2s</span>
                  </div>
                  <pre className="bg-gradient-to-br from-muted/80 to-muted rounded-lg p-4 text-foreground font-mono text-sm overflow-x-auto max-h-[600px] border border-border shadow-inner">
                    {response}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Run a request to see the response
                </div>
              )}
            </Card>

            {/* Code Generation */}
            {response && (
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">Generate Code</h3>
                <Tabs defaultValue="nodejs">
                  <TabsList className="bg-muted flex-wrap h-auto">
                    <TabsTrigger value="nodejs" className="flex items-center gap-2">
                      <Image src="/icons/nodejs.png" alt="Node.js" width={16} height={16} className="w-4 h-4" />
                      Node.js
                    </TabsTrigger>
                    <TabsTrigger value="python" className="flex items-center gap-2">
                      <Image src="/icons/python.png" alt="Python" width={16} height={16} className="w-4 h-4" />
                      Python
                    </TabsTrigger>
                    <TabsTrigger value="ruby" className="flex items-center gap-2">
                      <Image src="/icons/ruby.png" alt="Ruby" width={16} height={16} className="w-4 h-4" />
                      Ruby
                    </TabsTrigger>
                    <TabsTrigger value="php" className="flex items-center gap-2">
                      <Image src="/icons/php.png" alt="PHP" width={16} height={16} className="w-4 h-4" />
                      PHP
                    </TabsTrigger>
                    <TabsTrigger value="go" className="flex items-center gap-2">
                      <Image src="/icons/go.png" alt="Go" width={16} height={16} className="w-4 h-4" />
                      Go
                    </TabsTrigger>
                    <TabsTrigger value="java" className="flex items-center gap-2">
                      <Image src="/icons/java.png" alt="Java" width={16} height={16} className="w-4 h-4" />
                      Java
                    </TabsTrigger>
                    <TabsTrigger value="dotnet" className="flex items-center gap-2">
                      <Image src="/icons/dotnet.png" alt=".NET" width={16} height={16} className="w-4 h-4" />
                      .NET
                    </TabsTrigger>
                    <TabsTrigger value="curl" className="flex items-center gap-2">
                      <Image src="/icons/curl.png" alt="cURL" width={16} height={16} className="w-4 h-4" />
                      cURL
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="nodejs">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-emerald-400 font-mono text-xs overflow-x-auto border border-primary/20 shadow-lg">
                      {`const taxu = require('@taxu/node');

const client = new taxu('${apiKey}');

const result = await client.tax.calculateRefund(${requestBody});

console.log(result);`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="python">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-cyan-400 font-mono text-xs overflow-x-auto border border-accent/20 shadow-lg">
                      {`import taxu

client = taxu.Client('${apiKey}')

result = client.tax.calculate_refund(${requestBody})

print(result)`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="ruby">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-red-400 font-mono text-xs overflow-x-auto border border-red-500/20 shadow-lg">
                      {`require 'taxu'

client = Taxu::Client.new('${apiKey}')

result = client.tax.calculate_refund(${requestBody})

puts result`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="php">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-purple-400 font-mono text-xs overflow-x-auto border border-purple-500/20 shadow-lg">
                      {`<?php
require 'vendor/autoload.php';

$client = new \\Taxu\\Client('${apiKey}');

$result = $client->tax->calculateRefund(${requestBody});

print_r($result);`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="go">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-cyan-300 font-mono text-xs overflow-x-auto border border-cyan-500/20 shadow-lg">
                      {`package main

import (
    "github.com/taxu/taxu-go"
    "fmt"
)

func main() {
    client := taxu.NewClient("${apiKey}")
    
    result, _ := client.Tax.CalculateRefund(${requestBody})
    
    fmt.Println(result)
}`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="java">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-orange-400 font-mono text-xs overflow-x-auto border border-orange-500/20 shadow-lg">
                      {`import com.taxu.Taxu;
import com.taxu.model.TaxRefund;

public class Main {
    public static void main(String[] args) {
        Taxu taxu = new Taxu("${apiKey}");
        
        TaxRefund result = taxu.tax()
            .calculateRefund(${requestBody});
        
        System.out.println(result);
    }
}`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="dotnet">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-indigo-400 font-mono text-xs overflow-x-auto border border-indigo-500/20 shadow-lg">
                      {`using Taxu;

var client = new TaxuClient("${apiKey}");

var result = await client.Tax.CalculateRefundAsync(${requestBody});

Console.WriteLine(result);`}
                    </pre>
                  </TabsContent>
                  <TabsContent value="curl">
                    <pre className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-amber-400 font-mono text-xs overflow-x-auto border border-chart-5/20 shadow-lg">
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
