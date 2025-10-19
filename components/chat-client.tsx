"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, User, Crown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { agents } from "@/data/agents"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface UserProfile {
  full_name?: string
  preferred_agent?: string
}

const suggestedQuestions = [
  "What's my personalized tax strategy?",
  "What deductions am I eligible for?",
  "How can I reduce my audit risk?",
  "What's my current filing status?",
  "When will I receive my refund?",
  "What documents do I still need?",
]

export default function ChatClient({ userProfile }: { userProfile: UserProfile | null }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const agentParam = searchParams.get("agent")

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(agentParam || userProfile?.preferred_agent || "Sam")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: "user", content }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agent: selectedAgent,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      setMessages((prev) => [...prev, { role: "assistant", content: "" }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          }
          return newMessages
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("[v0] Request aborted")
      } else {
        console.error("[v0] Chat error:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I apologize, but I encountered an error. Please try again.",
          },
        ])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0]
  const AgentIcon = currentAgent.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="shrink-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-lg ${currentAgent.bgColor} shrink-0`}>
                  <AgentIcon className={`h-5 w-5 ${currentAgent.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-lg truncate">Chat with {currentAgent.name}</h1>
                    {currentAgent.id === "Sam" && <Crown className="h-4 w-4 text-cyan-500 shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{currentAgent.role}</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex shrink-0">
              AI-Powered
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selector Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Switch Agent</h3>
              <div className="space-y-2">
                {agents.map((agent) => {
                  const Icon = agent.icon
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedAgent === agent.id
                          ? `${agent.bgColor} border-2 border-current ${agent.color}`
                          : "hover:bg-slate-50 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="relative">
                          <Icon className={`h-4 w-4 mt-0.5 ${agent.color}`} />
                          {agent.id === "Sam" && <Crown className="h-2 w-2 text-cyan-500 absolute -top-1 -right-1" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{agent.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{agent.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="flex flex-col h-[calc(100vh-12rem)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`inline-flex p-4 rounded-full ${currentAgent.bgColor} mb-4`}>
                      <AgentIcon className={`h-8 w-8 ${currentAgent.color}`} />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                      Hi {userProfile?.full_name?.split(" ")[0] || "there"}! I'm {currentAgent.name}
                    </h2>
                    <p className="text-muted-foreground mb-6">{currentAgent.bio}</p>

                    <div className="max-w-md mx-auto">
                      <p className="text-sm font-medium mb-3">Try asking:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {(currentAgent.questions || suggestedQuestions).slice(0, 6).map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(question)}
                            className="text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message, idx) => (
                      <div key={idx} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                        {message.role === "assistant" && (
                          <Avatar className={`h-8 w-8 ${currentAgent.bgColor} flex items-center justify-center`}>
                            <AgentIcon className={`h-4 w-4 ${currentAgent.color}`} />
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 bg-primary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex gap-3">
                        <Avatar className={`h-8 w-8 ${currentAgent.bgColor} flex items-center justify-center`}>
                          <AgentIcon className={`h-4 w-4 ${currentAgent.color}`} />
                        </Avatar>
                        <div className="bg-slate-100 rounded-lg p-4">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask ${currentAgent.name} anything...`}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI responses are for informational purposes. Consult a tax professional for specific advice.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
