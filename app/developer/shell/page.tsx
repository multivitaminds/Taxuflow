"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import {
  Play,
  Clock,
  Download,
  Upload,
  Settings,
  Plus,
  X,
  Copy,
  Check,
  FileText,
  Link2,
  Zap,
  Folder,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock API endpoints data
const API_ENDPOINTS = [
  {
    category: "Tax Filing",
    description: "Submit and manage 1099-NEC, W-2, and Form 941 tax filings",
    endpoints: [
      {
        id: "submit-1099-nec",
        name: "Submit 1099-NEC Filing",
        method: "POST",
        path: "/api/filing/submit-1099",
        description: "Submit 1099-NEC forms for independent contractors",
      },
      {
        id: "submit-w2",
        name: "Submit W-2 Filing",
        method: "POST",
        path: "/api/filing/submit-w2",
        description: "Submit W-2 forms for employees",
      },
      {
        id: "check-status",
        name: "Check Filing Status",
        method: "GET",
        path: "/api/filing/check-status/[id]",
        description: "Check the status of a submitted filing",
      },
      {
        id: "get-status-list",
        name: "Get Filing Status List",
        method: "GET",
        path: "/api/filing/status",
        description: "Get list of all filing statuses",
      },
      {
        id: "submit-form-941",
        name: "Submit Form 941",
        method: "POST",
        path: "/api/filing/submit-941",
        description: "Submit quarterly Form 941 for employers",
      },
      {
        id: "validate-1099",
        name: "Validate 1099 Form",
        method: "POST",
        path: "/api/filing/validate-1099",
        description: "Validate 1099 form data before submission",
      },
      {
        id: "extract-document",
        name: "Extract Document Data",
        method: "POST",
        path: "/api/filing/extract-document",
        description: "Extract tax data from uploaded documents",
      },
    ],
  },
  {
    category: "Recipients",
    description: "Manage recipient information and settings",
    endpoints: [
      {
        id: "create-recipient",
        name: "Create Recipient",
        method: "POST",
        path: "/api/recipients/create",
        description: "Add a new recipient to your account",
      },
      {
        id: "get-recipients",
        name: "List Recipients",
        method: "GET",
        path: "/api/recipients",
        description: "Get all recipients in your account",
      },
      {
        id: "update-recipient",
        name: "Update Recipient",
        method: "PUT",
        path: "/api/recipients/[id]",
        description: "Update recipient information",
      },
    ],
  },
  {
    category: "Refunds",
    description: "Calculate and manage tax refund estimates",
    endpoints: [
      {
        id: "estimate-refund",
        name: "Estimate Refund",
        method: "POST",
        path: "/api/refunds/estimate",
        description: "Calculate estimated tax refund amount",
      },
      {
        id: "get-refund-status",
        name: "Get Refund Status",
        method: "GET",
        path: "/api/refunds/status/[id]",
        description: "Check the status of a refund",
      },
    ],
  },
]

export default function TaxuWorkbenchPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null)
  const [requestBody, setRequestBody] = useState("")
  const [responseData, setResponseData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"request" | "response" | "code">("response")
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [environment, setEnvironment] = useState("production")
  const [savedRequests, setSavedRequests] = useState<any[]>([])
  const [bulkExecutionResults, setBulkExecutionResults] = useState<any[]>([])
  const [showBulkResults, setShowBulkResults] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Filter endpoints by search
  const filteredEndpoints = API_ENDPOINTS.map((category) => ({
    ...category,
    endpoints: category.endpoints.filter(
      (endpoint) =>
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((category) => category.endpoints.length > 0)

  // Execute API request
  const executeRequest = async () => {
    setIsLoading(true)
    setActiveTab("response")

    // Simulate API call
    setTimeout(() => {
      const mockSuccess = Math.random() > 0.3
      const mockStatusCode = mockSuccess ? 200 : Math.random() > 0.5 ? 400 : 500

      setStatusCode(mockStatusCode)
      setResponseData({
        status: mockStatusCode,
        data: mockSuccess
          ? {
              success: true,
              message: "Request successful",
              filingId: "filing_" + Math.random().toString(36).substr(2, 9),
              timestamp: new Date().toISOString(),
            }
          : {
              success: false,
              error: "Validation error",
              message: mockStatusCode === 400 ? "Invalid request parameters" : "Internal server error",
            },
        responseTime: Math.floor(Math.random() * 500) + 100,
        headers: {
          "content-type": "application/json",
          "x-request-id": Math.random().toString(36).substr(2, 9),
        },
      })

      // Add to saved requests
      const newRequest = {
        id: Date.now(),
        endpoint: selectedEndpoint,
        statusCode: mockStatusCode,
        timestamp: new Date(),
        responseTime: Math.floor(Math.random() * 500) + 100,
      }
      setSavedRequests((prev) => [newRequest, ...prev].slice(0, 10))

      setIsLoading(false)
    }, 1000)
  }

  // Bulk execute selected endpoints
  const executeBulkRequests = () => {
    setShowBulkResults(true)
    const results = [
      {
        endpoint: "Get Filing Status List",
        status: "Success",
        statusCode: 200,
        data: { filings: 15, pending: 3 },
      },
      {
        endpoint: "Submit Form 941",
        status: "Success",
        statusCode: 200,
        data: { success: true, filingId: "941_abc123" },
      },
    ]
    setBulkExecutionResults(results)
  }

  // Copy code
  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Default request body based on endpoint
  useEffect(() => {
    if (selectedEndpoint) {
      if (selectedEndpoint.method === "POST") {
        setRequestBody(
          JSON.stringify(
            {
              userId: "user_123",
              filingYear: 2024,
              ...((selectedEndpoint.id === "submit-1099-nec" || selectedEndpoint.id === "validate-1099") && {
                recipientName: "John Doe",
                recipientTIN: "123-45-6789",
                amount: 5000,
              }),
            },
            null,
            2,
          ),
        )
      } else {
        setRequestBody("")
      }
      setResponseData(null)
      setStatusCode(null)
      setActiveTab("request")
    }
  }, [selectedEndpoint])

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      <Navigation />

      <div className="pt-16 h-screen flex flex-col">
        {/* Top Toolbar */}
        <div className="border-b border-white/10 bg-[#0d1130] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white flex items-center gap-2">Taxu Workbench</h1>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="w-[180px] bg-[#1a1f3a] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="sandbox">Sandbox</SelectItem>
                  <SelectItem value="test">Test Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <FileText className="w-4 h-4 mr-2" />
                Assertions
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={executeBulkRequests}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Zap className="w-4 h-4 mr-2" />
                Bulk Execute
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Link2 className="w-4 h-4 mr-2" />
                Chain Requests
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Clock className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-white ml-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Assertion
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - API Explorer */}
          <div
            className={`${
              sidebarCollapsed ? "w-0" : "w-80"
            } transition-all duration-300 border-r border-white/10 bg-[#0d1130] flex flex-col`}
          >
            {!sidebarCollapsed && (
              <>
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white">API Explorer</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarCollapsed(true)}
                      className="h-6 w-6 p-0 text-white/50 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      placeholder="Search endpoints..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-[#1a1f3a] border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    <button className="w-full flex items-center gap-2 p-3 rounded-lg bg-[#1a1f3a] hover:bg-[#1f2440] border border-white/10 text-left mb-4">
                      <Folder className="w-4 h-4 text-white/70" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">Saved Requests (0)</div>
                      </div>
                    </button>

                    {filteredEndpoints.map((category) => (
                      <div key={category.category} className="mb-6">
                        <div className="mb-3">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
                            {category.category}
                          </h3>
                          <p className="text-xs text-white/40">{category.description}</p>
                        </div>

                        <div className="space-y-1">
                          {category.endpoints.map((endpoint) => (
                            <button
                              key={endpoint.id}
                              onClick={() => setSelectedEndpoint(endpoint)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                selectedEndpoint?.id === endpoint.id
                                  ? "bg-accent/20 border border-accent/50"
                                  : "hover:bg-[#1a1f3a] border border-transparent"
                              }`}
                            >
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  endpoint.method === "GET"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : endpoint.method === "POST"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-orange-500/20 text-orange-400"
                                }`}
                              >
                                {endpoint.method}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{endpoint.name}</div>
                                <div className="text-xs text-white/50 font-mono truncate">{endpoint.path}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Center Panel */}
          <div className="flex-1 flex flex-col">
            {selectedEndpoint ? (
              <>
                {/* Endpoint Header */}
                <div className="p-6 border-b border-white/10 bg-[#0d1130]">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white/50 mb-2">Select Endpoint</h3>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1f3a] border border-white/10">
                      <span
                        className={`px-3 py-1 rounded text-xs font-mono font-bold ${
                          selectedEndpoint.method === "GET"
                            ? "bg-blue-500/20 text-blue-400"
                            : selectedEndpoint.method === "POST"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-orange-500/20 text-orange-400"
                        }`}
                      >
                        {selectedEndpoint.method}
                      </span>
                      <Select value={selectedEndpoint.name}>
                        <SelectTrigger className="flex-1 bg-transparent border-none text-white font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {API_ENDPOINTS.flatMap((cat) =>
                            cat.endpoints.map((ep) => (
                              <SelectItem key={ep.id} value={ep.name}>
                                {ep.name}
                              </SelectItem>
                            )),
                          )}
                        </SelectContent>
                      </Select>
                      <span className="text-sm font-mono text-white/50">{selectedEndpoint.path}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{selectedEndpoint.name}</h2>
                    <Button
                      onClick={executeRequest}
                      disabled={isLoading}
                      className="bg-accent hover:bg-accent/90 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isLoading ? "Executing..." : "Execute"}
                    </Button>
                  </div>
                  <p className="text-sm text-white/50 mt-2">{selectedEndpoint.description}</p>
                  <p className="text-xs font-mono text-white/40 mt-1">{selectedEndpoint.path}</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-white/10 bg-[#0d1130]">
                  <div className="flex items-center gap-1 px-6">
                    <button
                      onClick={() => setActiveTab("request")}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === "request"
                          ? "border-accent text-white"
                          : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      Request
                    </button>
                    <button
                      onClick={() => setActiveTab("response")}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                        activeTab === "response"
                          ? "border-accent text-white"
                          : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      Response
                      {statusCode && (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            statusCode === 200
                              ? "bg-green-500/20 text-green-400"
                              : statusCode >= 400 && statusCode < 500
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {statusCode}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("code")}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === "code"
                          ? "border-accent text-white"
                          : "border-transparent text-white/50 hover:text-white"
                      }`}
                    >
                      Code
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === "request" && (
                    <div>
                      {selectedEndpoint.method === "POST" && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-white">Request Body</h3>
                            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white h-7">
                              Format JSON
                            </Button>
                          </div>
                          <textarea
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            className="w-full h-96 p-4 rounded-lg bg-[#0a0e27] border border-white/10 text-accent font-mono text-sm focus:outline-none focus:border-accent/50"
                            placeholder="Enter request body..."
                          />
                        </>
                      )}
                      {selectedEndpoint.method === "GET" && (
                        <div className="text-center py-12 text-white/50">
                          <p>This endpoint does not require a request body.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "response" && (
                    <div>
                      {responseData ? (
                        <>
                          {statusCode && statusCode !== 200 && (
                            <div className="mb-6 p-4 rounded-lg bg-orange-500/10 border-l-4 border-orange-500">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                <span className="font-semibold text-orange-400">
                                  Status Code: {statusCode === 200 ? "N/A" : statusCode}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">
                                {responseData.data.error || "Request returned an error"}
                              </p>
                            </div>
                          )}

                          {showBulkResults && (
                            <div className="mb-6">
                              <h3 className="text-lg font-bold text-white mb-4">Bulk Execution Results</h3>
                              <div className="grid gap-4">
                                {bulkExecutionResults.map((result, idx) => (
                                  <div key={idx} className="p-4 rounded-lg border border-white/10 bg-[#0d1130]">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <h4 className="font-semibold text-white">{result.endpoint}</h4>
                                      </div>
                                      <span className="text-sm text-green-400">{result.status}</span>
                                    </div>
                                    <pre className="text-xs font-mono text-accent overflow-x-auto">
                                      {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                  </div>
                                ))}
                                <div className="text-sm text-white/70 mt-2">
                                  Total Requests: {bulkExecutionResults.length}, Successful:{" "}
                                  {bulkExecutionResults.filter((r) => r.status === "Success").length}, Failed: 0
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-white">Response Body</h3>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/50">{responseData.responseTime}ms</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCode(JSON.stringify(responseData.data, null, 2))}
                                className="text-white/50 hover:text-white h-7"
                              >
                                {copied ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="rounded-lg bg-[#0a0e27] border border-white/10 p-4 overflow-x-auto">
                            <pre className="text-sm font-mono text-accent">
                              {JSON.stringify(responseData.data, null, 2)}
                            </pre>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-16 text-white/50">
                          <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">Execute a request to see the response</p>
                          <p className="text-sm">Click the Execute button to send your API request</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "code" && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-white">Code Example</h3>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="javascript">
                            <SelectTrigger className="w-32 bg-[#1a1f3a] border-white/10 text-white h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="curl">cURL</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyCode(`const response = await fetch('${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }${selectedEndpoint.method === "POST" ? `,\n  body: JSON.stringify(${requestBody})` : ""}
});`)
                            }
                            className="text-white/50 hover:text-white h-7"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#0a0e27] border border-white/10 p-4 overflow-x-auto">
                        <pre className="text-sm font-mono text-accent">
                          {`const response = await fetch('${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }${selectedEndpoint.method === "POST" ? `,\n  body: JSON.stringify(${requestBody})` : ""}
});

const data = await response.json();
console.log(data);`}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-2xl px-6">
                  <img
                    src="/images/image.png"
                    alt="Taxu Shell ASCII"
                    className="w-full max-w-md mx-auto mb-8 opacity-80"
                  />
                  <h2 className="text-3xl font-bold text-white mb-4">Welcome to Taxu Workbench</h2>
                  <p className="text-white/70 mb-8 text-lg leading-relaxed">
                    A powerful, browser-based API testing environment for the Taxu platform. Test tax filing endpoints,
                    manage recipients, and calculate refunds in real-time with our interactive developer console.
                  </p>
                  <div className="space-y-3 text-left bg-[#0d1130] rounded-lg p-6 border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="text-white/50">→</span>
                      <div>
                        <span className="text-white/50">View supported Taxu commands: </span>
                        <code className="text-accent font-mono">taxu help</code>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50">→</span>
                      <div>
                        <span className="text-white/50">Test tax filing endpoints: </span>
                        <code className="text-accent font-mono">taxu filings create</code>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-white/50">→</span>
                      <div>
                        <span className="text-white/50">Manage recipients: </span>
                        <code className="text-accent font-mono">taxu recipients list</code>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                      onClick={() => (window.location.href = "/api-docs")}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-white"
                      onClick={() => setSelectedEndpoint(API_ENDPOINTS[0].endpoints[0])}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Testing
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Recent Requests */}
          <div className="w-80 border-l border-white/10 bg-[#0d1130] flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Recent Requests</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {savedRequests.length > 0 ? (
                <div className="space-y-2">
                  {savedRequests.map((request) => (
                    <button
                      key={request.id}
                      onClick={() => setSelectedEndpoint(request.endpoint)}
                      className="w-full p-3 rounded-lg bg-[#1a1f3a] hover:bg-[#1f2440] border border-white/10 text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold ${
                            request.statusCode === 200
                              ? "text-green-400"
                              : request.statusCode >= 400 && request.statusCode < 500
                                ? "text-orange-400"
                                : "text-red-400"
                          }`}
                        >
                          {request.statusCode}
                        </span>
                        <span className="text-xs text-white/50">{request.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="text-sm font-medium text-white truncate mb-1">
                        {request.endpoint.method} {request.endpoint.name}
                      </div>
                      <div className="text-xs text-white/50">{request.responseTime}ms</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/50">
                  <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No recent requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
