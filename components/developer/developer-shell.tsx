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
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  PlayCircle,
  Link2,
  TestTube,
  Globe,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SyntaxHighlighter } from "./syntax-highlighter"
import { API_CATALOG, type ApiEndpoint } from "@/lib/api-catalog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("curl")
  const [requestBody, setRequestBody] = useState("")
  const [responseData, setResponseData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("request")
  const [searchQuery, setSearchQuery] = useState("")
  const [savedRequests, setSavedRequests] = useState<any[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [requestHistory, setRequestHistory] = useState<any[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownSearchQuery, setDropdownSearchQuery] = useState("")

  // ADDED state for advanced features
  const [environment, setEnvironment] = useState<"test" | "production">("test")
  const [assertions, setAssertions] = useState<Array<{ field: string; operator: string; value: string }>>([])
  const [showAssertions, setShowAssertions] = useState(false)
  const [showBulkExecute, setShowBulkExecute] = useState(false)
  const [bulkRequests, setBulkRequests] = useState<ApiEndpoint[]>([])
  const [showChainDialog, setShowChainDialog] = useState(false)
  const [chainedRequests, setChainedRequests] = useState<
    Array<{ endpoint: ApiEndpoint; mapping: Record<string, string> }>
  >([])
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  // Added state for method and endpoint to fix undeclared variables
  const [method, setMethod] = useState<string>("GET")
  const [endpoint, setEndpoint] = useState<string>("")

  // ADDED state for showing saved requests dialog
  const [showSavedRequestsDialog, setShowSavedRequestsDialog] = useState(false)

  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: "Authorization", value: "Bearer " },
    { key: "Content-Type", value: "application/json" },
  ])

  const [allEndpoints, setAllEndpoints] = useState<Array<ApiEndpoint & { category: string }>>([])

  useEffect(() => {
    const flattened: Array<ApiEndpoint & { category: string }> = []
    Object.entries(API_CATALOG).forEach(([categoryKey, category]) => {
      category.endpoints.forEach((endpoint) => {
        flattened.push({ ...endpoint, category: category.name })
      })
    })
    setAllEndpoints(flattened)

    // Fetch saved test requests from API
    fetch("/api/developer/test-requests")
      .then((res) => res.json())
      .then((data) => setSavedRequests(data.requests || []))
      .catch(console.error)
  }, [])

  // ADDED assertion validation function
  const validateAssertions = (response: any): { passed: boolean; results: any[] } => {
    const results = assertions.map((assertion) => {
      const value = assertion.field.split(".").reduce((obj, key) => obj?.[key], response)
      let passed = false

      switch (assertion.operator) {
        case "equals":
          passed = value == assertion.value
          break
        case "contains":
          passed = String(value).includes(assertion.value)
          break
        case "greater_than":
          passed = Number(value) > Number(assertion.value)
          break
        case "less_than":
          passed = Number(value) < Number(assertion.value)
          break
        case "exists":
          passed = value !== undefined && value !== null
          break
      }

      return { assertion, passed, actualValue: value }
    })

    return {
      passed: results.every((r) => r.passed),
      results,
    }
  }

  const resetRequest = () => {
    setSelectedEndpoint(null)
    setRequestBody("")
    setResponseData(null)
    setHeaders([
      { key: "Authorization", value: "Bearer " },
      { key: "Content-Type", value: "application/json" },
    ])
    setActiveTab("request")
  }

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const executeRequest = async () => {
    if (!selectedEndpoint) return

    setIsLoading(true)
    setActiveTab("response")

    const startTime = Date.now()

    try {
      const requestHeaders: Record<string, string> = {}
      headers.forEach((h) => {
        if (h.key && h.value) {
          requestHeaders[h.key] = h.value
        }
      })

      const response = await fetch("/api/developer/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedEndpoint.method,
          endpoint: selectedEndpoint.path,
          headers: requestHeaders,
          body: requestBody ? JSON.parse(requestBody) : null,
          environment,
        }),
      })

      const data = await response.json()
      const responseTime = Date.now() - startTime

      let assertionResults = null
      if (assertions.length > 0) {
        assertionResults = validateAssertions(data.data || data)
      }

      setResponseData({
        status: data.status || response.status,
        data: data.data || data,
        responseTime: data.responseTime || responseTime,
        headers: {
          "content-type": response.headers.get("content-type") || "application/json",
          "x-response-time": `${responseTime}ms`,
        },
        assertions: assertionResults,
      })

      setRequestHistory((prev) => [
        {
          endpoint: selectedEndpoint,
          timestamp: new Date().toISOString(),
          status: data.status || response.status,
          duration: data.responseTime || responseTime,
          assertionsPassed: assertionResults?.passed,
          body: requestBody, // Add body to history
        },
        ...prev.slice(0, 9),
      ])
    } catch (error: any) {
      // Explicitly type error for clarity
      setResponseData({
        status: 500,
        error: error.message,
        data: { error: error.message },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const executeBulk = async () => {
    setIsLoading(true)
    const results = []

    for (const endpoint of bulkRequests) {
      try {
        const response = await fetch("/api/developer/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: endpoint.method,
            endpoint: endpoint.path,
            headers: {}, // Bulk execute might not use custom headers from the main form
            body: null,
            environment,
          }),
        })

        const data = await response.json()
        results.push({ endpoint, success: true, data })
      } catch (error) {
        results.push({ endpoint, success: false, error: error.message })
      }
    }

    setResponseData({
      bulkResults: results,
      totalRequests: bulkRequests.length,
      successful: results.filter((r) => r.success).length,
    })
    setIsLoading(false)
    setShowBulkExecute(false)
  }

  const executeChain = async () => {
    setIsLoading(true)
    let previousResponse = null

    for (const { endpoint, mapping } of chainedRequests) {
      try {
        let body = null

        // Map values from previous response
        if (previousResponse && Object.keys(mapping).length > 0) {
          body = {}
          Object.entries(mapping).forEach(([targetField, sourceField]) => {
            const value = sourceField.split(".").reduce((obj, key) => obj?.[key], previousResponse)
            body[targetField] = value
          })
        }

        const response = await fetch("/api/developer/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            method: endpoint.method,
            endpoint: endpoint.path,
            headers: {}, // Chain requests might not use custom headers from the main form
            body,
            environment,
          }),
        })

        const data = await response.json()
        previousResponse = data.data || data
      } catch (error) {
        setResponseData({
          status: 500,
          error: `Chain failed at ${endpoint.name}: ${error.message}`,
        })
        setIsLoading(false)
        return
      }
    }

    setResponseData({
      status: 200,
      data: previousResponse,
      chainCompleted: true,
      steps: chainedRequests.length,
    })
    setIsLoading(false)
    setShowChainDialog(false)
  }

  const exportCollections = () => {
    const exportData = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      environment,
      saved_requests: savedRequests,
      assertions,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taxu-workbench-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setShowExportDialog(false)
  }

  const importCollections = async () => {
    if (!importFile) return

    try {
      const text = await importFile.text()
      const data = JSON.parse(text)

      if (data.saved_requests) {
        setSavedRequests((prev) => [...prev, ...data.saved_requests])
      }
      if (data.assertions) {
        setAssertions(data.assertions)
      }

      setShowImportDialog(false)
      setImportFile(null)
    } catch (error) {
      console.error("Import failed:", error)
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

  // The following line was changed from `filteredAllEndpoints` to `filteredEndpoints` and adjusted logic
  const filteredEndpoints = API_CATALOG[selectedEndpoint?.category || "core"]?.endpoints.filter(
    // Added a default category and a fallback to selectedEndpoint?.category
    (ep) =>
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // ADDED function to handle command clicks
  const handleCommandClick = (command: string) => {
    // Auto-populate the endpoint selector based on the command
    if (command === "taxu help") {
      // Show help/documentation
      window.open("/developer/docs", "_blank")
    } else if (command === "taxu filings create") {
      // Load the filings create endpoint
      const endpoint = allEndpoints.find((ep) => ep.path === "/api/filings")
      if (endpoint) {
        setSelectedEndpoint(endpoint)
        setMethod("POST")
      }
    } else if (command === "taxu recipients list") {
      // Load the recipients list endpoint
      const endpoint = allEndpoints.find((ep) => ep.path === "/api/recipients")
      if (endpoint) {
        setSelectedEndpoint(endpoint)
        setMethod("GET")
      }
    }
  }

  // ADDED function to load saved requests
  const loadSavedRequest = (request: any) => {
    setMethod(request.method)
    setEndpoint(request.url)
    // Ensure headers are set correctly, defaulting to empty if not provided
    setHeaders(
      request.headers
        ? Object.entries(request.headers).map(([key, value]) => ({ key, value }))
        : [
            { key: "Authorization", value: "Bearer " },
            { key: "Content-Type", value: "application/json" },
          ],
    )
    setRequestBody(request.body || "")

    // Find and select the matching endpoint
    const matchedEndpoint = allEndpoints.find((ep) => request.url.includes(ep.path))
    if (matchedEndpoint) {
      setSelectedEndpoint(matchedEndpoint)
    }

    setShowSavedRequestsDialog(false)
  }

  return (
    // Changed background gradient
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex">
      {showSidebar && (
        <div className="w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm flex flex-col">
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
              <Button
                variant="outline"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full justify-between h-10 bg-[#161b22] border-white/10 text-white hover:bg-white/5 hover:border-indigo-500 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{selectedEndpoint ? selectedEndpoint.name : "Select an endpoint..."}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-[#0d1117] border border-white/10 rounded-lg shadow-2xl max-h-[600px] overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-white/10 bg-[#161b22] sticky top-0 z-20">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search endpoints..."
                        value={dropdownSearchQuery}
                        onChange={(e) => setDropdownSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {dropdownSearchQuery && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDropdownSearchQuery("")
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-y-auto">
                    {Object.entries(API_CATALOG).map(([categoryKey, category]) => {
                      const filteredCategoryEndpoints = category.endpoints.filter(
                        (ep) =>
                          ep.name.toLowerCase().includes(dropdownSearchQuery.toLowerCase()) ||
                          ep.path.toLowerCase().includes(dropdownSearchQuery.toLowerCase()) ||
                          ep.description.toLowerCase().includes(dropdownSearchQuery.toLowerCase()),
                      )

                      if (filteredCategoryEndpoints.length === 0) return null

                      return (
                        <div key={categoryKey} className="border-b border-white/5 last:border-b-0">
                          {/* Category Header */}
                          <div className="px-4 py-2 bg-white/5 sticky top-0 backdrop-blur-sm z-10">
                            <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                              {category.name}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">{category.description}</div>
                          </div>

                          {/* Endpoints */}
                          <div className="py-1">
                            {filteredCategoryEndpoints.map((endpoint) => (
                              <button
                                key={endpoint.path}
                                onClick={() => {
                                  setSelectedEndpoint(endpoint)
                                  setRequestBody(endpoint.requestBody?.example || "")
                                  setResponseData(null)
                                  setIsDropdownOpen(false)
                                  setDropdownSearchQuery("")
                                }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-white/5 transition-all ${
                                  selectedEndpoint?.path === endpoint.path ? "bg-indigo-500/10" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    variant="secondary"
                                    className={`text-[10px] font-mono px-1.5 py-0.5 ${
                                      endpoint.method === "GET"
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                        : endpoint.method === "POST"
                                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                          : endpoint.method === "PUT" || endpoint.method === "PATCH"
                                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}
                                  >
                                    {endpoint.method}
                                  </Badge>
                                  <span className="text-sm font-medium text-white">{endpoint.name}</span>
                                </div>
                                <div className="text-xs text-gray-400 font-mono pl-0.5">{endpoint.path}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}

                    {Object.entries(API_CATALOG).every(
                      ([_, category]) =>
                        category.endpoints.filter(
                          (ep) =>
                            ep.name.toLowerCase().includes(dropdownSearchQuery.toLowerCase()) ||
                            ep.path.toLowerCase().includes(dropdownSearchQuery.toLowerCase()) ||
                            ep.description.toLowerCase().includes(dropdownSearchQuery.toLowerCase()),
                        ).length === 0,
                    ) && (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        No endpoints found matching "{dropdownSearchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Endpoints List - Kept for visual reference and specific selected endpoint display */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {/* Display currently selected endpoint details */}
              {selectedEndpoint && (
                <div className="mb-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                  <div className="text-xs font-semibold text-indigo-300 mb-2">Selected Endpoint</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-mono px-2 py-0.5 ${
                        selectedEndpoint.method === "GET"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : selectedEndpoint.method === "POST"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : selectedEndpoint.method === "PUT" || selectedEndpoint.method === "PATCH"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {selectedEndpoint.method}
                    </Badge>
                    <span className="text-sm font-medium text-white">{selectedEndpoint.name}</span>
                  </div>
                  <div className="text-xs text-gray-300 font-mono">{selectedEndpoint.path}</div>
                  <div className="text-xs text-gray-400 mt-2">{selectedEndpoint.description}</div>
                </div>
              )}

              {/* Recent Requests Section */}
              {requestHistory.length > 0 && (
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Recent Requests
                  </div>
                  <div className="space-y-1">
                    {requestHistory.slice(0, 5).map((req, idx) => (
                      <button
                        key={idx}
                        // Updated onClick to set method, endpoint, and body from history
                        onClick={() => {
                          setSelectedEndpoint(req.endpoint) // Set the endpoint object
                          setMethod(req.endpoint.method) // Set method
                          setEndpoint(req.endpoint.path) // Set endpoint path
                          setRequestBody(req.body || "") // Set request body
                          setResponseData(null) // Clear previous response
                          setIsDropdownOpen(false) // Close dropdown if open
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-mono px-2 py-0.5 ${
                              req.status >= 200 && req.status < 300
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : req.status === undefined
                                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {req.status || "Pending"}
                          </Badge>
                          <span className="text-xs font-mono truncate text-gray-300">{req.endpoint.name}</span>{" "}
                          {/* Display endpoint name */}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(req.timestamp).toLocaleTimeString()}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Saved Collections Section */}
              <div className="border-t border-white/10 p-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                  onClick={() => setShowSavedRequestsDialog(true)}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Saved Requests ({savedRequests.length})
                </Button>
              </div>
            </div>
          </ScrollArea>
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
            {/* ADDED environment selector */}
            <Select value={environment} onValueChange={(v: any) => setEnvironment(v)}>
              <SelectTrigger className="w-32 bg-[#161b22] border-white/10 text-white">
                <Globe className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#161b22] border-white/10">
                <SelectItem value="test" className="text-white">
                  Test Mode
                </SelectItem>
                <SelectItem value="production" className="text-white">
                  Production
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {/* ADDED advanced feature buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setShowAssertions(!showAssertions)}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Assertions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setShowBulkExecute(true)}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Bulk Execute
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setShowChainDialog(true)}
            >
              <Link2 className="h-4 w-4 mr-2" />
              Chain Requests
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setShowExportDialog(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-b border-white/10 bg-gradient-to-r from-[#0d1117] to-[#161b22] px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm text-gray-400 mb-2 block">Select Endpoint</Label>
              <Select
                value={selectedEndpoint?.path || ""}
                onValueChange={(path) => {
                  const endpoint = allEndpoints.find((ep) => ep.path === path)
                  if (endpoint) {
                    setSelectedEndpoint(endpoint)
                    setRequestBody("") // Clear request body when selecting a new endpoint
                    setResponseData(null)
                    // Set method and endpoint when selecting from the dropdown
                    setMethod(endpoint.method)
                    setEndpoint(endpoint.path)
                  }
                }}
              >
                <SelectTrigger className="bg-[#161b22] border-white/10 text-white h-11">
                  <SelectValue placeholder="Choose an API endpoint..." />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-white/10 max-h-[400px]">
                  {Object.entries(API_CATALOG).map(([categoryKey, category]) => (
                    <div key={categoryKey}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {category.name}
                      </div>
                      {category.endpoints.map((endpoint) => (
                        <SelectItem key={endpoint.path} value={endpoint.path} className="text-white">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-mono px-2 py-0.5 ${
                                endpoint.method === "GET"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : endpoint.method === "POST"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : endpoint.method === "PUT" || endpoint.method === "PATCH"
                                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="text-sm">{endpoint.name}</span>
                            <span className="text-xs text-gray-500 ml-auto font-mono">{endpoint.path}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                        : selectedEndpoint.method === "PUT" || selectedEndpoint.method === "PATCH"
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
                        {responseData.error
                          ? "Error"
                          : responseData.assertions?.passed
                            ? "Assert OK"
                            : responseData.status || "200"}
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

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Headers</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addHeader}
                        className="h-7 text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Header
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {headers.map((header, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Input
                            value={header.key}
                            onChange={(e) => updateHeader(index, "key", e.target.value)}
                            placeholder="Header name"
                            className="flex-1 bg-[#161b22] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                          />
                          <Input
                            value={header.value}
                            onChange={(e) => updateHeader(index, "value", e.target.value)}
                            placeholder="Header value"
                            className="flex-1 bg-[#161b22] border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHeader(index)}
                            className="h-9 w-9 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
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
                      {/* Response Status */}
                      <div
                        className={`rounded-lg p-4 ${responseData.error ? "status-error" : responseData.assertions?.passed ? "status-success" : "status-warning"}`}
                      >
                        <div className="flex items-center gap-3">
                          {responseData.error ? (
                            <XCircle className="h-5 w-5 text-red-400" />
                          ) : responseData.assertions?.passed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-400" />
                          )}
                          <span
                            className={`font-semibold ${responseData.error ? "text-red-400" : responseData.assertions?.passed ? "text-green-400" : "text-yellow-400"}`}
                          >
                            {responseData.error
                              ? "Request Failed"
                              : responseData.assertions?.passed
                                ? "Assertions Passed"
                                : `Status Code: ${responseData.status || "N/A"}`}
                          </span>
                          {responseData.responseTime && (
                            <Badge className="ml-auto bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                              <Clock className="h-3 w-3 mr-1" />
                              {responseData.responseTime}ms
                            </Badge>
                          )}
                        </div>
                        {/* Assertion Details */}
                        {!responseData.error && responseData.assertions && (
                          <div className="mt-3 text-sm">
                            {responseData.assertions.results.map((res: any, i: number) => (
                              <div
                                key={i}
                                className={`flex items-center gap-2 py-1 ${res.passed ? "text-green-400" : "text-red-400"}`}
                              >
                                {res.passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <span>
                                  {res.assertion.field} {res.assertion.operator} {res.assertion.value}
                                </span>
                                <span className="ml-2 text-gray-500">Actual: {JSON.stringify(res.actualValue)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bulk Results Display */}
                      {responseData.bulkResults && (
                        <div className="space-y-4">
                          <div className="text-white font-semibold">Bulk Execution Results</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {responseData.bulkResults.map((result: any, i: number) => (
                              <div
                                key={i}
                                className={`rounded-lg p-4 ${result.success ? "status-success" : "status-error"}`}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  {result.success ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-400" />
                                  )}
                                  <span className="font-semibold">{result.endpoint.name}</span>
                                  <span className="ml-auto text-xs text-gray-400">
                                    {result.success ? "Success" : "Failed"}
                                  </span>
                                </div>
                                {result.success && (
                                  <pre className="text-xs text-gray-300 overflow-x-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                  </pre>
                                )}
                                {!result.success && <p className="text-xs text-red-300">{result.error}</p>}
                              </div>
                            ))}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Total Requests: {responseData.totalRequests}, Successful: {responseData.successful}, Failed:{" "}
                            {responseData.totalRequests - responseData.successful}
                          </div>
                        </div>
                      )}

                      {/* Chain Results Display */}
                      {responseData.chainCompleted && (
                        <div className="space-y-4">
                          <div className="text-white font-semibold">Chain Execution Results</div>
                          <div className={`rounded-lg p-4 status-success`}>
                            <div className="flex items-center gap-3 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                              <span className="font-semibold">Chain Completed Successfully</span>
                              <span className="ml-auto text-xs text-gray-400">{responseData.steps} steps</span>
                            </div>
                            <pre className="text-xs text-gray-300 overflow-x-auto">
                              {JSON.stringify(responseData.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Standard Response Body */}
                      {!responseData.bulkResults && !responseData.chainCompleted && (
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
                      )}
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-48 bg-[#161b22] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#161b22] border-white/10">
                        <SelectItem value="curl" className="text-cyan-400 font-semibold">
                          cURL
                        </SelectItem>
                        <SelectItem value="nodejs" className="text-green-400 font-semibold">
                          Node.js
                        </SelectItem>
                        <SelectItem value="python" className="text-blue-400 font-semibold">
                          Python
                        </SelectItem>
                        <SelectItem value="go" className="text-cyan-300 font-semibold">
                          Go
                        </SelectItem>
                        <SelectItem value="php" className="text-purple-400 font-semibold">
                          PHP
                        </SelectItem>
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
            <div className="mb-8 font-mono text-[8px] leading-[1.2] text-cyan-400/80 select-none">
              <pre className="whitespace-pre">
                {`                                    /////                                    
                ////                /////                                    
          ////  ////        ////    /////          ///         ///          
        /////////////    //////////  /////      /////////////  ///      ////
      /////////////////  //////////  /////    /////////////////////////  ////
    ////        ////        ////     /////    /////     /////////////////  ////
   ///////////  ////        ////     /////    /////     /////  /////  ////  ////
     /////////  ////        ////     /////    /////     /////  //////////////  
        ////    ////        ////     /////    /////     /////     ////        
        ////    ////        ////     /////    /////     /////     ////        
   //////////   ////////    ////     //////////////////     //////////        
  //////////      //////    ////     ////////////////         ////////        
 /////////          ////    ////     //////                     //////        `}
              </pre>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white">Welcome to Taxu Shell!</h3>
            <p className="text-sm text-gray-400 max-w-2xl mb-4">
              Taxu Shell is a browser-based shell with the Taxu CLI pre-installed. You can use it to manage your tax,
              banking, and investment environment in real-time:
            </p>

            <div className="text-left text-sm text-gray-400 max-w-2xl mb-6 space-y-2 font-mono">
              <div className="flex items-start gap-2">
                <span className="text-gray-500">—</span>
                <div>
                  View supported Taxu commands:{" "}
                  <button
                    onClick={() => handleCommandClick("taxu help")}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline"
                  >
                    taxu help ▷
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">—</span>
                <div>
                  Test tax filing endpoints:{" "}
                  <button
                    onClick={() => handleCommandClick("taxu filings create")}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline"
                  >
                    taxu filings create ▷
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">—</span>
                <div>
                  Manage recipients:{" "}
                  <button
                    onClick={() => handleCommandClick("taxu recipients list")}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline"
                  >
                    taxu recipients list ▷
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                onClick={() => window.open("/developer/docs", "_blank")}
              >
                <Book className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white"
                onClick={() => setShowSavedRequestsDialog(true)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Saved Request
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ADDED assertions panel */}
      {showAssertions && selectedEndpoint && (
        <div className="w-72 border-l border-white/10 bg-[#0d1117] p-4 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Response Assertions</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAssertions([...assertions, { field: "", operator: "equals", value: "" }])}
              className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5"
            >
              Add Assertion
            </Button>
          </div>
          <div className="space-y-2">
            {assertions.map((assertion, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  placeholder="Field (e.g., data.status)"
                  value={assertion.field}
                  onChange={(e) => {
                    const newAssertions = [...assertions]
                    newAssertions[idx].field = e.target.value
                    setAssertions(newAssertions)
                  }}
                  className="flex-1 bg-[#161b22] border-white/10 text-white"
                />
                <Select
                  value={assertion.operator}
                  onValueChange={(v) => {
                    const newAssertions = [...assertions]
                    newAssertions[idx].operator = v
                    setAssertions(newAssertions)
                  }}
                >
                  <SelectTrigger className="w-32 bg-[#161b22] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                    <SelectItem value="exists">Exists</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Expected value"
                  value={assertion.value}
                  onChange={(e) => {
                    const newAssertions = [...assertions]
                    newAssertions[idx].value = e.target.value
                    setAssertions(newAssertions)
                  }}
                  className="flex-1 bg-[#161b22] border-white/10 text-white"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAssertions(assertions.filter((_, i) => i !== idx))}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADDED Bulk Execute Dialog */}
      <Dialog open={showBulkExecute} onOpenChange={setShowBulkExecute}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Bulk Execute Requests</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select multiple endpoints to execute in sequence
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {Object.values(API_CATALOG)
                .flatMap((cat) => cat.endpoints)
                .map((endpoint) => (
                  <div key={endpoint.path} className="flex items-center space-x-2">
                    <Checkbox
                      checked={bulkRequests.some((r) => r.path === endpoint.path)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setBulkRequests([...bulkRequests, endpoint])
                        } else {
                          setBulkRequests(bulkRequests.filter((r) => r.path !== endpoint.path))
                        }
                      }}
                    />
                    <Label className="text-sm text-gray-300">
                      {endpoint.method} {endpoint.path}
                    </Label>
                  </div>
                ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkExecute(false)}
              className="bg-transparent border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={executeBulk} className="bg-indigo-600 hover:bg-indigo-500">
              Execute {bulkRequests.length} Requests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADDED Chain Requests Dialog */}
      <Dialog open={showChainDialog} onOpenChange={setShowChainDialog}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chain Requests</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a sequence of requests where each can use data from the previous
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {chainedRequests.map((req, idx) => (
              <div key={idx} className="border border-white/10 rounded p-3">
                <div className="text-sm font-medium text-white mb-2">
                  Step {idx + 1}: {req.endpoint.name}
                </div>
                <div className="text-xs text-gray-400">{req.endpoint.path}</div>
                {/* Mapping Editor (simplified for now) */}
                <div className="mt-2 text-xs text-gray-500">
                  Mapping:{" "}
                  {Object.entries(req.mapping).length > 0
                    ? Object.entries(req.mapping)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")
                    : "None"}
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (selectedEndpoint) {
                  // Ensure we don't add duplicates if the same endpoint is already selected
                  if (!chainedRequests.some((req) => req.endpoint.path === selectedEndpoint.path)) {
                    setChainedRequests([...chainedRequests, { endpoint: selectedEndpoint, mapping: {} }])
                  }
                }
              }}
              className="w-full bg-transparent border-white/10"
            >
              Add Current Endpoint to Chain
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChainDialog(false)}
              className="bg-transparent border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={executeChain} className="bg-indigo-600 hover:bg-indigo-500">
              Execute Chain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADDED Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Export Collections</DialogTitle>
            <DialogDescription className="text-gray-400">
              Download your saved requests, collections, and assertions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Saved Requests:</span>
              <span className="font-semibold">{savedRequests.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Assertions:</span>
              <span className="font-semibold">{assertions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="font-semibold capitalize">{environment}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
              className="bg-transparent border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={exportCollections} className="bg-indigo-600 hover:bg-indigo-500">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADDED Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Import Collections</DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload a previously exported Taxu Workbench JSON file
            </DialogDescription>
          </DialogHeader>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(false)}
              className="bg-transparent border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={importCollections} disabled={!importFile} className="bg-indigo-600 hover:bg-indigo-500">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADDED Saved Requests Dialog */}
      <Dialog open={showSavedRequestsDialog} onOpenChange={setShowSavedRequestsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Load Saved Request</DialogTitle>
            <DialogDescription>Select a saved request to load it into the API Explorer</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {savedRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No saved requests yet</p>
                <p className="text-sm">Save a request to load it later</p>
              </div>
            ) : (
              savedRequests.map((request, index) => (
                <button
                  key={index}
                  onClick={() => loadSavedRequest(request)}
                  className="w-full text-left p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          request.method === "GET"
                            ? "bg-blue-500/20 text-blue-400"
                            : request.method === "POST"
                              ? "bg-green-500/20 text-green-400"
                              : request.method === "PUT" || request.method === "PATCH"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {request.method}
                      </span>
                      <span className="text-white font-medium">{request.name || "Untitled Request"}</span>
                    </div>
                    <span className="text-xs text-gray-500">{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-400 font-mono truncate">{request.url}</div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {requestHistory.length > 0 && (
        <div className="w-72 border-l border-white/10 bg-[#0d1117] overflow-auto">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-sm text-white">Recent Requests</h3>
          </div>
          <div className="p-2 space-y-2">
            {requestHistory.map((req, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedEndpoint(req.endpoint)
                  // Optionally set request body and other states based on history
                  setRequestBody("") // Reset body for new selection
                  setResponseData(null) // Clear previous response
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    className={`text-[10px] font-mono px-2 py-0.5 ${
                      req.status >= 200 && req.status < 300
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : req.status === undefined
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" // Handle cases where status might be missing
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {req.status || "Pending"}
                  </Badge>
                  <span className="text-xs font-medium truncate text-white">{req.endpoint.name}</span>
                  {req.assertionsPassed !== undefined &&
                    (req.assertionsPassed ? (
                      <CheckCircle2 className="h-3 w-3 text-green-400 ml-auto" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-400 ml-auto" />
                    ))}
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
