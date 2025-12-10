"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Play,
  Copy,
  Save,
  FolderOpen,
  Settings,
  Book,
  History,
  ChevronRight,
  Loader2,
  Code2,
  X,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SyntaxHighlighter } from "./syntax-highlighter"

const API_ENDPOINTS = {
  "Tax Filing": [
    { name: "Create W-2", method: "POST", path: "/api/v1/tax-filing/w2" },
    { name: "List W-2s", method: "GET", path: "/api/v1/tax-filing/w2" },
    { name: "Create 1099-NEC", method: "POST", path: "/api/v1/tax-filing/1099-nec" },
    { name: "List 1099-NECs", method: "GET", path: "/api/v1/tax-filing/1099-nec" },
    { name: "Submit Filing", method: "POST", path: "/api/v1/tax-filing/submit" },
    { name: "Get Filing Status", method: "GET", path: "/api/v1/tax-filing/{id}/status" },
  ],
  Neobank: [
    { name: "Create Account", method: "POST", path: "/api/v1/neobank/accounts" },
    { name: "List Accounts", method: "GET", path: "/api/v1/neobank/accounts" },
    { name: "Get Account", method: "GET", path: "/api/v1/neobank/accounts/{id}" },
    { name: "Create Transaction", method: "POST", path: "/api/v1/neobank/transactions" },
    { name: "List Transactions", method: "GET", path: "/api/v1/neobank/transactions" },
    { name: "Create Card", method: "POST", path: "/api/v1/neobank/cards" },
  ],
  Investment: [
    { name: "Create Portfolio", method: "POST", path: "/api/v1/investment/portfolios" },
    { name: "List Portfolios", method: "GET", path: "/api/v1/investment/portfolios" },
    { name: "Get Holdings", method: "GET", path: "/api/v1/investment/holdings" },
    { name: "Create Trade", method: "POST", path: "/api/v1/investment/trades" },
    { name: "Get Performance", method: "GET", path: "/api/v1/investment/performance" },
  ],
  Accounting: [
    { name: "Create Invoice", method: "POST", path: "/api/v1/accounting/invoices" },
    { name: "List Invoices", method: "GET", path: "/api/v1/accounting/invoices" },
    { name: "Create Customer", method: "POST", path: "/api/v1/accounting/customers" },
    { name: "List Customers", method: "GET", path: "/api/v1/accounting/customers" },
    { name: "Record Payment", method: "POST", path: "/api/v1/accounting/payments" },
  ],
}

const CODE_TEMPLATES = {
  curl: (method: string, path: string, body: string) => `curl -X ${method} https://api.taxu.com${path} \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json"${body ? ` \\\n  -d '${body}'` : ""}`,
  nodejs: (method: string, path: string, body: string) => `const taxu = require('taxu')('sk_test_...');

const response = await taxu.${path.split("/").pop()}${method === "POST" ? `.create(${body || "{}"})` : `.list()`};
console.log(response);`,
  python: (method: string, path: string, body: string) => `import taxu
taxu.api_key = "sk_test_..."

response = taxu.${path.split("/").pop().charAt(0).toUpperCase() + path.split("/").pop().slice(1)}${method === "POST" ? `.create(${body || "{}"})` : `.list()`}
print(response)`,
  go: (method: string, path: string, body: string) => `package main

import (
  "github.com/taxu/taxu-go"
)

func main() {
  taxu.Key = "sk_test_..."
  
  params := &taxu.Params{}
  result, _ := taxu.${path.split("/").pop()}.${method === "POST" ? "Create" : "List"}(params)
}`,
  php: (method: string, path: string, body: string) => `<?php
require_once('vendor/autoload.php');

\\Taxu\\Taxu::setApiKey('sk_test_...');

$result = \\Taxu\\${path.split("/").pop()}::${method === "POST" ? "create" : "all"}(${body || "[]"});
print_r($result);`,
}

export function DeveloperShell() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("curl")
  const [requestBody, setRequestBody] = useState("")
  const [responseData, setResponseData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("request")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedRequests, setSavedRequests] = useState<any[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [requestHistory, setRequestHistory] = useState<any[]>([])

  useEffect(() => {
    // Fetch saved test requests from API
    fetch("/api/developer/test-requests")
      .then((res) => res.json())
      .then((data) => setSavedRequests(data.requests || []))
      .catch(console.error)
  }, [])

  const executeRequest = async () => {
    if (!selectedEndpoint) return

    setIsLoading(true)
    setActiveTab("response")

    const startTime = Date.now()

    try {
      const response = await fetch("/api/developer/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedEndpoint.method,
          endpoint: selectedEndpoint.path,
          headers: {},
          body: requestBody ? JSON.parse(requestBody) : null,
        }),
      })

      const data = await response.json()

      const responseTime = Date.now() - startTime

      setResponseData({
        status: data.status || response.status,
        data: data.data || data,
        responseTime: data.responseTime || responseTime,
        headers: {
          "content-type": response.headers.get("content-type") || "application/json",
          "x-response-time": `${responseTime}ms`,
        },
      })

      setRequestHistory((prev) => [
        {
          endpoint: selectedEndpoint,
          timestamp: new Date().toISOString(),
          status: data.status || response.status,
          duration: data.responseTime || responseTime,
        },
        ...prev.slice(0, 9),
      ])
    } catch (error) {
      setResponseData({
        status: 500,
        error: error.message,
        data: { error: error.message },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveRequest = async () => {
    if (!selectedEndpoint) return

    const saved = await fetch("/api/developer/test-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request_name: selectedEndpoint.name,
        method: selectedEndpoint.method,
        endpoint: selectedEndpoint.path,
        body: requestBody,
      }),
    }).then((res) => res.json())

    setSavedRequests((prev) => [saved, ...prev])
  }

  const generatedCode =
    selectedEndpoint && CODE_TEMPLATES[selectedLanguage as keyof typeof CODE_TEMPLATES]
      ? CODE_TEMPLATES[selectedLanguage as keyof typeof CODE_TEMPLATES](
          selectedEndpoint.method,
          selectedEndpoint.path,
          requestBody,
        )
      : ""

  const filteredEndpoints = Object.entries(API_ENDPOINTS).reduce((acc, [category, endpoints]) => {
    const filtered = endpoints.filter(
      (ep) =>
        ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.path.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as any)

  return (
    <div className="flex h-screen bg-[#0a0e1a]">
      {showSidebar && (
        <div className="w-80 border-r border-white/10 bg-[#0d1117] flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg text-white">API Explorer</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => setShowSidebar(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-[#161b22] border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Endpoints List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {Object.entries(filteredEndpoints).map(([category, endpoints]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {(endpoints as any[]).map((endpoint) => (
                      <button
                        key={endpoint.path}
                        onClick={() => {
                          setSelectedEndpoint(endpoint)
                          setRequestBody("")
                          setResponseData(null)
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all ${
                          selectedEndpoint?.path === endpoint.path ? "bg-indigo-500/10 ring-1 ring-indigo-500/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-mono px-2 py-0.5 ${
                              endpoint.method === "GET"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : endpoint.method === "POST"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : endpoint.method === "PUT"
                                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                          <span className="text-sm font-medium truncate text-white">{endpoint.name}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 font-mono truncate">{endpoint.path}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Saved Collections */}
          <div className="border-t border-white/10 p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
              onClick={() => {}}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Saved Requests ({savedRequests.length})
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-white/10 bg-[#0d1117] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!showSidebar && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => setShowSidebar(true)}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                Show Explorer
              </Button>
            )}
            <h1 className="text-xl font-semibold text-white">Taxu Workbench</h1>
            <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Test Mode
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
              <Book className="h-4 w-4 mr-2" />
              Docs
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Request/Response Area */}
        {selectedEndpoint ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0e1a]">
            <div className="border-b border-white/10 bg-gradient-to-r from-[#0d1117] to-[#161b22] px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  className={`text-xs font-mono px-2.5 py-1 ${
                    selectedEndpoint.method === "GET"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : selectedEndpoint.method === "POST"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selectedEndpoint.method === "PUT"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {selectedEndpoint.method}
                </Badge>
                <h2 className="text-lg font-semibold text-white">{selectedEndpoint.name}</h2>
              </div>
              <code className="text-sm text-gray-400 font-mono">{selectedEndpoint.path}</code>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-white/10 px-6 bg-[#0d1117]">
                <TabsList className="h-12 bg-transparent p-0 space-x-6">
                  <TabsTrigger
                    value="request"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:text-white h-12 text-gray-400"
                  >
                    Request
                  </TabsTrigger>
                  <TabsTrigger
                    value="response"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:text-white h-12 text-gray-400"
                  >
                    Response
                    {responseData && (
                      <Badge
                        className={`ml-2 ${
                          responseData.error
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}
                      >
                        {responseData.error ? "Error" : "200"}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:text-white h-12 text-gray-400"
                  >
                    <Code2 className="h-4 w-4 mr-2" />
                    Code
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="request" className="flex-1 overflow-auto m-0 bg-[#0a0e1a]">
                <div className="p-6 space-y-6">
                  {/* Request Body */}
                  {selectedEndpoint.method !== "GET" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block text-gray-300">Request Body (JSON)</label>
                      <Textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder={`{\n  "employee_name": "John Doe",\n  "ssn": "123-45-6789",\n  "wages": 75000\n}`}
                        className="font-mono text-sm min-h-[300px] bg-[#161b22] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                      />
                    </div>
                  )}

                  {/* Headers */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">Headers</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Input
                          value="Authorization"
                          disabled
                          className="flex-1 bg-[#161b22] border-white/10 text-gray-400"
                        />
                        <Input
                          value="Bearer sk_test_..."
                          disabled
                          className="flex-1 bg-[#161b22] border-white/10 text-gray-400"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          value="Content-Type"
                          disabled
                          className="flex-1 bg-[#161b22] border-white/10 text-gray-400"
                        />
                        <Input
                          value="application/json"
                          disabled
                          className="flex-1 bg-[#161b22] border-white/10 text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={executeRequest}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      Send Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={saveRequest}
                      className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="response" className="flex-1 overflow-auto m-0 bg-[#0a0e1a]">
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
                      <p className="text-sm text-gray-400">Executing request...</p>
                    </div>
                  ) : responseData ? (
                    <div className="space-y-4">
                      <div className={`rounded-lg p-4 ${responseData.error ? "status-error" : "status-success"}`}>
                        <div className="flex items-center gap-3">
                          {responseData.error ? (
                            <XCircle className="h-5 w-5 text-red-400" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          )}
                          <span className={`font-semibold ${responseData.error ? "text-red-400" : "text-green-400"}`}>
                            {responseData.error ? "Request Failed" : "Request Successful"}
                          </span>
                          {responseData.duration && (
                            <Badge className="ml-auto bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                              <Clock className="h-3 w-3 mr-1" />
                              {responseData.duration}ms
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-white/10 overflow-hidden code-block-dark">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#161b22]">
                          <span className="text-sm font-medium text-gray-300">Response Body</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <ScrollArea className="max-h-[500px]">
                          <pre className="p-4 overflow-x-auto">
                            <SyntaxHighlighter code={JSON.stringify(responseData.data, null, 2)} language="json" />
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-indigo-500/30">
                        <Code2 className="h-10 w-10 text-indigo-400" />
                      </div>
                      <p className="text-sm text-gray-400">Send a request to see the response here</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="code" className="flex-1 overflow-auto m-0 bg-[#0a0e1a]">
                <div className="p-6 space-y-4">
                  {/* Language Selector */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-48 bg-[#161b22] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161b22] border-white/10">
                        <SelectItem value="curl">cURL</SelectItem>
                        <SelectItem value="nodejs">Node.js</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="php">PHP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg border border-white/10 overflow-hidden code-block-dark">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#161b22]">
                      <span className="text-sm font-medium text-gray-300">Code Example</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <ScrollArea className="max-h-[600px]">
                      <pre className="p-4 overflow-x-auto">
                        <SyntaxHighlighter code={generatedCode} language={selectedLanguage} />
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#0a0e1a]">
            <div className="mb-8 font-mono text-xs sm:text-sm text-indigo-400/60 select-none leading-tight">
              <pre className="whitespace-pre">
                {`     /////    //////    //  //  //  //  
    /// ///  ///  ///  //  //  //  //  
       //    ////////   //////   //  //  
      //     //    //   //  //   //  //  
     //      //    //   //  //   //  //  `}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white">Welcome to Taxu Shell!</h3>
            <p className="text-sm text-gray-400 max-w-2xl mb-4">
              Taxu Shell is a browser-based shell with the Taxu CLI pre-installed. You can use it to test your Taxu
              resources in real-time:
            </p>

            <div className="text-left text-sm text-gray-400 max-w-2xl mb-6 space-y-2 font-mono">
              <div className="flex items-start gap-2">
                <span className="text-gray-500">—</span>
                <div>
                  View supported Taxu commands: <span className="text-indigo-400">taxu help ▷</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">—</span>
                <div>
                  Test tax filing endpoints: <span className="text-indigo-400">taxu filings create ▷</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">—</span>
                <div>
                  Manage API keys: <span className="text-indigo-400">taxu keys list ▷</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
              >
                <Book className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
              <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white">
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Saved Request
              </Button>
            </div>
          </div>
        )}
      </div>

      {requestHistory.length > 0 && (
        <div className="w-72 border-l border-white/10 bg-[#0d1117] overflow-auto">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-sm text-white">Recent Requests</h3>
          </div>
          <div className="p-2 space-y-2">
            {requestHistory.map((req, i) => (
              <button
                key={i}
                onClick={() => setSelectedEndpoint(req.endpoint)}
                className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={`text-[10px] font-mono px-2 py-0.5 ${
                      req.status >= 200 && req.status < 300
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {req.status}
                  </Badge>
                  <span className="text-xs font-medium truncate text-white">{req.endpoint.name}</span>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center justify-between">
                  <span>{new Date(req.timestamp).toLocaleTimeString()}</span>
                  <span>{req.duration}ms</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
