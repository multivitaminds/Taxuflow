"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Mic, Volume2, RefreshCw, Settings } from "lucide-react"
import { agents as agentData } from "@/data/agents"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
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

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<string>("Sam")
  const [isListening, setIsListening] = useState(false)
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>("openai/gpt-4o-mini")
  const [showSettings, setShowSettings] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const pathname = usePathname()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: `Hi! I'm ${currentAgent}, your AI ${agents[currentAgent].role.toLowerCase()}. How can I help you with your taxes today?`,
    }
    setMessages([welcomeMessage])
  }, [currentAgent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: "user-" + Date.now(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          agent: currentAgent,
          model: selectedModel,
          context: getContextPrompt(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""
      const assistantMessageId = "assistant-" + Date.now()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const jsonStr = line.slice(2)
                const parsed = JSON.parse(jsonStr)
                if (parsed.content) {
                  assistantMessage += parsed.content
                  setMessages((prev) => {
                    const existing = prev.find((m) => m.id === assistantMessageId)
                    if (existing) {
                      return prev.map((m) => (m.id === assistantMessageId ? { ...m, content: assistantMessage } : m))
                    } else {
                      return [...prev, { id: assistantMessageId, role: "assistant", content: assistantMessage }]
                    }
                  })
                }
              } catch (e) {
                console.error("[v0] Failed to parse chunk:", e)
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("[v0] Chat error:", err)
      setError("Sorry, I encountered an error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleTextToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const getContextPrompt = () => {
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

  const getQuickActions = () => {
    if (pathname?.includes("/file/w2")) {
      return [
        "What is Box 1 on a W-2?",
        "How do I correct a W-2 error?",
        "What's the W-2 filing deadline?",
        "Can I e-file a late W-2?",
      ]
    }
    if (pathname?.includes("/file/1099")) {
      return [
        "Who needs a 1099-NEC?",
        "What's the $600 threshold?",
        "When is 1099 deadline?",
        "Do I need to file 1099 for LLC?",
      ]
    }
    return [
      "What's my refund estimate?",
      "Am I eligible for EITC?",
      "What deductions can I claim?",
      "How do I reduce audit risk?",
    ]
  }

  const quickActions = getQuickActions()

  if (!isOpen) {
    return (
      <button
        data-chat-widget-button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-neon to-blue-500 shadow-lg shadow-neon/50 flex items-center justify-center hover:scale-110 transition-transform z-50 group"
        aria-label="Open AI chat"
      >
        <MessageSquare className="w-6 h-6 text-background" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
          AI
        </div>
        <div className="absolute inset-0 rounded-full bg-neon/20 animate-ping" />
      </button>
    )
  }

  const agent = agents[currentAgent]

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col border-neon/20 bg-background/95 backdrop-blur-xl shadow-2xl shadow-neon/20 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neon/20 bg-gradient-to-r from-neon/10 to-blue-500/10">
        <button
          onClick={() => setShowAgentSelector(!showAgentSelector)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold`}
          >
            {agent.avatar}
          </div>
          <div className="text-left">
            <div className="font-semibold flex items-center gap-1">
              {agent.name}
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="text-xs text-muted-foreground">{agent.role} • Online</div>
          </div>
        </button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI Model Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-neon/20 bg-background/50 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2">AI Model</p>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 rounded-lg border border-neon/20 bg-background text-sm"
          >
            {aiModels.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Choose your preferred AI model. GPT-4o is recommended for most tasks.
          </p>
        </div>
      )}

      {/* Agent Selector */}
      {showAgentSelector && (
        <div className="p-4 border-b border-neon/20 bg-background/50 space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Switch to another AI agent:</p>
          {Object.entries(agents).map(([key, agentData]) => (
            <button
              key={key}
              onClick={() => {
                setCurrentAgent(key)
                setShowAgentSelector(false)
              }}
              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors ${
                currentAgent === key ? "bg-neon/10 border border-neon/20" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${agentData.color} flex items-center justify-center text-white text-sm font-bold`}
              >
                {agentData.avatar}
              </div>
              <div className="text-left text-sm">
                <div className="font-medium">{agentData.name}</div>
                <div className="text-xs text-muted-foreground">{agentData.role}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "user" ? "bg-neon text-background" : "bg-muted text-foreground border border-neon/20"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-neon">{currentAgent}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleTextToSpeech(message.content)}
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground border border-neon/20 rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl px-4 py-2">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-neon/20 bg-background/50">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs whitespace-nowrap border-neon/20 bg-transparent"
              onClick={() => setInput(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neon/20 bg-background/50">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`border-neon/20 bg-transparent ${isListening ? "bg-neon/20" : ""}`}
            onClick={handleVoiceInput}
          >
            <Mic className={`w-4 h-4 ${isListening ? "text-neon animate-pulse" : ""}`} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${currentAgent} anything...`}
            className="flex-1 border-neon/20 bg-background/50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="bg-neon hover:bg-neon/90 text-background">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by {selectedModel.split("/")[1]} • SOC 2 Compliance In Progress • Encrypted
        </p>
      </form>
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
