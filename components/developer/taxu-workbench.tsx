"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Terminal, Play, Save, Clock, FileCode, Zap, BookOpen, Search, ChevronRight, Copy, History } from "lucide-react"
import { API_CATALOG, type ApiEndpoint } from "@/lib/api-catalog"
import { toast } from "sonner"

interface TerminalLine {
  id: string
  type: "command" | "output" | "error" | "success"
  content: string
  timestamp: Date
}

interface SavedRequest {
  id: string
  name: string
  endpoint: ApiEndpoint
  body?: string
  headers?: Record<string, string>
  timestamp: Date
}

export function TaxuWorkbench() {
  const [activeView, setActiveView] = useState<"workbench" | "shell">("workbench")
  const [selectedCategory, setSelectedCategory] = useState<string>("Tax Filing")
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState("")
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [headers, setHeaders] = useState<Record<string, string>>({
    Authorization: "Bearer your-api-key",
    "Content-Type": "application/json",
  })

  // Shell state
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: "welcome",
      type: "success",
      content: "Welcome to TaxuShell! Type 'help' for available commands or switch to Workbench for API testing.",
      timestamp: new Date(),
    },
  ])
  const [commandInput, setCommandInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Saved requests
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState("")
  const [showDocsDialog, setShowDocsDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (selectedEndpoint?.requestBody?.example) {
      setRequestBody(selectedEndpoint.requestBody.example)
    }
  }, [selectedEndpoint])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  const handleSendRequest = async () => {
    if (!selectedEndpoint) return

    setIsLoading(true)
    const startTime = Date.now()

    try {
      const res = await fetch("/api/developer/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: selectedEndpoint.path,
          method: selectedEndpoint.method,
          body: requestBody ? JSON.parse(requestBody) : undefined,
          headers,
        }),
      })

      const data = await res.json()
      const endTime = Date.now()

      setResponse(JSON.stringify(data, null, 2))
      setResponseStatus(res.status)
      setResponseTime(endTime - startTime)

      toast.success("Request executed successfully")
    } catch (error) {
      console.error("[v0] Request execution error:", error)
      setResponse(JSON.stringify({ error: "Request failed" }, null, 2))
      setResponseStatus(500)
      toast.error("Request execution failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveRequest = () => {
    if (!selectedEndpoint || !saveName) return

    const newRequest: SavedRequest = {
      id: `req_${Date.now()}`,
      name: saveName,
      endpoint: selectedEndpoint,
      body: requestBody,
      headers,
      timestamp: new Date(),
    }

    setSavedRequests([...savedRequests, newRequest])
    setShowSaveDialog(false)
    setSaveName("")
    toast.success("Request saved successfully")
  }

  const handleLoadRequest = (request: SavedRequest) => {
    setSelectedEndpoint(request.endpoint)
    setRequestBody(request.body || "")
    setHeaders(request.headers || headers)
    toast.success("Request loaded")
  }

  const handleCopyCode = (code: string, language: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`${language} code copied!`)
  }

  const generateCodeSnippet = (endpoint: ApiEndpoint, lang: string): string => {
    const baseUrl = "https://api.taxu.io"
    const fullUrl = `${baseUrl}${endpoint.path}`

    switch (lang) {
      case "curl":
        return `curl -X ${endpoint.method} "${fullUrl}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody || "{}"}'`

      case "node":
        return `const response = await fetch("${fullUrl}", {
  method: "${endpoint.method}",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${requestBody || "{}"})
});

const data = await response.json();
console.log(data);`

      case "python":
        return `import requests

response = requests.${endpoint.method.toLowerCase()}(
    "${fullUrl}",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json=${requestBody || "{}"}
)

data = response.json()
print(data)`

      default:
        return ""
    }
  }

  // Terminal command execution
  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Add command line
    addTerminalLine("command", `$ ${trimmedCmd}`)

    // Execute command
    const [mainCmd, ...args] = trimmedCmd.split(" ")

    switch (mainCmd.toLowerCase()) {
      case "help":
        addTerminalLine(
          "output",
          `Available Commands:
  
  help              - Show this help message
  clear             - Clear terminal
  taxu filings list - List all tax filings
  taxu recipients list - List all recipients
  taxu api test     - Test API connectivity
  taxu docs         - Open API documentation
  taxu version      - Show Taxu version
  exit              - Close terminal`,
        )
        break

      case "clear":
        setTerminalLines([])
        break

      case "taxu":
        handleTaxuCommand(args)
        break

      case "exit":
        addTerminalLine("success", "Terminal session ended. Switch to Workbench to continue.")
        break

      default:
        addTerminalLine("error", `Command not found: ${mainCmd}. Type 'help' for available commands.`)
    }

    setCommandInput("")
  }

  const handleTaxuCommand = (args: string[]) => {
    const [subCmd, ...subArgs] = args

    switch (subCmd) {
      case "version":
        addTerminalLine("success", "Taxu Platform v1.0.0 (Build 2024.01)")
        break

      case "filings":
        if (subArgs[0] === "list") {
          addTerminalLine(
            "output",
            `Recent Filings:
  [1] filing_abc123 - 1099-NEC - Status: Accepted
  [2] filing_def456 - W-2 - Status: Pending
  [3] filing_ghi789 - Form 941 - Status: Accepted`,
          )
        }
        break

      case "recipients":
        if (subArgs[0] === "list") {
          addTerminalLine(
            "output",
            `Recipients:
  [1] John Doe - ***-**-6789
  [2] Jane Smith - ***-**-1234
  [3] Mike Johnson - ***-**-5678`,
          )
        }
        break

      case "api":
        if (subArgs[0] === "test") {
          addTerminalLine("output", "Testing API connectivity...")
          setTimeout(() => {
            addTerminalLine("success", "✓ API connection successful")
            addTerminalLine("success", "✓ Authentication valid")
            addTerminalLine("success", "✓ All systems operational")
          }, 1000)
        }
        break

      case "docs":
        addTerminalLine("success", "Opening API documentation...")
        setShowDocsDialog(true)
        break

      default:
        addTerminalLine("error", `Unknown taxu command: ${subCmd}`)
    }
  }

  const addTerminalLine = (type: TerminalLine["type"], content: string) => {
    setTerminalLines((prev) => [
      ...prev,
      {
        id: `line_${Date.now()}_${Math.random()}`,
        type,
        content,
        timestamp: new Date(),
      },
    ])
  }

  const handleTerminalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(commandInput)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommandInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCommandInput("")
        } else {
          setHistoryIndex(newIndex)
          setCommandInput(commandHistory[newIndex])
        }
      }
    }
  }

  const filteredEndpoints = Object.entries(API_CATALOG).flatMap(([_, category]) =>
    category.endpoints.filter(
      (endpoint) =>
        endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Taxu Workbench</h1>
              <p className="text-xs text-gray-400">Developer Platform</p>
            </div>
          </div>

          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900">
              <TabsTrigger value="workbench" className="data-[state=active]:bg-indigo-600">
                <FileCode className="w-4 h-4 mr-2" />
                Workbench
              </TabsTrigger>
              <TabsTrigger value="shell" className="data-[state=active]:bg-indigo-600">
                <Terminal className="w-4 h-4 mr-2" />
                Shell
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        {activeView === "workbench" ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4 bg-slate-900 grid grid-cols-2 gap-1">
                <TabsTrigger value="Tax Filing" className="text-xs">
                  Tax Filing
                </TabsTrigger>
                <TabsTrigger value="Accounting" className="text-xs">
                  Accounting
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 px-4">
                {searchTerm ? (
                  <div className="space-y-2 py-4">
                    <p className="text-xs text-gray-400 mb-2">Search Results ({filteredEndpoints.length})</p>
                    {filteredEndpoints.map((endpoint) => (
                      <button
                        key={endpoint.path}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedEndpoint?.path === endpoint.path
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              endpoint.method === "GET"
                                ? "border-green-500 text-green-400"
                                : endpoint.method === "POST"
                                  ? "border-blue-500 text-blue-400"
                                  : endpoint.method === "DELETE"
                                    ? "border-red-500 text-red-400"
                                    : "border-yellow-500 text-yellow-400"
                            }`}
                          >
                            {endpoint.method}
                          </Badge>
                          <span className="text-xs text-white font-medium truncate">{endpoint.name}</span>
                        </div>
                        <code className="text-xs text-gray-400 font-mono">{endpoint.path}</code>
                      </button>
                    ))}
                  </div>
                ) : (
                  Object.entries(API_CATALOG).map(([key, category]) => (
                    <TabsContent key={key} value={key} className="space-y-2 mt-4">
                      {category.endpoints.map((endpoint) => (
                        <button
                          key={endpoint.path}
                          onClick={() => setSelectedEndpoint(endpoint)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedEndpoint?.path === endpoint.path
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                endpoint.method === "GET"
                                  ? "border-green-500 text-green-400"
                                  : endpoint.method === "POST"
                                    ? "border-blue-500 text-blue-400"
                                    : endpoint.method === "DELETE"
                                      ? "border-red-500 text-red-400"
                                      : "border-yellow-500 text-yellow-400"
                              }`}
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="text-xs text-white font-medium truncate">{endpoint.name}</span>
                          </div>
                          <code className="text-xs text-gray-400 font-mono">{endpoint.path}</code>
                        </button>
                      ))}
                    </TabsContent>
                  ))
                )}
              </ScrollArea>
            </Tabs>

            {/* Saved Requests */}
            {savedRequests.length > 0 && (
              <div className="p-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Saved Requests</p>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-gray-400 hover:text-white">
                    <History className="w-3 h-3 mr-1" />
                    View All
                  </Button>
                </div>
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {savedRequests.slice(-5).map((request) => (
                      <button
                        key={request.id}
                        onClick={() => handleLoadRequest(request)}
                        className="w-full text-left p-2 rounded border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors"
                      >
                        <p className="text-xs text-white font-medium truncate">{request.name}</p>
                        <p className="text-xs text-gray-400 truncate">{request.endpoint.path}</p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white mb-2">Quick Commands</h3>
                <div className="space-y-2">
                  {[
                    { cmd: "taxu filings list", desc: "List tax filings" },
                    { cmd: "taxu recipients list", desc: "List recipients" },
                    { cmd: "taxu api test", desc: "Test API connection" },
                    { cmd: "help", desc: "Show all commands" },
                  ].map((item) => (
                    <button
                      key={item.cmd}
                      onClick={() => executeCommand(item.cmd)}
                      className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors group"
                    >
                      <code className="text-xs text-indigo-400 font-mono block mb-1">{item.cmd}</code>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeView === "workbench" ? (
          <>
            {/* Toolbar */}
            <div className="h-14 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                {selectedEndpoint && (
                  <>
                    <Badge
                      variant="outline"
                      className={`${
                        selectedEndpoint.method === "GET"
                          ? "border-green-500 text-green-400"
                          : selectedEndpoint.method === "POST"
                            ? "border-blue-500 text-blue-400"
                            : selectedEndpoint.method === "DELETE"
                              ? "border-red-500 text-red-400"
                              : "border-yellow-500 text-yellow-400"
                      }`}
                    >
                      {selectedEndpoint.method}
                    </Badge>
                    <code className="text-sm text-gray-300 font-mono">{selectedEndpoint.path}</code>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDocsDialog(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Docs
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowSaveDialog(true)}
                  disabled={!selectedEndpoint}
                  className="text-gray-400 hover:text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendRequest}
                  disabled={!selectedEndpoint || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Request/Response */}
            {selectedEndpoint ? (
              <div className="flex-1 grid grid-cols-2 divide-x divide-slate-800 overflow-hidden">
                {/* Request Panel */}
                <div className="flex flex-col overflow-hidden">
                  <Tabs defaultValue="body" className="flex-1 flex flex-col">
                    <div className="border-b border-slate-800 bg-slate-950/30 px-6 pt-4">
                      <TabsList className="bg-slate-900">
                        <TabsTrigger value="body">Request Body</TabsTrigger>
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="body" className="flex-1 p-6 m-0">
                      <textarea
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="w-full h-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-sm font-mono text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter request body (JSON)"
                      />
                    </TabsContent>

                    <TabsContent value="headers" className="flex-1 p-6 m-0">
                      <div className="space-y-3">
                        {Object.entries(headers).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 gap-3">
                            <Input value={key} readOnly className="bg-slate-950 border-slate-800 text-gray-300" />
                            <Input
                              value={value}
                              onChange={(e) => setHeaders({ ...headers, [key]: e.target.value })}
                              className="bg-slate-950 border-slate-800 text-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="code" className="flex-1 p-6 m-0 overflow-auto">
                      <Tabs defaultValue="curl" className="w-full">
                        <TabsList className="bg-slate-900 mb-4">
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                          <TabsTrigger value="node">Node.js</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                        </TabsList>

                        {["curl", "node", "python"].map((lang) => (
                          <TabsContent key={lang} value={lang} className="relative">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyCode(generateCodeSnippet(selectedEndpoint, lang), lang)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-gray-300 overflow-x-auto">
                              <code>{generateCodeSnippet(selectedEndpoint, lang)}</code>
                            </pre>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Response Panel */}
                <div className="flex flex-col overflow-hidden bg-slate-950/30">
                  <div className="border-b border-slate-800 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white">Response</h3>
                      {responseStatus && (
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={responseStatus >= 200 && responseStatus < 300 ? "default" : "destructive"}
                            className={
                              responseStatus >= 200 && responseStatus < 300
                                ? "bg-green-500/10 text-green-400 border-green-500"
                                : ""
                            }
                          >
                            {responseStatus}
                          </Badge>
                          {responseTime && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              {responseTime}ms
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    {response ? (
                      <pre className="text-sm font-mono text-gray-300">
                        <code>{response}</code>
                      </pre>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Send a request to see the response</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Select an API Endpoint</h3>
                  <p className="text-gray-400">Choose an endpoint from the sidebar to get started</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col bg-black/80 relative">
            {/* Terminal Header */}
            <div className="h-14 border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-400 font-mono">taxu@shell:~</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setTerminalLines([])}
                  className="text-gray-400 hover:text-white"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Terminal Content */}
            <ScrollArea ref={terminalRef} className="flex-1 p-6">
              <div className="space-y-2 font-mono text-sm">
                {terminalLines.map((line) => (
                  <div
                    key={line.id}
                    className={`${
                      line.type === "command"
                        ? "text-gray-300"
                        : line.type === "error"
                          ? "text-red-400"
                          : line.type === "success"
                            ? "text-green-400"
                            : "text-gray-400"
                    }`}
                  >
                    {line.content}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Terminal Input */}
            <div className="border-t border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-green-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-gray-300 font-mono text-sm"
                  placeholder="Type a command..."
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-slate-950 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Save Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Give this request a name to save it for later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Request name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="bg-slate-900 border-slate-800 text-white"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRequest} disabled={!saveName} className="bg-indigo-600">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documentation Dialog */}
      <Dialog open={showDocsDialog} onOpenChange={setShowDocsDialog}>
        <DialogContent className="bg-slate-950 border-slate-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">API Documentation</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            <div className="space-y-6 pr-6">
              {selectedEndpoint && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">{selectedEndpoint.name}</h4>
                    <p className="text-sm text-gray-400">{selectedEndpoint.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Endpoint</h4>
                    <code className="block p-3 bg-slate-900 rounded text-sm text-gray-300 font-mono">
                      {selectedEndpoint.method} {selectedEndpoint.path}
                    </code>
                  </div>

                  {selectedEndpoint.parameters && (
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Parameters</h4>
                      <div className="space-y-2">
                        {selectedEndpoint.parameters.map((param) => (
                          <div key={param.name} className="p-3 bg-slate-900 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-sm text-indigo-400 font-mono">{param.name}</code>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  required
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEndpoint.responseExample && (
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Response Example</h4>
                      <pre className="p-3 bg-slate-900 rounded text-xs text-gray-300 font-mono overflow-x-auto">
                        <code>{selectedEndpoint.responseExample}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
