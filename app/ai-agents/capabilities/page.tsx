import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Zap, Shield, TrendingUp, FileSearch, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AICapabilitiesPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
            <Brain className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-neon">AI Capabilities</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            The Most Advanced
            <br />
            <span className="text-neon">Tax AI Ever Built</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Six specialized AI agents working together with CPA-level expertise, powered by cutting-edge machine
            learning.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="bg-neon hover:bg-neon/90 text-background">
              Experience the AI
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-neon/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Core AI Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-neon/20">
              <Brain className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Natural Language Understanding</h3>
              <p className="text-muted-foreground">
                Chat naturally about your taxes. Our AI understands context, intent, and complex financial situations
                without requiring tax terminology.
              </p>
            </Card>

            <Card className="p-8 border-neon/20">
              <FileSearch className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Document Intelligence</h3>
              <p className="text-muted-foreground">
                Upload any tax document—W-2s, 1099s, receipts, statements. Our AI extracts, categorizes, and processes
                information instantly.
              </p>
            </Card>

            <Card className="p-8 border-neon/20">
              <TrendingUp className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Deduction Discovery</h3>
              <p className="text-muted-foreground">
                Machine learning algorithms analyze your financial data to identify every deduction you qualify for—even
                ones you didn't know existed.
              </p>
            </Card>

            <Card className="p-8 border-neon/20">
              <Shield className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Multi-Agent Verification</h3>
              <p className="text-muted-foreground">
                Every calculation is cross-checked by multiple AI agents to ensure 100% accuracy and compliance with IRS
                regulations.
              </p>
            </Card>

            <Card className="p-8 border-neon/20">
              <Zap className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Real-Time Optimization</h3>
              <p className="text-muted-foreground">
                As you add information, our AI continuously recalculates and optimizes your return to maximize your
                refund or minimize liability.
              </p>
            </Card>

            <Card className="p-8 border-neon/20">
              <MessageSquare className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Conversational Guidance</h3>
              <p className="text-muted-foreground">
                Get instant answers to any tax question. Our AI explains complex concepts in plain English and guides
                you through every step.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How Our AI Agents Work Together</h2>
          <div className="space-y-6">
            <Card className="p-6 border-neon/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sam (Lead Strategist) Coordinates Everything</h3>
                  <p className="text-muted-foreground">
                    Sam oversees your entire return, delegating tasks to specialized agents and ensuring everything
                    works together seamlessly.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-neon/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Specialized Agents Handle Their Domains</h3>
                  <p className="text-muted-foreground">
                    Sophie finds deductions, Jordan handles investments, Kai manages business taxes, Riley processes
                    documents, and Leo ensures compliance.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-neon/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Continuous Verification and Optimization</h3>
                  <p className="text-muted-foreground">
                    All agents cross-check each other's work in real-time, ensuring accuracy while continuously
                    optimizing your return.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-neon/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to See What AI Can Do?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Experience the future of tax filing with our advanced AI agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-neon hover:bg-neon/90 text-background text-lg px-8">
                Start Filing Free
              </Button>
            </Link>
            <Link href="/ai-agents">
              <Button size="lg" variant="outline" className="border-neon/20 text-lg px-8 bg-transparent">
                Meet the Agents
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
