"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Play,
  Settings,
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Globe,
  Trash2,
  Terminal,
  FileText,
  TrendingUp,
  Wallet,
  BarChart3,
  Zap,
  Layers,
  Command,
  Maximize2,
  Minimize2,
  Save,
  Copy,
  Eye,
  Filter,
  BookOpen,
  History,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

const PLATFORMS = {
  tax: {
    name: "Tax Filing",
    icon: FileText,
    color: "emerald",
    gradient: "from-emerald-600 via-emerald-500 to-teal-600",
    description: "Manage tax forms, calculations, and e-filing",
    endpoints: 12,
  },
  banking: {
    name: "Banking",
    icon: Wallet,
    color: "blue",
    gradient: "from-blue-600 via-blue-500 to-cyan-600",
    description: "Handle accounts, transfers, and transactions",
    endpoints: 18,
  },
  accounting: {
    name: "Accounting",
    icon: BarChart3,
    color: "violet",
    gradient: "from-violet-600 via-violet-500 to-purple-600",
    description: "Bookkeeping, invoices, and financial reports",
    endpoints: 24,
  },
  investment: {
    name: "Investment",
    icon: TrendingUp,
    color: "amber",
    gradient: "from-amber-600 via-amber-500 to-orange-600",
    description: "Portfolio management and trading operations",
    endpoints: 15,
  },
}

const TERMINAL_COMMANDS = {
  help: {
    description: "Display available commands and documentation",
    usage: "taxu help [command]",
    category: "General",
    examples: ["taxu help", "taxu help tax", "taxu help banking"],
  },
  auth: {
    description: "Authentication and API key management",
    usage: "taxu auth <action> [options]",
    category: "Authentication",
    examples: [
      "taxu auth login --key sk_test_...",
      "taxu auth whoami",
      "taxu auth keys list",
      "taxu auth keys create --name 'Production Key'",
    ],
  },
  tax: {
    description: "Tax filing and calculation operations",
    usage: "taxu tax <action> [options]",
    category: "Tax Filing",
    examples: [
      "taxu tax calculate --income 75000 --status single --deductions 12000",
      "taxu tax file-1099 --recipient rec_123 --amount 5000 --year 2024",
      "taxu tax status --year 2024 --form 1040",
      "taxu tax forms list",
      "taxu tax estimate --income 85000 --quarter Q1",
    ],
  },
  banking: {
    description: "Banking and payment operations",
    usage: "taxu banking <action> [options]",
    category: "Banking",
    examples: [
      "taxu banking accounts list",
      "taxu banking accounts create --type checking --name 'Business'",
      "taxu banking transfer --from acc_123 --to acc_456 --amount 1000",
      "taxu banking cards issue --type debit --holder 'John Doe'",
      "taxu banking transactions --account acc_123 --limit 50",
      "taxu banking balance --account acc_123",
    ],
  },
  accounting: {
    description: "Accounting and bookkeeping operations",
    usage: "taxu accounting <action> [options]",
    category: "Accounting",
    examples: [
      "taxu accounting invoices create --customer cust_123 --amount 1500",
      "taxu accounting expenses track --amount 250 --category office",
      "taxu accounting reports generate --type profit-loss --period monthly",
      "taxu accounting payroll run --period 2024-01",
      "taxu accounting reconcile --account acc_123 --date 2024-01-31",
    ],
  },
  investment: {
    description: "Investment and portfolio operations",
    usage: "taxu investment <action> [options]",
    category: "Investment",
    examples: [
      "taxu investment portfolio create --name 'Growth' --risk moderate",
      "taxu investment trade --symbol AAPL --quantity 10 --type buy",
      "taxu investment quote --symbol TSLA",
      "taxu investment portfolio list",
      "taxu investment performance --portfolio port_123 --period ytd",
    ],
  },
  api: {
    description: "API testing and debugging",
    usage: "taxu api <action> [options]",
    category: "Developer",
    examples: [
      "taxu api test --endpoint /v1/tax/calculate",
      "taxu api logs --limit 100 --level error",
      "taxu api keys rotate --key sk_test_123",
      "taxu api webhooks list",
    ],
  },
  config: {
    description: "Configuration management",
    usage: "taxu config <action> [options]",
    category: "System",
    examples: [
      "taxu config set --key api_key --value sk_test_...",
      "taxu config get --key environment",
      "taxu config list",
      "taxu config export --file config.json",
    ],
  },
}

export function TaxuShell() {
  // Initial state updates for a better default experience
  const [activeView, setActiveView] = useState<"workbench" | "terminal">("terminal")
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof PLATFORMS | null>(null)
  const [terminalCommands, setTerminalCommands] = useState<
    Array<{ command: string; output: string; timestamp: Date; status: "success" | "error"; duration: number }>
  >([])
  const [currentTerminalCommand, setCurrentTerminalCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTerminalRunning, setIsTerminalRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [environment, setEnvironment] = useState("test")
  const [showSidebar, setShowSidebar] = useState(true)
  // Added state for dialogs and authentication
  const [showSettings, setShowSettings] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [activeTab, setActiveTab] = useState("quick-commands")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [apiKey, setApiKey] = useState("sk_test_**********************")
  const [savedSessions, setSavedSessions] = useState<any[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [sessionName, setSessionName] = useState("")

  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [terminalCommands])

  // Focus input on mount for immediate interaction
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const executeTerminalCommand = async () => {
    if (!currentTerminalCommand.trim() || isTerminalRunning) return

    setIsTerminalRunning(true)
    const cmd = currentTerminalCommand.trim()

    // Add to history
    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)

    const startTime = Date.now()

    // Simulate command execution
    setTimeout(
      () => {
        const output = generateTerminalOutput(cmd)
        const duration = Date.now() - startTime

        setTerminalCommands([
          ...terminalCommands,
          {
            command: cmd,
            output: output.output,
            timestamp: new Date(),
            status: output.status,
            duration,
          },
        ])
        setCurrentTerminalCommand("")
        setIsTerminalRunning(false)

        // Show toast notification based on command status
        if (output.status === "success") {
          toast.success("Command executed successfully")
        } else {
          toast.error("Command failed")
        }
      },
      Math.random() * 800 + 400, // Simulate network latency
    )
  }

  const generateTerminalOutput = (cmd: string): { output: string; status: "success" | "error" } => {
    const [base, action, subAction, ...args] = cmd.split(" ")

    // Handle unknown base command
    if (base !== "taxu") {
      return {
        output: `❌ Command not found: ${base}\n\nDid you mean 'taxu'? Try 'taxu help' for available commands.`,
        status: "error",
      }
    }

    // Handle help command
    if (!action || action === "help") {
      // If a specific command is requested for help
      if (subAction && TERMINAL_COMMANDS[subAction as keyof typeof TERMINAL_COMMANDS]) {
        const cmdInfo = TERMINAL_COMMANDS[subAction as keyof typeof TERMINAL_COMMANDS]
        return {
          output: `📖 ${cmdInfo.description}

Usage:
  ${cmdInfo.usage}

Category: ${cmdInfo.category}

Examples:
${cmdInfo.examples.map((ex, i) => `  ${i + 1}. ${ex}`).join("\n")}

For more information, visit: https://docs.taxu.io/cli/${subAction}`,
          status: "success",
        }
      }

      // General help message
      return {
        output: `🚀 TaxuShell v1.0.0 - Enterprise API Management Platform
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Interactive browser-based shell for managing:
  • Tax-filing operations
  • Banking operations  
  • Accounting operations
  • Investment operations

Available Commands:
  taxu auth          Authentication and API key management
  taxu tax           Tax filing operations (${PLATFORMS.tax.endpoints} endpoints)
  taxu banking       Banking operations (${PLATFORMS.banking.endpoints} endpoints)
  taxu accounting    Accounting operations (${PLATFORMS.accounting.endpoints} endpoints)
  taxu investment    Investment operations (${PLATFORMS.investment.endpoints} endpoints)
  taxu api           API testing and debugging
  taxu config        Configuration management
  taxu help          Show this help message
  
Type 'taxu help <command>' for detailed information on a specific command.

Environment: ${environment === "test" ? "🧪 Test Mode" : "🚀 Production"}
Status: ${isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}`,
        status: "success",
      }
    }

    // Handle auth commands
    if (action === "auth") {
      if (subAction === "login") {
        // Simulate login and return success message
        setIsAuthenticated(true) // Update authentication status
        return {
          output: `✅ Authentication successful

API Key: ${apiKey}
Environment: ${environment}
Permissions: Full Access

You can now execute commands across all platforms.`,
          status: "success",
        }
      }

      if (subAction === "whoami") {
        return {
          output: `👤 Current User Information

API Key: ${apiKey}
Environment: ${environment === "test" ? "Test" : "Production"}
Status: Active
Last Login: ${new Date().toLocaleString()}`,
          status: "success",
        }
      }
    }

    // Handle config commands
    if (action === "config") {
      if (subAction === "list") {
        // Display current configuration
        return {
          output: `⚙️  Current Configuration

environment=${environment}
api_key=${apiKey}
region=us-east-1
timeout=30000
retry_attempts=3`,
          status: "success",
        }
      }
    }

    // Handle platform-specific commands
    if (TERMINAL_COMMANDS[action as keyof typeof TERMINAL_COMMANDS]) {
      const cmdInfo = TERMINAL_COMMANDS[action as keyof typeof TERMINAL_COMMANDS]

      // Check if action is provided for the command
      if (!subAction) {
        return {
          output: `❌ Missing action for '${action}' command\n\n${cmdInfo.usage}\n\nTry one of these examples:\n${cmdInfo.examples
            .slice(0, 3)
            .map((ex, i) => `  ${i + 1}. ${ex}`)
            .join("\n")}`,
          status: "error",
        }
      }

      // Generate realistic response based on action
      const responseData = {
        id: `${action}_${Math.random().toString(36).substr(2, 9)}`,
        type: action,
        action: subAction,
        status: "completed",
        timestamp: new Date().toISOString(),
        environment: environment,
        data: generateMockData(action, subAction), // Use mock data generator
      }

      return {
        output: `✅ ${action.charAt(0).toUpperCase() + action.slice(1)} ${subAction} executed successfully

${JSON.stringify(responseData, null, 2)}

Execution completed in ${Math.floor(Math.random() * 500 + 100)}ms`, // Random duration
        status: "success",
      }
    }

    // Handle unknown commands
    return {
      output: `❌ Unknown command: ${action}

Type 'taxu help' to see all available commands.`,
      status: "error",
    }
  }

  const generateMockData = (action: string, subAction: string) => {
    const mockData: Record<string, any> = {
      tax: {
        calculate: {
          taxable_income: 75000,
          tax_owed: 12450,
          effective_rate: 16.6,
          bracket: "22%",
        },
        "file-1099": {
          form_id: "form_1099_abc123",
          recipient: "rec_123",
          amount: 5000,
          status: "filed",
        },
        status: {
          year: 2024,
          form: "1040",
          status: "filed",
          filed_date: "2024-01-15",
        },
        forms: {
          list: ["1040", "1099-NEC", "W-2"],
        },
        estimate: {
          year: 2024,
          quarter: "Q1",
          estimated_tax: 3150,
        },
      },
      banking: {
        list: [
          { id: "acc_123", type: "checking", balance: 5420.5, currency: "USD" },
          { id: "acc_456", type: "savings", balance: 12000.0, currency: "USD" },
        ],
        transfer: {
          transfer_id: "txn_xyz789",
          from: "acc_123",
          to: "acc_456",
          amount: 1000,
          status: "completed",
        },
        accounts: {
          create: { id: "acc_789", type: "checking", name: "Business", status: "active" },
        },
        cards: {
          issue: { card_id: "card_xyz789", type: "debit", holder: "John Doe", status: "issued" },
        },
        transactions: {
          account: "acc_123",
          limit: 50,
          data: [
            { id: "txn_001", date: "2024-01-10", description: "Grocery Store", amount: -75.2 },
            { id: "txn_002", date: "2024-01-09", description: "Salary Deposit", amount: 2500.0 },
          ],
        },
        balance: {
          account: "acc_123",
          balance: 5420.5,
          currency: "USD",
        },
      },
      accounting: {
        create: {
          invoice_id: "inv_abc123",
          customer: "cust_123",
          amount: 1500,
          status: "draft",
          due_date: "2024-02-15",
        },
        expenses: {
          track: { expense_id: "exp_abc123", amount: 250, category: "office", date: "2024-01-12" },
        },
        reports: {
          generate: { type: "profit-loss", period: "monthly", data: { revenue: 15000, expenses: 8000, profit: 7000 } },
        },
        payroll: {
          run: { period: "2024-01", status: "processed", total_paid: 12000 },
        },
        reconcile: {
          account: "acc_123",
          date: "2024-01-31",
          status: "reconciled",
          discrepancy: 0,
        },
      },
      investment: {
        create: {
          portfolio_id: "port_abc123",
          name: "Growth Portfolio",
          risk_level: "moderate",
          allocation: { stocks: 70, bonds: 20, cash: 10 },
        },
        quote: {
          symbol: "AAPL",
          price: 178.52,
          change: +2.45,
          change_percent: 1.39,
          volume: 54230000,
        },
        list: [
          { id: "port_abc123", name: "Growth Portfolio", value: 150000 },
          { id: "port_def456", name: "Income Portfolio", value: 100000 },
        ],
        performance: {
          portfolio: "port_abc123",
          period: "ytd",
          return_percent: 15.2,
          benchmark_return: 12.5,
        },
      },
      api: {
        test: { endpoint: "/v1/tax/calculate", status: "success", response_time: 120, status_code: 200 },
        logs: { limit: 100, level: "error", entries: [{ timestamp: "...", message: "..." }] },
        keys: { rotate: { key_id: "key_xyz", status: "rotated" } },
        webhooks: { list: [{ id: "wh_abc", url: "...", event: "..." }] },
      },
      config: {
        set: { key: "api_key", value: "sk_test_...", status: "updated" },
        get: { key: "environment", value: "test" },
        list: { environment: "test", api_key: "sk_test_...", region: "us-east-1" },
        export: { file: "config.json", status: "exported" },
      },
    }

    // Return specific mock data or a generic success message
    return mockData[action]?.[subAction] || { message: `${subAction} completed successfully` }
  }

  // Clear terminal command history and display toast
  const clearTerminal = () => {
    setTerminalCommands([])
    toast.success("Terminal cleared")
  }

  // Enhanced download function with duration and status
  const downloadTerminalSession = () => {
    const sessionData = terminalCommands
      .map((c) => `$ ${c.command}\n${c.output}\n[${c.timestamp.toLocaleString()}] [${c.duration}ms] [${c.status}]\n`)
      .join("\n")
    const blob = new Blob([sessionData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taxushell-session-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Session downloaded")
  }

  // Function to save the current terminal session
  const saveSession = () => {
    if (!sessionName.trim()) {
      toast.error("Please enter a session name")
      return
    }

    const session = {
      id: `session_${Date.now()}`,
      name: sessionName,
      commands: terminalCommands,
      timestamp: new Date().toISOString(),
      environment,
    }

    setSavedSessions([...savedSessions, session])
    setShowSaveDialog(false)
    setSessionName("")
    toast.success(`Session "${sessionName}" saved`)
  }

  // Function to load a saved terminal session
  const loadSession = (session: any) => {
    setTerminalCommands(session.commands)
    setEnvironment(session.environment)
    toast.success(`Session "${session.name}" loaded`)
  }

  // Utility to copy commands to clipboard
  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    toast.success("Command copied to clipboard")
  }

  // Enhanced keydown handler for command history and autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeTerminalCommand()
    } else if (e.key === "ArrowUp") {
      e.preventDefault() // Prevent cursor movement
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setCurrentTerminalCommand(commandHistory[commandHistory.length - 1 - newIndex])
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault() // Prevent cursor movement
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentTerminalCommand(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        // Reached the end of history
        setHistoryIndex(-1)
        setCurrentTerminalCommand("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault() // Prevent default tab behavior
      // Simple autocomplete logic
      const commandPrefix = currentTerminalCommand.replace("taxu ", "").trimStart()
      const matches = Object.keys(TERMINAL_COMMANDS).filter(
        (cmd) => cmd.startsWith(commandPrefix) && cmd !== "help", // Exclude 'help' from direct autocomplete
      )
      if (matches.length === 1) {
        setCurrentTerminalCommand(`taxu ${matches[0]} `) // Auto-complete with a space
      }
    }
  }

  // Filter commands for search functionality
  const filteredCommands = Object.entries(TERMINAL_COMMANDS).filter(
    ([key, cmd]) =>
      searchQuery === "" ||
      key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.examples.some((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"} bg-gradient-to-br from-[#0a0a0f] via-[#0d1117] to-[#0a0a0f] text-white flex flex-col`}
    >
      <div className="h-16 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur-md opacity-75 animate-pulse" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-cyan-600 p-2 rounded-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                TaxuShell
              </h1>
              <p className="text-[10px] text-gray-500 font-mono">Enterprise API Workbench v1.0.0</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveView("terminal")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === "terminal"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Command className="w-4 h-4" />
              Terminal
            </button>
            <button
              onClick={() => setActiveView("workbench")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === "workbench"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-4 h-4" />
              Workbench
            </button>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            {Object.entries(PLATFORMS).map(([key, platform]) => {
              const Icon = platform.icon
              const isSelected = selectedPlatform === key
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(isSelected ? null : (key as keyof typeof PLATFORMS))}
                  className={`group relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? `bg-gradient-to-r ${platform.gradient} text-white shadow-lg shadow-${platform.color}-500/20`
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                  title={platform.description}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {platform.name}
                  <Badge className={`ml-1 text-[9px] px-1 py-0 h-4 ${isSelected ? "bg-white/20" : "bg-white/10"}`}>
                    {platform.endpoints}
                  </Badge>

                  {/* Tooltip */}
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                    {platform.description}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-white/10 rotate-45" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={environment} onValueChange={setEnvironment}>
            <SelectTrigger className="w-36 bg-[#161b22] border-white/10 text-white h-9 hover:bg-[#1c2128] transition-colors">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#161b22] border-white/10">
              <SelectItem value="test" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  Test Mode
                </div>
              </SelectItem>
              <SelectItem value="production" className="text-white hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Production
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDocs(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10 h-9 px-3"
            title="Documentation"
          >
            <BookOpen className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10 h-9 px-3"
            title="Save Session"
          >
            <Save className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white hover:bg-white/10 h-9 px-3"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-gray-400 hover:text-white hover:bg-white/10 h-9 px-3"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeView === "terminal" && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              {showSidebar && (
                <div className="w-80 border-r border-white/10 bg-[#0d1117]/50 backdrop-blur-sm flex flex-col">
                  <div className="p-4 border-b border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Command Library
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSidebar(false)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search commands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                      <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <TabsList className="w-full grid grid-cols-2 bg-transparent border-b border-white/10 rounded-none h-10">
                      <TabsTrigger
                        value="quick-commands"
                        className="rounded-none data-[state=active]:bg-white/5 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                      >
                        Quick Commands
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="rounded-none data-[state=active]:bg-white/5 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
                      >
                        History
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="quick-commands" className="flex-1 mt-0">
                      <ScrollArea className="h-[calc(100vh-280px)] p-4">
                        <div className="space-y-4">
                          {filteredCommands.map(([key, cmd]) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                  {cmd.category}
                                </div>
                                <Badge className="text-[9px] bg-white/10">{cmd.examples.length}</Badge>
                              </div>
                              {cmd.examples.map((example, idx) => (
                                <div
                                  key={idx}
                                  className="group relative p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all"
                                >
                                  <button
                                    onClick={() => setCurrentTerminalCommand(example)}
                                    className="w-full text-left text-xs text-gray-300 font-mono flex items-start gap-2"
                                  >
                                    <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-indigo-400 transition-colors mt-0.5 flex-shrink-0" />
                                    <span className="flex-1">{example}</span>
                                  </button>
                                  <button
                                    onClick={() => copyCommand(example)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 mt-0">
                      <ScrollArea className="h-[calc(100vh-280px)] p-4">
                        {commandHistory.length === 0 ? (
                          <div className="text-center text-gray-500 text-sm py-8">
                            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            No command history yet
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {[...commandHistory].reverse().map((cmd, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentTerminalCommand(cmd)}
                                className="w-full text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all text-xs text-gray-300 font-mono group"
                              >
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-gray-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                                  <span className="flex-1 truncate">{cmd}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>

                  <div className="p-4 border-t border-white/10 space-y-2">
                    <Button
                      onClick={clearTerminal}
                      variant="outline"
                      className="w-full bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                      size="sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      Clear Console
                    </Button>
                    <Button
                      onClick={downloadTerminalSession}
                      variant="outline"
                      className="w-full bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white"
                      size="sm"
                      disabled={terminalCommands.length === 0}
                    >
                      <Download className="w-3.5 h-3.5 mr-2" />
                      Download Session
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col bg-[#0a0e1a]">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-6 py-3 bg-[#0d1117] border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {!showSidebar && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSidebar(true)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}

                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                    </div>

                    <span className="text-sm text-gray-400 font-mono">taxushell@taxu.io:{environment}</span>

                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px]">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                      {isAuthenticated ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{terminalCommands.length} commands</span>
                    </div>
                    {terminalCommands.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3" />
                        <span>
                          Avg:{" "}
                          {Math.floor(
                            terminalCommands.reduce((sum, c) => sum + c.duration, 0) / terminalCommands.length,
                          )}
                          ms
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terminal output */}
                <ScrollArea className="flex-1 p-6 font-mono text-sm">
                  {terminalCommands.length === 0 ? (
                    <div className="space-y-4 text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">🚀</div>
                        <div>
                          <p className="text-lg text-gray-400 font-semibold mb-1">Welcome to TaxuShell v1.0.0</p>
                          <p className="text-sm">Enterprise API Management Platform</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <p className="text-gray-400">Interactive browser-based shell for managing:</p>
                        <ul className="space-y-1 ml-4">
                          <li className="flex items-center gap-2">
                            <FileText className="w-3 h-3 text-emerald-400" />
                            Tax-filing operations
                          </li>
                          <li className="flex items-center gap-2">
                            <Wallet className="w-3 h-3 text-blue-400" />
                            Banking operations
                          </li>
                          <li className="flex items-center gap-2">
                            <BarChart3 className="w-3 h-3 text-violet-400" />
                            Accounting operations
                          </li>
                          <li className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-amber-400" />
                            Investment operations
                          </li>
                        </ul>
                      </div>

                      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <p className="text-indigo-400 font-semibold mb-2">💡 Quick Start</p>
                        <p className="text-sm text-gray-400">
                          Type <span className="text-indigo-400 font-semibold">taxu help</span> to get started, or click
                          a quick command from the sidebar.
                        </p>
                      </div>

                      <p className="mt-8 text-gray-600">
                        $<span className="animate-pulse">_</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {terminalCommands.map((cmd, i) => (
                        <div key={i} className="space-y-2 group">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">$</span>
                            <span className="text-cyan-400 flex-1">{cmd.command}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => copyCommand(cmd.command)}
                                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                title="Copy command"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              {cmd.status === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                          </div>
                          <div
                            className={`pl-4 ${cmd.status === "success" ? "text-gray-300" : "text-red-400"} whitespace-pre-wrap`}
                          >
                            {cmd.output}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-4 pl-4">
                            <span>{cmd.timestamp.toLocaleTimeString()}</span>
                            <span className="text-gray-700">•</span>
                            <span className={cmd.status === "success" ? "text-green-600" : "text-red-600"}>
                              {cmd.status}
                            </span>
                            <span className="text-gray-700">•</span>
                            <span>{cmd.duration}ms</span>
                          </div>
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t border-white/10 bg-[#0d1117] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-mono text-sm font-bold">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentTerminalCommand}
                      onChange={(e) => setCurrentTerminalCommand(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTerminalRunning}
                      placeholder="Type a command or press Tab for autocomplete..."
                      className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-gray-600 disabled:opacity-50"
                    />
                    <div className="flex items-center gap-2">
                      {isTerminalRunning && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Running...
                        </div>
                      )}
                      <Button
                        onClick={executeTerminalCommand}
                        disabled={isTerminalRunning || !currentTerminalCommand.trim()}
                        size="sm"
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      >
                        {isTerminalRunning ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-1.5" />
                        )}
                        Run
                      </Button>
                    </div>
                  </div>

                  {/* Keyboard shortcuts hint */}
                  <div className="mt-2 flex items-center gap-4 text-[10px] text-gray-600">
                    <span>↑↓ History</span>
                    <span>Tab Autocomplete</span>
                    <span>Enter Run</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === "workbench" && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-white">Workbench Coming Soon</h2>
              <p className="text-gray-400 max-w-md">
                The visual workbench interface is under development. Use the Terminal for now to interact with all Taxu
                platforms.
              </p>
              <Button
                onClick={() => setActiveView("terminal")}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600"
              >
                <Terminal className="w-4 h-4 mr-2" />
                Go to Terminal
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Save Terminal Session</DialogTitle>
            <DialogDescription className="text-gray-400">
              Give your session a name to save all commands and outputs for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">Session Name</Label>
              <Input
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Tax Filing Demo"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="text-xs text-gray-500">This session contains {terminalCommands.length} commands</div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="border-white/10">
              Cancel
            </Button>
            <Button onClick={saveSession} className="bg-gradient-to-r from-indigo-600 to-indigo-500">
              <Save className="w-4 h-4 mr-2" />
              Save Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>TaxuShell Settings</DialogTitle>
            <DialogDescription className="text-gray-400">
              Configure your shell environment and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">API Key</Label>
              <div className="flex gap-2">
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password" // Keep API key hidden
                  className="bg-white/5 border-white/10 text-white flex-1"
                />
                <Button variant="outline" size="sm" className="border-white/10 bg-transparent">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">Default Environment</Label>
              <Select value={environment} onValueChange={setEnvironment}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#161b22] border-white/10">
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-gray-300 mb-2 block">Saved Sessions ({savedSessions.length})</Label>
              {savedSessions.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center">No saved sessions yet</div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {savedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <div className="text-sm font-medium">{session.name}</div>
                        <div className="text-xs text-gray-500">
                          {session.commands.length} commands • {new Date(session.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => loadSession(session)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDocs} onOpenChange={setShowDocs}>
        <DialogContent className="bg-[#0d1117] border-white/10 text-white max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>TaxuShell Documentation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete command reference and usage examples
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              {Object.entries(TERMINAL_COMMANDS).map(([key, cmd]) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-indigo-500/20 text-indigo-400">{cmd.category}</Badge>
                    <h3 className="text-lg font-semibold">taxu {key}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{cmd.description}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Usage:</div>
                    <code className="block p-2 bg-white/5 rounded border border-white/10 text-xs font-mono text-cyan-400">
                      {cmd.usage}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Examples:</div>
                    <div className="space-y-1">
                      {cmd.examples.map((example, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10 text-xs font-mono text-gray-300 group hover:border-indigo-500/50"
                        >
                          <span className="flex-1">{example}</span>
                          <button
                            onClick={() => {
                              setCurrentTerminalCommand(example)
                              setShowDocs(false)
                              setActiveView("terminal")
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 hover:text-indigo-300"
                          >
                            Try
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
