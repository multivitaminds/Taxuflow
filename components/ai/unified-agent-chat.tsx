"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Brain,
  FileSearch,
  Shield,
  Bell,
  Scale,
  Sparkles,
  Send,
  Mic,
  Settings,
  Download,
  ThumbsUp,
  ThumbsDown,
  Crown,
  ChevronDown,
  MoreVertical,
  RefreshCw,
} from "lucide-react"
import { agents } from "@/data/agents"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface UnifiedAgentChatProps {
  user: any
  profile: any
}

const agentIcons = {
  Sam: Brain,
  Sophie: Sparkles,
  Miles: Shield,
  Nia: FileSearch,
  Remy: Bell,
  Lex: Scale,
}

export function UnifiedAgentChat({ user, profile }: UnifiedAgentChatProps) {
  const [selectedAgent, setSelectedAgent] = useState("Sam")
  const [isListening, setIsListening] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down" | null>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0]
  const AgentIcon = agentIcons[selectedAgent as keyof typeof agentIcons] || Brain

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: {
      agent: selectedAgent,
      model: "openai/gpt-4o",
      context: `User: ${profile?.full_name || "Guest"}`,
    },
    initialMessages: [
      {
        id: `welcome-${Date.now()}`,
        role: "assistant" as const,
        content: `Hi ${profile?.full_name?.split(" ")[0] || "there"}! I'm ${currentAgent.name}, your ${currentAgent.role}. ${currentAgent.bio}`,
        createdAt: new Date(),
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in your browser")
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

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

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
    a.download = `taxu-chat-transcript-${new Date().toISOString()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${currentAgent.gradient} shadow-lg`}>
                <AgentIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{currentAgent.name}</h1>
                  {selectedAgent === "Sam" && <Crown className="h-4 w-4 text-cyan-500" />}
                  <Badge variant="secondary" className="text-xs">
                    AI Agent
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentAgent.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4 mr-2" />
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownloadTranscript}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Transcript
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Agent Selector Sidebar */}
          <div className="lg:col-span-3">
            <Card className="p-4 sticky top-24">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Switch Agent
              </h3>
              <div className="space-y-2">
                {agents.map((agent) => {
                  const Icon = agentIcons[agent.id as keyof typeof agentIcons] || Brain
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedAgent === agent.id
                          ? `bg-gradient-to-br ${agent.gradient} text-white shadow-lg scale-105`
                          : "hover:bg-slate-50 border border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Icon className={`h-5 w-5 ${selectedAgent === agent.id ? "text-white" : agent.color}`} />
                          {agent.id === "Sam" && (
                            <Crown className="h-2.5 w-2.5 text-yellow-400 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm ${selectedAgent === agent.id ? "text-white" : ""}`}>
                            {agent.name}
                          </div>
                          <div
                            className={`text-xs line-clamp-2 ${selectedAgent === agent.id ? "text-white/80" : "text-muted-foreground"}`}
                          >
                            {agent.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Suggested Questions */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-sm mb-3">Suggested Questions</h4>
                <div className="space-y-2">
                  {currentAgent.questions.slice(0, 4).map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(question)}
                      className="w-full text-left p-2 text-xs rounded-md border border-slate-200 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-9">
            <Card className="flex flex-col h-[calc(100vh-12rem)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div
                      className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${currentAgent.gradient} shadow-xl mb-4`}
                    >
                      <AgentIcon className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to {currentAgent.name}</h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">{currentAgent.bio}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {currentAgent.questions.slice(0, 6).map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(question)}
                          className="text-left p-4 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all text-sm group"
                        >
                          <div className="flex items-start gap-2">
                            <ChevronDown className="h-4 w-4 text-primary mt-0.5 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                            <span>{question}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, idx) => (
                      <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "assistant" && (
                          <Avatar
                            className={`h-10 w-10 bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center shadow-md`}
                          >
                            <AgentIcon className="h-5 w-5 text-white" />
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                            message.role === "user"
                              ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                              : "bg-white border border-slate-200"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

                          {message.role === "assistant" && idx === messages.length - 1 && !isLoading && (
                            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                              <span className="text-xs text-muted-foreground">Was this helpful?</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => setFeedbackGiven((prev) => ({ ...prev, [message.id]: "up" }))}
                                  className={`p-1.5 rounded-md transition-colors ${
                                    feedbackGiven[message.id] === "up"
                                      ? "bg-green-100 text-green-600"
                                      : "hover:bg-slate-100 text-slate-400"
                                  }`}
                                >
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => setFeedbackGiven((prev) => ({ ...prev, [message.id]: "down" }))}
                                  className={`p-1.5 rounded-md transition-colors ${
                                    feedbackGiven[message.id] === "down"
                                      ? "bg-red-100 text-red-600"
                                      : "hover:bg-slate-100 text-slate-400"
                                  }`}
                                >
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-10 w-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-semibold shadow-md">
                            {profile?.full_name?.[0] || "U"}
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-4">
                        <Avatar
                          className={`h-10 w-10 bg-gradient-to-br ${currentAgent.gradient} flex items-center justify-center shadow-md`}
                        >
                          <AgentIcon className="h-5 w-5 text-white" />
                        </Avatar>
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                          <div className="flex gap-1.5">
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={`Ask ${currentAgent.name} anything about ${currentAgent.description.toLowerCase()}...`}
                      disabled={isLoading}
                      className="pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleVoiceInput}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${isListening ? "text-red-500 animate-pulse" : ""}`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-br from-primary to-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  AI responses are for informational purposes. Consult professionals for specific advice.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
