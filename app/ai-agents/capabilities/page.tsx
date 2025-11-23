import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Zap, Shield, TrendingUp, FileSearch, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AICapabilitiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero text-white pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <Brain className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-[#00D4FF]">AI Capabilities</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            The Most Advanced
            <br />
            Tax AI Ever Built
          </h1>
          <p className="text-xl text-white/80 mb-10 text-balance max-w-2xl mx-auto leading-relaxed">
            Six specialized AI agents working together with CPA-level expertise, powered by cutting-edge machine
            learning.
          </p>
          <Link href="/get-started">
            <Button
              size="lg"
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0a2540] font-semibold rounded-full px-8 h-12"
            >
              Experience the AI
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core AI Capabilities</h2>
            <p className="text-xl text-slate-600">Technology that understands taxes like a human expert</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Brain className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Natural Language Understanding</h3>
              <p className="text-slate-600 leading-relaxed">
                Chat naturally about your taxes. Our AI understands context, intent, and complex financial situations
                without requiring tax terminology.
              </p>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <FileSearch className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Document Intelligence</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload any tax document—W-2s, 1099s, receipts, statements. Our AI extracts, categorizes, and processes
                information instantly.
              </p>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <TrendingUp className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Deduction Discovery</h3>
              <p className="text-slate-600 leading-relaxed">
                Machine learning algorithms analyze your financial data to identify every deduction you qualify for—even
                ones you didn't know existed.
              </p>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Shield className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Multi-Agent Verification</h3>
              <p className="text-slate-600 leading-relaxed">
                Every calculation is cross-checked by multiple AI agents to ensure 100% accuracy and compliance with IRS
                regulations.
              </p>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Zap className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Real-Time Optimization</h3>
              <p className="text-slate-600 leading-relaxed">
                As you add information, our AI continuously recalculates and optimizes your return to maximize your
                refund or minimize liability.
              </p>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <MessageSquare className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Conversational Guidance</h3>
              <p className="text-slate-600 leading-relaxed">
                Get instant answers to any tax question. Our AI explains complex concepts in plain English and guides
                you through every step.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Our AI Agents Work Together</h2>
            <p className="text-xl text-slate-600">A collaborative system designed for accuracy</p>
          </div>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-6 md:before:ml-[50%] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 before:z-0">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 flex justify-end">
                <Card className="p-6 border-slate-200 shadow-md w-full md:max-w-md hover:border-[#635BFF] transition-colors bg-white">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sam (Lead Strategist) Coordinates</h3>
                  <p className="text-slate-600">
                    Sam oversees your entire return, delegating tasks to specialized agents and ensuring everything
                    works together seamlessly.
                  </p>
                </Card>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold shadow-lg border-4 border-white shrink-0">
                1
              </div>
              <div className="md:w-1/2 md:block hidden"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 md:block hidden"></div>
              <div className="w-12 h-12 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold shadow-lg border-4 border-white shrink-0">
                2
              </div>
              <div className="md:w-1/2 flex justify-start">
                <Card className="p-6 border-slate-200 shadow-md w-full md:max-w-md hover:border-[#635BFF] transition-colors bg-white">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Specialized Agents Execute</h3>
                  <p className="text-slate-600">
                    Sophie finds deductions, Jordan handles investments, Kai manages business taxes, Riley processes
                    documents, and Leo ensures compliance.
                  </p>
                </Card>
              </div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 flex justify-end">
                <Card className="p-6 border-slate-200 shadow-md w-full md:max-w-md hover:border-[#635BFF] transition-colors bg-white">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Continuous Verification</h3>
                  <p className="text-slate-600">
                    All agents cross-check each other's work in real-time, ensuring accuracy while continuously
                    optimizing your return.
                  </p>
                </Card>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#635BFF] text-white flex items-center justify-center font-bold shadow-lg border-4 border-white shrink-0">
                3
              </div>
              <div className="md:w-1/2 md:block hidden"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to See What AI Can Do?</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Experience the future of tax filing with our advanced AI agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-[#635BFF] hover:bg-[#5046E5] text-white rounded-full px-10 h-12 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Start Filing Free
              </Button>
            </Link>
            <Link href="/ai-agents">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-white hover:border-[#635BFF] hover:text-[#635BFF] bg-white rounded-full px-10 h-12 text-lg"
              >
                Meet the Agents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
