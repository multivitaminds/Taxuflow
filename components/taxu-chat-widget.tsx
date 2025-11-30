"use client"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import React from "react"
import {
  X,
  Send,
  Mic,
  RefreshCw,
  Settings,
  Paperclip,
  ImageIcon,
  MoreHorizontal,
  ChevronDown,
  Download,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { agents as agentData } from "@/data/agents"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChat } from "@ai-sdk/react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: number
}

const agents: Record<string, { name: string; role: string; color: string; avatar: string }> = {}
agentData.forEach((agent) => {
  agents[agent.name] = {
    name: agent.name,
    role: agent.role,
    color: agent.color,
    avatar: agent.name[0],
  }
})

export function TaxuChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<string>("Sam")
  const [isListening, setIsListening] = useState(false)
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-4o-mini")
  const [showSettings, setShowSettings] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down" | null>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const pathname = usePathname()

  const welcomeMessageId = useRef(`welcome-${Date.now()}`).current

  const chatConfig = React.useMemo(
    () => ({
      api: "/api/chat",
      body: {
        agent: currentAgent,
        model: selectedModel,
        context: getContextPrompt(pathname),
      },
      initialMessages: [
        {
          id: welcomeMessageId,
          role: "assistant" as const,
          content: `Hi! I'm ${currentAgent}, your AI ${agents[currentAgent]?.role?.toLowerCase() || "assistant"}. How can I help you with your taxes today?`,
        },
      ],
      onError: (err: Error) => {
        console.error("[v0] Chat error:", JSON.stringify({ error: err.message, details: err.toString() }))
      },
    }),
    [currentAgent, selectedModel, pathname, welcomeMessageId],
  )

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setInput } = useChat(chatConfig)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length])

  useEffect(() => {
    if (messages.length === 0) {
      setFeedbackGiven({})
    }
  }, [messages.length])

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map((m) => `[${new Date(m.createdAt || Date.now()).toLocaleTimeString()}] ${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n")
    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-transcript-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFeedback = (messageId: string, type: "up" | "down") => {
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: type }))
    console.log(`[v0] Feedback for ${messageId}: ${type}`)
  }

  if (!pathname) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        data-chat-widget-button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#FF5722] shadow-lg shadow-orange-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50 group"
        aria-label="Open AI chat"
      >
        <ChevronDown className="w-8 h-8 text-white rotate-180" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      </button>
    )
  }

  const agent = agents[currentAgent]

  if (!agent) {
    return null
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[400px] h-[650px] flex flex-col border-none shadow-2xl z-50 overflow-hidden rounded-2xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold shadow-sm`}
          >
            {agent.avatar}
          </div>
          <div>
            <div className="font-bold text-gray-900 flex items-center gap-1">{agent.name}</div>
            <div className="text-xs text-gray-500">The team can also help</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDownloadTranscript}>
                <Download className="w-4 h-4 mr-2" />
                Download transcript
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowAgentSelector(!showAgentSelector)}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Switch Agent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Collapse window
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Settings & Selectors (Overlay) */}
      {(showSettings || showAgentSelector) && (
        <div className="absolute top-[72px] left-0 right-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100 p-4 animate-in slide-in-from-top-2">
          {showSettings && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Model</p>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-neon/20 outline-none"
              >
                {aiModels.map((model) => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {showAgentSelector && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Agent</p>
              {Object.entries(agents).map(([key, agentData]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentAgent(key)
                    setShowAgentSelector(false)
                  }}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    currentAgent === key ? "bg-blue-50 border border-blue-100" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${agentData.color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {agentData.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900">{agentData.name}</div>
                    <div className="text-xs text-gray-500">{agentData.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1
          const isAssistant = message.role === "assistant"

          return (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm ${
                    message.role === "user"
                      ? "bg-[#FF5722] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>

              {/* Feedback & Metadata for Assistant Messages */}
              {isAssistant && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-500">
                  {isLastMessage && !isLoading && (
                    <div className="flex items-center gap-2 mt-1 ml-1">
                      <span className="text-xs font-medium text-gray-900">Did that answer your question?</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleFeedback(message.id, "up")}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${feedbackGiven[message.id] === "up" ? "text-green-600 bg-green-50" : "text-gray-400"}`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, "down")}
                          className={`p-1 rounded hover:bg-gray-100 transition-colors ${feedbackGiven[message.id] === "down" ? "text-red-600 bg-red-50" : "text-gray-400"}`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 ml-1">
                    <span className="text-[11px] text-gray-400">
                      {agent.name} • AI Agent •{" "}
                      {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-100">
              {error.message || "An error occurred"}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-2 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5722]/20 focus-within:border-[#FF5722]/50 transition-all">
            <div className="flex gap-1 pl-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={input || ""}
              onChange={handleInputChange}
              placeholder="Message..."
              className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 px-2 h-9 text-[15px]"
              disabled={isLoading}
            />

            <div className="flex gap-1 pr-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full transition-all ${isListening ? "text-red-500 bg-red-50" : ""}`}
                onClick={handleVoiceInput}
              >
                <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !(input || "").trim()}
                size="icon"
                className={`h-8 w-8 rounded-full transition-all ${(input || "").trim() ? "bg-[#FF5722] text-white hover:bg-[#F4511E]" : "bg-gray-100 text-gray-400"}`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] font-medium text-gray-400 flex items-center justify-center gap-1">
              Powered by <span className="font-bold text-gray-500">Taxu AI</span>
            </span>
          </div>
        </form>
      </div>
    </Card>
  )
}

const aiModels = [
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini (Fast)" },
  { value: "openai/gpt-4o", label: "GPT-4o (OpenAI)" },
  { value: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
  { value: "anthropic/claude-opus-4", label: "Claude Opus 4" },
  { value: "xai/grok-4-fast", label: "Grok 4 Fast" },
]

const getContextPrompt = (pathname: string | null) => {
  if (pathname?.includes("/file/w2")) {
    return "\n\nCONTEXT: User is currently on the W-2 filing page. Help them with W-2 specific questions like understanding boxes, employer vs employee information, and filing deadlines."
  }
  if (pathname?.includes("/file/1099")) {
    return "\n\nCONTEXT: User is currently on the 1099-NEC filing page. Help them with contractor payments, $600 threshold, and 1099 requirements."
  }
  if (pathname?.includes("/file/941")) {
    return "\n\nCONTEXT: User is currently on the Form 941 (quarterly payroll tax) page. Help them with quarterly filing, payroll tax calculations, and deposit schedules."
  }
  if (pathname?.includes("/dashboard")) {
    return "\n\nCONTEXT: User is on their dashboard. Help them understand their filing status, upcoming deadlines, and next steps."
  }
  return ""
}
