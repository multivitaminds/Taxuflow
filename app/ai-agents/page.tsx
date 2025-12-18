"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Sparkles, Shield, TrendingUp, Briefcase, DollarSign } from "lucide-react"

export default function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState("Friendly")

  const agents = [
    {
      name: "Sophie",
      role: "Filing Assistant",
      icon: Sparkles,
      color: "from-cyan-500 to-blue-500",
      bio: "Hi, I'm Sophie. Let's file your return together in under 5 minutes. I'll guide you through every step and make sure you don't miss anything important.",
      questions: [
        "What documents do I need to file?",
        "How do I claim the standard deduction?",
        "Can you help me with my W-2?",
        "What's the fastest way to get my refund?",
      ],
    },
    {
      name: "Jordan",
      role: "Year-Round Tax Coach",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bio: "Need help with quarterly payments or dependents? I've got you covered. I'm here year-round to answer your tax questions and help you plan ahead.",
      questions: [
        "When are quarterly taxes due?",
        "How do I claim my child as a dependent?",
        "What's the child tax credit worth?",
        "Should I adjust my withholding?",
      ],
    },
    {
      name: "Kai",
      role: "Audit Risk Advisor",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      bio: "I flag risk early and explain why. Your safety is my priority. I'll review your return and give you a confidence score before you file.",
      questions: [
        "What's my audit risk score?",
        "Why is this deduction flagged?",
        "How can I reduce my audit risk?",
        "What triggers an IRS audit?",
      ],
    },
    {
      name: "Riley",
      role: "Business Tax Planner",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      bio: "From 1099s to LLC filings — I optimize for freelancers and founders. I understand the unique challenges of self-employment and business taxes.",
      questions: [
        "What business expenses can I deduct?",
        "How do I file a Schedule C?",
        "Should I form an LLC or S-Corp?",
        "What's the QBI deduction?",
      ],
    },
    {
      name: "Leo",
      role: "Refund Analyst",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      bio: "I analyze your return and maximize every dollar you're owed. I'll find credits and deductions you might have missed to boost your refund.",
      questions: [
        "How can I increase my refund?",
        "Am I eligible for the EITC?",
        "What tax credits am I missing?",
        "When will I get my refund?",
      ],
    },
  ]

  const tones = ["Concise", "Friendly", "Professional", "Playful"]

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
            Five AI Agents.
            <br />
            <span className="text-neon">One Perfect Return.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Each agent specializes in a different aspect of your taxes. Choose your default assistant or switch between
            them anytime.
          </p>
        </div>
      </section>

      {/* Personalization */}
      <section className="py-12 px-4 border-y border-neon/20 bg-gradient-to-b from-neon/5 to-transparent">
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

      {/* Agents Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
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
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
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
            Start filing for free and get instant access to all five agents
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-neon hover:bg-neon/90 text-background text-lg px-8">
              Start Filing Free
            </Button>
            <Button size="lg" variant="outline" className="border-neon/20 bg-transparent text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
