import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, TrendingUp, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function PersonalAIAgentsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
            <User className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-neon">Personal Tax AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            AI Agents Built for
            <br />
            <span className="text-neon">Your Personal Taxes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            From W-2s to investments, side hustles to deductions—your AI team handles it all with CPA-level expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-neon hover:bg-neon/90 text-background">
                Start Filing Free
              </Button>
            </Link>
            <Link href="/ai-agents">
              <Button size="lg" variant="outline" className="border-neon/20 bg-transparent">
                Meet All Agents
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-neon/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What Your Personal AI Team Does</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-neon/20">
              <TrendingUp className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Maximizes Your Refund</h3>
              <p className="text-muted-foreground mb-4">
                Our AI agents analyze every transaction, receipt, and document to find every deduction you qualify for.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Identifies overlooked deductions automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Optimizes tax strategies for your situation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Suggests tax-saving opportunities year-round</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-neon/20">
              <Shield className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Ensures 100% Accuracy</h3>
              <p className="text-muted-foreground mb-4">
                Every calculation is verified by multiple AI agents and backed by our Maximum Refund Guarantee.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Multi-agent verification system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Real-time error detection and correction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>IRS audit support included</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-neon/20">
              <Clock className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Saves You Hours</h3>
              <p className="text-muted-foreground mb-4">
                What takes hours with traditional software takes minutes with AI. Just chat naturally and we handle the
                rest.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Conversational interface—no tax jargon</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Auto-imports from banks and employers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Instant answers to any tax question</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-neon/20">
              <User className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Adapts to Your Life</h3>
              <p className="text-muted-foreground mb-4">
                Whether you're a freelancer, investor, homeowner, or all three—your AI team knows your situation.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Learns your financial patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Proactive tax planning recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Handles life changes automatically</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience AI-Powered Tax Filing?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands who've already discovered the easiest way to file taxes.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="bg-neon hover:bg-neon/90 text-background text-lg px-8">
              Start Your Free Return
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
