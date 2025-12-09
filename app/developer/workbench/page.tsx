"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, Play, Trash2, Download, Zap } from "lucide-react"

export default function WorkbenchPage() {
  const [commands, setCommands] = useState<Array<{ command: string; output: string; timestamp: Date }>>([])
  const [currentCommand, setCurrentCommand] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const exampleCommands = [
    "taxu tax calculate --income 75000 --filing-status single",
    "taxu documents upload ./w2-2024.pdf",
    "taxu invoices create --customer cust_123 --amount 1500",
    "taxu accounts create --type checking --initial-deposit 1000",
    "taxu portfolio create --name 'Growth Portfolio' --risk-level moderate",
  ]

  const executeCommand = async () => {
    if (!currentCommand.trim()) return

    setIsRunning(true)
    const cmd = currentCommand

    // Simulate command execution
    setTimeout(() => {
      const mockOutput = generateMockOutput(cmd)
      setCommands([
        ...commands,
        {
          command: cmd,
          output: mockOutput,
          timestamp: new Date(),
        },
      ])
      setCurrentCommand("")
      setIsRunning(false)
    }, 1000)
  }

  const generateMockOutput = (cmd: string): string => {
    if (cmd.includes("tax calculate")) {
      return JSON.stringify(
        {
          success: true,
          refundAmount: 2450,
          federalRefund: 1800,
          stateRefund: 650,
          effectiveTaxRate: "18.67%",
        },
        null,
        2,
      )
    }
    if (cmd.includes("documents upload")) {
      return JSON.stringify(
        {
          success: true,
          documentId: "doc_" + Math.random().toString(36).substr(2, 9),
          status: "uploaded",
          url: "https://blob.vercel-storage.com/...",
        },
        null,
        2,
      )
    }
    if (cmd.includes("invoices create")) {
      return JSON.stringify(
        {
          success: true,
          invoiceId: "inv_" + Math.random().toString(36).substr(2, 9),
          status: "draft",
          amount: 1500,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        null,
        2,
      )
    }
    return JSON.stringify({ success: true, message: "Command executed successfully" }, null, 2)
  }

  const clearConsole = () => setCommands([])

  const downloadSession = () => {
    const sessionData = commands.map((c) => `$ ${c.command}\n${c.output}\n`).join("\n")
    const blob = new Blob([sessionData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `taxu-workbench-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d1117] to-[#161b22] text-white py-16 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-8 h-8 text-[#00d4ff]" />
            <span className="px-3 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full text-sm font-semibold text-[#00d4ff]">
              Beta
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Workbench Shell</h1>
          <p className="text-xl text-slate-400 max-w-3xl">
            Interactive command-line interface for testing Taxu APIs directly in your browser. No installation required.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-[#111] border-slate-800 p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#635bff]" />
                Quick Commands
              </h3>
              <div className="space-y-2">
                {exampleCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCommand(cmd)}
                    className="w-full text-left p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-[#635bff]/50 transition-all text-sm text-slate-300 font-mono"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-[#111] border-slate-800 p-6">
              <h3 className="text-white font-bold mb-4">Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={clearConsole}
                  variant="outline"
                  className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Console
                </Button>
                <Button
                  onClick={downloadSession}
                  variant="outline"
                  className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Session
                </Button>
              </div>
            </Card>
          </div>

          {/* Terminal */}
          <Card className="bg-[#0d1117] border-slate-800 p-0 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-sm text-slate-400 font-mono">taxu-workbench</span>
              </div>
              <span className="text-xs text-slate-500">Connected</span>
            </div>

            {/* Console Output */}
            <div className="p-6 h-[600px] overflow-y-auto font-mono text-sm">
              {commands.length === 0 ? (
                <div className="text-slate-500">
                  <p>Welcome to Taxu Workbench Shell v1.0.0</p>
                  <p className="mt-2">Type a command or click a quick command to get started.</p>
                  <p className="mt-4 text-[#635bff]">$ _</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {commands.map((cmd, i) => (
                    <div key={i} className="space-y-2">
                      <div className="text-[#00d4ff]">
                        <span className="text-slate-500">$</span> {cmd.command}
                      </div>
                      <div className="text-slate-300 pl-4">{cmd.output}</div>
                      <div className="text-xs text-slate-600">{cmd.timestamp.toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Command Input */}
            <div className="border-t border-slate-800 bg-[#161b22] p-4">
              <div className="flex items-center gap-3">
                <span className="text-[#00d4ff] font-mono">$</span>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeCommand()}
                  placeholder="Type a command..."
                  disabled={isRunning}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-slate-600"
                />
                <Button
                  onClick={executeCommand}
                  disabled={isRunning || !currentCommand.trim()}
                  size="sm"
                  className="bg-[#635bff] hover:bg-[#5046e5] text-white"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Run
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="mt-6 bg-[#111] border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Commands</h2>
          <Tabs defaultValue="tax" className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="tax">Tax Filing</TabsTrigger>
              <TabsTrigger value="neobank">Neobank</TabsTrigger>
              <TabsTrigger value="investment">Investment</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
            </TabsList>
            <TabsContent value="tax" className="space-y-4 mt-6">
              <CommandDoc
                command="taxu tax calculate"
                description="Calculate tax refund or liability"
                options="--income, --filing-status, --deductions"
              />
              <CommandDoc
                command="taxu documents upload"
                description="Upload and process tax documents"
                options="--file, --type, --extract"
              />
              <CommandDoc command="taxu tax file-1099" description="File 1099 forms" options="--recipient, --amount" />
            </TabsContent>
            <TabsContent value="neobank" className="space-y-4 mt-6">
              <CommandDoc
                command="taxu accounts create"
                description="Create a new bank account"
                options="--type, --initial-deposit"
              />
              <CommandDoc
                command="taxu transfers initiate"
                description="Initiate money transfer"
                options="--from, --to, --amount"
              />
              <CommandDoc
                command="taxu cards issue"
                description="Issue debit/credit card"
                options="--account, --type"
              />
            </TabsContent>
            <TabsContent value="investment" className="space-y-4 mt-6">
              <CommandDoc
                command="taxu portfolio create"
                description="Create investment portfolio"
                options="--name, --risk-level"
              />
              <CommandDoc
                command="taxu trades execute"
                description="Execute trade order"
                options="--symbol, --quantity, --type"
              />
              <CommandDoc command="taxu stocks quote" description="Get stock quote" options="--symbol" />
            </TabsContent>
            <TabsContent value="accounting" className="space-y-4 mt-6">
              <CommandDoc
                command="taxu invoices create"
                description="Create new invoice"
                options="--customer, --amount, --due-date"
              />
              <CommandDoc
                command="taxu expenses track"
                description="Track expense"
                options="--amount, --category, --date"
              />
              <CommandDoc
                command="taxu reports generate"
                description="Generate financial report"
                options="--type, --period"
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function CommandDoc({ command, description, options }: { command: string; description: string; options: string }) {
  return (
    <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
      <code className="text-[#00d4ff] font-mono text-sm">{command}</code>
      <p className="text-slate-400 text-sm mt-2">{description}</p>
      <p className="text-slate-600 text-xs mt-2">Options: {options}</p>
    </div>
  )
}
