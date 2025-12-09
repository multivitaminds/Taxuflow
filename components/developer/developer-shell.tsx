"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Play, Copy, Eye, EyeOff, RefreshCw, X, Code, Webhook, Terminal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const RESOURCES = [
  {
    category: "Tax Filing",
    items: ["W-2 Forms", "1099-NEC Forms", "Form 941", "Tax Returns", "Filing Status", "E-file Submissions"],
  },
  { category: "Neobank", items: ["Accounts", "Transactions", "Cards", "Transfers", "Bill Pay", "Spending Analysis"] },
  { category: "Investment", items: ["Portfolios", "Holdings", "Trades", "Market Data", "Performance", "Dividends"] },
  { category: "Accounting", items: ["Invoices", "Customers", "Vendors", "Payments", "Bills", "Expenses"] },
]

const METHODS = {
  "W-2 Forms": ["Create", "List", "Retrieve", "Update", "Delete", "Submit"],
  "1099-NEC Forms": ["Create", "List", "Retrieve", "Update", "Delete", "Submit"],
  Accounts: ["Create", "List", "Retrieve", "Update", "Close"],
  Transactions: ["Create", "List", "Retrieve", "Search"],
  Portfolios: ["Create", "List", "Retrieve", "Update", "Rebalance"],
  Invoices: ["Create", "List", "Retrieve", "Update", "Send", "Void"],
}

const LANGUAGES = [
  { value: "curl", label: "cURL" },
  { value: "taxu-cli", label: "Taxu CLI" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "dotnet", label: ".NET" },
]

const CODE_EXAMPLES = {
  nodejs: `// Set your secret key
const taxu = require('taxu')('sk_test_51Sigt...')

const w2 = await taxu.w2Forms.create({
  employee_name: 'John Doe',
  ssn: '123-45-6789',
  wages: 75000,
  federal_tax_withheld: 12500,
  tax_year: 2024
})

console.log(w2)`,
  python: `# Set your secret key
import taxu
taxu.api_key = "sk_test_51Sigt..."

w2 = taxu.W2Form.create(
  employee_name="John Doe",
  ssn="123-45-6789",
  wages=75000,
  federal_tax_withheld=12500,
  tax_year=2024
)

print(w2)`,
  curl: `curl https://api.taxu.com/v1/w2-forms \\
  -u sk_test_51Sigt...: \\
  -d employee_name="John Doe" \\
  -d ssn="123-45-6789" \\
  -d wages=75000 \\
  -d federal_tax_withheld=12500 \\
  -d tax_year=2024`,
}

export function DeveloperShell() {
  const [selectedResource, setSelectedResource] = useState<string>("")
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [selectedLanguage, setSelectedLanguage] = useState("nodejs")
  const [searchQuery, setSearchQuery] = useState("")
  const [showApiExplorer, setShowApiExplorer] = useState(true)
  const [shellHistory, setShellHistory] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [commandInput, setCommandInput] = useState("")
  const [shellOutput, setShellOutput] = useState<Array<{ type: "command" | "output" | "error"; text: string }>>([])
  const [showCodeBlock, setShowCodeBlock] = useState(true)

  useEffect(() => {
    const loadSavedRequests = async () => {
      try {
        const response = await fetch("/api/developer/test-requests")
        if (response.ok) {
          const { requests } = await response.json()
          // Update state with saved requests
          console.log("[v0] Loaded saved test requests:", requests)
          setShellHistory(requests)
        }
      } catch (error) {
        console.error("[v0] Failed to load test requests:", error)
      }
    }

    loadSavedRequests()
  }, [])

  const filteredResources = RESOURCES.map((category) => ({
    ...category,
    items: category.items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter((category) => category.items.length > 0)

  const executeCommand = async () => {
    if (!commandInput.trim()) return

    setShellOutput((prev) => [...prev, { type: "command", text: `$ ${commandInput}` }])

    try {
      // Execute the API request through the execute endpoint
      const response = await fetch("/api/developer/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: selectedMethod || "GET",
          endpoint: selectedResource || "/api/v1/status",
          headers: {},
          body: null,
          saveRequest: true,
          requestName: `Shell: ${commandInput}`,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setShellOutput((prev) => [
          ...prev,
          {
            type: "output",
            text: `Success! Response (${data.responseTime}ms):\n${JSON.stringify(data.responseBody, null, 2)}`,
          },
        ])
      } else {
        setShellOutput((prev) => [...prev, { type: "error", text: `Error: ${data.error || "Request failed"}` }])
      }
    } catch (error) {
      setShellOutput((prev) => [...prev, { type: "error", text: `Error executing command: ${error}` }])
    }

    setCommandInput("")
  }

  const copyCode = () => {
    const code = CODE_EXAMPLES[selectedLanguage as keyof typeof CODE_EXAMPLES]
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="flex h-screen bg-[#f6f9fc] dark:bg-slate-950">
      {/* Main Shell Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation - Enhanced with Stripe styling */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-[#0a2540] dark:text-white">Workbench</h1>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Test Mode</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiExplorer(!showApiExplorer)}
                className="text-slate-600 dark:text-slate-400 hover:text-[#635bff] hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                {showApiExplorer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                API Explorer
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:bg-slate-100">
                + New pane
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList className="bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 space-x-6">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="webhooks"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Webhooks
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Logs
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Health
              </TabsTrigger>
              <TabsTrigger
                value="inspector"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Inspector
              </TabsTrigger>
              <TabsTrigger
                value="shell"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#635bff] data-[state=active]:text-[#635bff] data-[state=active]:bg-transparent pb-3 px-0 font-medium text-slate-600 hover:text-slate-900"
              >
                Shell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 p-6 overflow-auto bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <pre className="text-[#635bff] dark:text-[#8b7dff] mb-6 font-mono text-[10px] leading-tight select-none">
                  {`
  ████████╗ █████╗ ██╗  ██╗██╗   ██╗
  ╚══██╔══╝██╔══██╗╚██╗██╔╝██║   ██║
     ██║   ███████║ ╚███╔╝ ██║   ██║
     ██║   ██╔══██║ ██╔██╗ ██║   ██║
     ██║   ██║  ██║██╔╝ ██╗╚██████╔╝
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ 
`}
                </pre>

                <h2 className="text-2xl font-semibold text-[#0a2540] dark:text-white mb-3">Welcome to Taxu Shell!</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  Taxu Shell is a browser-based shell with the Taxu CLI pre-installed. You can use it to manage your
                  Taxu resources in test mode:
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5">—</span>
                    <div className="flex-1">
                      <span className="text-slate-700 dark:text-slate-300">View supported Taxu commands: </span>
                      <code className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-mono text-sm rounded border border-indigo-100 dark:border-indigo-800">
                        taxu help
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5">—</span>
                    <div className="flex-1">
                      <span className="text-slate-700 dark:text-slate-300">Find webhook events: </span>
                      <code className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-mono text-sm rounded border border-indigo-100 dark:border-indigo-800">
                        taxu trigger [event]
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5">—</span>
                    <div className="flex-1">
                      <span className="text-slate-700 dark:text-slate-300">Listen for webhook events: </span>
                      <code className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-mono text-sm rounded border border-indigo-100 dark:border-indigo-800">
                        taxu listen
                      </code>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-0.5">—</span>
                    <div className="flex-1">
                      <span className="text-slate-700 dark:text-slate-300">Call Taxu APIs: </span>
                      <code className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-mono text-sm rounded border border-indigo-100 dark:border-indigo-800">
                        taxu [api resource] [operation]
                      </code>
                      <span className="text-slate-700 dark:text-slate-300"> (e.g., </span>
                      <code className="inline-block px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-mono text-sm rounded border border-indigo-100 dark:border-indigo-800">
                        taxu w2_forms list
                      </code>
                      <span className="text-slate-700 dark:text-slate-300">)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1e293b] rounded-lg overflow-hidden shadow-xl border border-slate-700">
                  <div className="bg-[#0f172a] px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400">Shell</span>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <div className="space-y-2 mb-4">
                      {shellHistory.map((cmd, i) => (
                        <div key={i} className="text-slate-300">
                          {cmd}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">Shell &gt;</span>
                      <Input
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                        placeholder="taxu w2_forms create --amount=1099 --currency=usd"
                        className="flex-1 bg-transparent border-none text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="mt-0 p-6 overflow-auto bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <h3 className="text-xl font-semibold text-[#0a2540] dark:text-white mb-3">Webhook Testing</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Test webhook integrations by triggering events or listening to real-time webhook deliveries.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                        <Webhook className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-[#0a2540] dark:text-white">Trigger Events</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Trigger test webhook events to your endpoint
                    </p>
                    <code className="text-xs bg-slate-900 text-slate-300 px-3 py-2 rounded block font-mono">
                      $ taxu trigger w2.created
                    </code>
                  </div>

                  <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                        <Terminal className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-[#0a2540] dark:text-white">Listen Mode</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Listen for incoming webhook events
                    </p>
                    <code className="text-xs bg-slate-900 text-slate-300 px-3 py-2 rounded block font-mono">
                      $ taxu listen
                    </code>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0 p-6 overflow-auto bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <h3 className="text-xl font-semibold text-[#0a2540] dark:text-white mb-3">Event Log</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  View all API events and webhook deliveries in real-time.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Recent Events</span>
                      <span className="text-xs text-slate-500">Last 24 hours</span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {[
                      { event: "w2.created", time: "2 minutes ago", status: "success" },
                      { event: "account.updated", time: "15 minutes ago", status: "success" },
                      { event: "transaction.created", time: "1 hour ago", status: "success" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
                          <code className="text-sm text-indigo-600 dark:text-indigo-400 font-mono">{item.event}</code>
                        </div>
                        <span className="text-sm text-slate-500">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-0 p-6 bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <h3 className="text-xl font-semibold text-[#0a2540] dark:text-white mb-3">API Request Logs</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  View detailed logs of all API requests and responses.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-0 p-6 bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <h3 className="text-xl font-semibold text-[#0a2540] dark:text-white mb-3">System Health</h3>
                <p className="text-slate-600 dark:text-slate-400">Monitor API health and performance metrics.</p>
              </div>
            </TabsContent>

            <TabsContent value="inspector" className="mt-0 p-6 bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <h3 className="text-xl font-semibold text-[#0a2540] dark:text-white mb-3">API Inspector</h3>
                <p className="text-slate-600 dark:text-slate-400">Inspect API requests, responses, and debug issues.</p>
              </div>
            </TabsContent>

            <TabsContent value="shell" className="mt-0 p-6 overflow-auto bg-white dark:bg-slate-950">
              <div className="max-w-5xl">
                <div className="bg-[#1e293b] rounded-lg overflow-hidden shadow-xl border border-slate-700">
                  <div className="bg-[#0f172a] px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400">Taxu Shell v1.0.0 - Interactive Mode</span>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                  </div>
                  <div className="p-4 font-mono text-sm min-h-[500px] max-h-[600px] overflow-auto">
                    <div className="text-green-400 mb-4">
                      Welcome to Taxu Shell! Type 'help' for available commands.
                    </div>

                    {/* Shell Output */}
                    {shellOutput.map((line, i) => (
                      <div
                        key={i}
                        className={
                          line.type === "command"
                            ? "text-slate-300 mb-1"
                            : line.type === "error"
                              ? "text-red-400 mb-3"
                              : "text-slate-400 mb-3 whitespace-pre-line"
                        }
                      >
                        {line.text}
                      </div>
                    ))}

                    {/* Command Input */}
                    <div className="flex items-center gap-2 sticky bottom-0 bg-[#1e293b] pt-2">
                      <span className="text-green-400">$</span>
                      <Input
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                        placeholder="Enter command..."
                        className="flex-1 bg-transparent border-none text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showApiExplorer && (
        <div className="w-[440px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shadow-xl">
          {/* Explorer Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <h2 className="font-semibold text-[#0a2540] dark:text-white text-lg">API Explorer</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiExplorer(false)}
              className="h-8 w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger className="w-full h-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {filteredResources.map((category) => (
                  <div key={category.category}>
                    <div className="px-2 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 sticky top-0 uppercase tracking-wide">
                      {category.category}
                    </div>
                    {category.items.map((item) => (
                      <SelectItem key={item} value={item} className="pl-4 cursor-pointer">
                        {item}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMethod} onValueChange={setSelectedMethod} disabled={!selectedResource}>
              <SelectTrigger className="w-full h-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-indigo-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {selectedResource &&
                  METHODS[selectedResource as keyof typeof METHODS]?.map((method) => (
                    <SelectItem key={method} value={method} className="cursor-pointer">
                      {method}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Parameters & Code */}
          <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900/20">
            {selectedResource && selectedMethod ? (
              <div className="p-4 space-y-4">
                <Tabs defaultValue="parameters" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <TabsTrigger
                      value="parameters"
                      className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-900/30 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 font-medium"
                    >
                      Parameters
                    </TabsTrigger>
                    <TabsTrigger
                      value="headers"
                      className="data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-900/30 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 font-medium"
                    >
                      Headers
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="parameters"
                    className="space-y-3 mt-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                        amount
                      </label>
                      <Input placeholder="1099" className="h-9 border-slate-300 dark:border-slate-700" />
                      <span className="text-xs text-slate-500 mt-1 block">number</span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                        currency
                      </label>
                      <Input placeholder="usd" className="h-9 border-slate-300 dark:border-slate-700" />
                      <span className="text-xs text-slate-500 mt-1 block">string</span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                        tax_year
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-2 py-0.5 rounded-full font-medium">
                          Optional
                        </span>
                      </label>
                      <Input placeholder="2024" className="h-9 border-slate-300 dark:border-slate-700" />
                      <span className="text-xs text-slate-500 mt-1 block">number</span>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="headers"
                    className="mt-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400 py-4 text-center">
                      No custom headers required
                    </p>
                  </TabsContent>
                </Tabs>

                <div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full bg-[#1e293b] text-slate-100 border-slate-700 hover:bg-[#0f172a] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f172a] border-slate-700">
                      {LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang.value}
                          value={lang.value}
                          className="text-slate-100 focus:bg-slate-700 focus:text-white cursor-pointer"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showCodeBlock && (
                  <div className="bg-[#1e293b] rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#0f172a] border-b border-slate-700">
                      <span className="text-xs font-mono text-slate-400">Code Example</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyCode}
                        className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Copy className="w-3 h-3 mr-1.5" />
                        <span className="text-xs">Copy</span>
                      </Button>
                    </div>
                    <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-64">
                      <pre>
                        <code>{CODE_EXAMPLES[selectedLanguage as keyof typeof CODE_EXAMPLES]}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/20 flex items-center justify-center mb-4 shadow-sm">
                  <Code className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  Select a resource and method to get started
                </p>
                <p className="text-xs text-slate-500">
                  Choose from Tax Filing, Neobank, Investment, or Accounting APIs
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-950">
            <Button
              className="w-full bg-[#635bff] hover:bg-[#5046e5] text-white h-10 font-medium shadow-sm hover:shadow-md transition-all"
              disabled={!selectedResource || !selectedMethod}
            >
              <Play className="w-4 h-4 mr-2" />
              Run request
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400"
                onClick={() => setShowCodeBlock(!showCodeBlock)}
              >
                {showCodeBlock ? "Hide" : "Show"} code
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-400"
              >
                <RefreshCw className="w-3 h-3 mr-1.5" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
