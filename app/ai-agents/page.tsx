"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Sparkles, Crown } from "lucide-react"
import { agents } from "@/data/agents"
import Link from "next/link"

export default function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState("Friendly")

  const tones = ["Concise", "Friendly", "Professional", "Playful"]

  const leadAgent = agents[0] // Sam
  const otherAgents = agents.slice(1) // Sophie, Jordan, Kai, Riley, Leo

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
            <Sparkles className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-neon">Meet Your AI Tax Team</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Six AI Agents.
            <br />
            <span className="text-neon">One Perfect Return.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Led by Sam, your Lead Tax Strategist. Each agent specializes in a different aspect of your taxes. Choose
            your default assistant or switch between them anytime.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 border-y border-neon/20 bg-gradient-to-b from-neon/10 via-neon/5 to-transparent">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <Crown className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-500">Lead Tax Strategist</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Meet Sam</h2>
            <p className="text-muted-foreground">Your personal CPA-level AI that oversees everything</p>
          </div>

          <Card className="p-8 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg ring-4 ring-cyan-500/20">
                S
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold mb-2">{leadAgent.name}</h3>
                <p className="text-lg text-muted-foreground mb-3">{leadAgent.role}</p>
                <p className="text-sm italic">&ldquo;{leadAgent.bio}&rdquo;</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-cyan-500 mb-2">Core Capabilities:</p>
                <ul className="space-y-1">
                  {leadAgent.capabilities.slice(0, 3).map((capability, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-cyan-500">✓</span>
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-cyan-500 mb-2">Example Questions:</p>
                <ul className="space-y-1">
                  {leadAgent.questions.slice(0, 3).map((question, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-cyan-500">•</span>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/chat?agent=sam">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg py-6">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Strategy Session with Sam
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Personalization */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent to-neon/5">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Personalize Your Experience</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {tones.map((tone) => (
              <Button
                key={tone}
                variant={selectedTone === tone ? "default" : "outline"}
                onClick={() => setSelectedTone(tone)}
                className={
                  selectedTone === tone ? "bg-neon hover:bg-neon/90 text-background" : "border-neon/20 bg-transparent"
                }
              >
                {tone}
              </Button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            All agents will adapt their communication style to match your preference
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Supporting AI Team</h2>
            <p className="text-muted-foreground">
              Sam coordinates with these specialized agents to handle every aspect of your taxes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAgents.map((agent) => {
              const Icon = agent.icon
              return (
                <Card
                  key={agent.name}
                  className={`p-6 border-neon/20 bg-card/50 backdrop-blur hover:border-neon/40 transition-all cursor-pointer ${
                    selectedAgent === agent.name ? "ring-2 ring-neon" : ""
                  }`}
                  onClick={() => setSelectedAgent(agent.name)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
                    >
                      {agent.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 italic">&ldquo;{agent.bio}&rdquo;</p>

                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-neon">Example Questions:</p>
                    {agent.questions.slice(0, 2).map((question, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-neon">•</span>
                        <span>{question}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/chat?agent=${agent.id.toLowerCase()}`}>
                    <Button
                      className={`w-full ${
                        selectedAgent === agent.name
                          ? "bg-neon hover:bg-neon/90 text-background"
                          : "bg-transparent border border-neon/20"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {selectedAgent === agent.name ? "Selected" : "Choose"} {agent.name}
                    </Button>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-neon/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Meet Your AI Team?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start filing for free and get instant access to Sam and all six agents
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-neon hover:bg-neon/90 text-background text-lg px-8">
                Start Filing Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-neon/20 bg-transparent text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
