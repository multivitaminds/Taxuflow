import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, TrendingUp, Shield, Clock, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PersonalAIAgentsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero text-white pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <User className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-[#00D4FF]">Personal Tax AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            AI Agents Built for
            <br />
            Your Personal Taxes
          </h1>
          <p className="text-xl text-white/80 mb-10 text-balance max-w-2xl mx-auto leading-relaxed">
            From W-2s to investments, side hustles to deductions—your AI team handles it all with CPA-level expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0a2540] font-semibold rounded-full px-8 h-12"
              >
                Start Filing Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ai-agents">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-full px-8 h-12"
              >
                Meet All Agents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Your Personal AI Team Does</h2>
            <p className="text-xl text-slate-600">Complete tax coverage for every situation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <TrendingUp className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Maximizes Your Refund</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our AI agents analyze every transaction, receipt, and document to find every deduction you qualify for.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Identifies overlooked deductions automatically</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Optimizes tax strategies for your situation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Suggests tax-saving opportunities year-round</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Shield className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ensures 100% Accuracy</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Every calculation is verified by multiple AI agents and backed by our Maximum Refund Guarantee.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Multi-agent verification system</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Real-time error detection and correction</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>IRS audit support included</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Clock className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Saves You Hours</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                What takes hours with traditional software takes minutes with AI. Just chat naturally and we handle the
                rest.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Conversational interface—no tax jargon</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Auto-imports from banks and employers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Instant answers to any tax question</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <User className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Adapts to Your Life</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Whether you're a freelancer, investor, homeowner, or all three—your AI team knows your situation.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Learns your financial patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Proactive tax planning recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Handles life changes automatically</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Experience AI-Powered Tax Filing?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join thousands who've already discovered the easiest way to file taxes.
          </p>
          <Link href="/get-started">
            <Button
              size="lg"
              className="bg-[#635BFF] hover:bg-[#5046E5] text-white rounded-full px-10 h-12 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Your Free Return
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
