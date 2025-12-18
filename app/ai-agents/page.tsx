"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Zap, Crown, Bot } from "lucide-react"
import { agents } from "@/data/agents"
import Link from "next/link"

export default function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState("Friendly")

  const tones = ["Concise", "Friendly", "Professional", "Playful"]

  const leadAgent = agents[0] // Sam
  const otherAgents = agents.slice(1) // Sophie, Jordan, Kai, Riley, Leo

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="gradient-stripe-hero pt-32 pb-20 px-4 clip-diagonal">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white mb-6 backdrop-blur-sm">
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium">Intelligent Tax Infrastructure</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-white">
            Six Specialized Agents.
            <br />
            <span className="text-[#00d4ff]">One Unified Platform.</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 text-balance">
            Led by Sam, your Lead Tax Strategist. Our multi-agent architecture orchestrates specialized models to handle
            every aspect of your tax compliance with precision.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635bff]/10 border border-[#635bff]/20 mb-4">
              <Crown className="w-4 h-4 text-[#635bff]" />
              <span className="text-sm font-medium text-[#635bff]">Lead Tax Strategist</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-[#0a2540]">Meet Sam</h2>
            <p className="text-slate-600">Your dedicated orchestrator for complex tax scenarios</p>
          </div>

          <Card className="p-8 border-0 shadow-xl bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#635bff] to-[#00d4ff]" />
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-24 h-24 rounded-2xl bg-[#0a2540] flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                S
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold mb-2 text-[#0a2540]">{leadAgent.name}</h3>
                <p className="text-lg text-[#635bff] font-medium mb-3">{leadAgent.role}</p>
                <p className="text-slate-600 italic">&ldquo;{leadAgent.bio}&rdquo;</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Core Capabilities</p>
                <ul className="space-y-3">
                  {leadAgent.capabilities.slice(0, 3).map((capability, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00d4ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-[#00d4ff]" />
                      </div>
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Sample Queries</p>
                <ul className="space-y-3">
                  {leadAgent.questions.slice(0, 3).map((question, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#635bff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MessageSquare className="w-3 h-3 text-[#635bff]" />
                      </div>
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/chat?agent=sam">
              <Button className="w-full bg-[#635bff] hover:bg-[#0a2540] text-white text-lg py-6 transition-all duration-300 shadow-md hover:shadow-lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Strategy Session
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Personalization */}
      <section className="py-16 px-4 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#0a2540]">Interaction Style</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {tones.map((tone) => (
              <Button
                key={tone}
                variant={selectedTone === tone ? "default" : "outline"}
                onClick={() => setSelectedTone(tone)}
                className={
                  selectedTone === tone
                    ? "bg-[#0a2540] hover:bg-[#0a2540]/90 text-white border-transparent"
                    : "border-slate-200 text-slate-600 hover:border-[#635bff] hover:text-[#635bff] bg-white"
                }
              >
                {tone}
              </Button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            Agents adapt their communication protocols to match your preferred workflow.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-[#0a2540]">Specialized Agent Network</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sam coordinates with these domain-specific models to handle specialized tax requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAgents.map((agent) => {
              return (
                <Card
                  key={agent.name}
                  className={`p-6 border-0 shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white group ${
                    selectedAgent === agent.name ? "ring-2 ring-[#635bff]" : ""
                  }`}
                  onClick={() => setSelectedAgent(agent.name)}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-xl bg-[#f6f9fc] flex items-center justify-center text-[#0a2540] font-bold text-xl group-hover:bg-[#635bff] group-hover:text-white transition-colors duration-300`}
                    >
                      {agent.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0a2540]">{agent.name}</h3>
                      <p className="text-sm text-[#635bff] font-medium">{agent.role}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-6 italic min-h-[60px]">&ldquo;{agent.bio}&rdquo;</p>

                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Capabilities</p>
                    {agent.questions.slice(0, 2).map((question, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] mt-1.5 flex-shrink-0" />
                        <span>{question}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/chat?agent=${agent.id.toLowerCase()}`}>
                    <Button
                      className={`w-full ${
                        selectedAgent === agent.name
                          ? "bg-[#0a2540] text-white"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-[#635bff] hover:text-[#635bff]"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {selectedAgent === agent.name ? "Selected" : "Select"} {agent.name}
                    </Button>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0a2540] clip-diagonal-top">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Deploy Your Team?</h2>
          <p className="text-xl text-white/80 mb-8">
            Start filing for free and get instant access to our complete agent network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-[#0a2540] font-semibold text-lg px-8"
              >
                Start Filing Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 text-lg px-8"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
