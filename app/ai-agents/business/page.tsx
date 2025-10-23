import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, BarChart3, Users, FileText } from "lucide-react"
import Link from "next/link"

export default function BusinessAIAgentsPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
            <Building2 className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-neon">Business Tax AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            AI Agents Built for
            <br />
            <span className="text-neon">Your Business Taxes</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            From payroll to quarterly filings, expense tracking to compliance—your AI team handles enterprise-level tax
            complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-neon hover:bg-neon/90 text-background">
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-neon/20 bg-transparent">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-neon/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Enterprise-Grade AI for Your Business</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-neon/20">
              <BarChart3 className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Real-Time Tax Intelligence</h3>
              <p className="text-muted-foreground mb-4">
                Get instant insights into your tax position, estimated liabilities, and optimization opportunities.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Live tax liability tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Quarterly estimate calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Multi-entity consolidation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-neon/20">
              <Users className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
              <p className="text-muted-foreground mb-4">
                Your entire team can work together with role-based access and real-time synchronization.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Multi-user access with permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Accountant collaboration tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Audit trail and activity logs</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-neon/20">
              <FileText className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Automated Compliance</h3>
              <p className="text-muted-foreground mb-4">
                Never miss a deadline or filing requirement. Our AI monitors all federal, state, and local obligations.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Automatic deadline tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Multi-jurisdiction compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Regulatory change alerts</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-neon/20">
              <Building2 className="w-12 h-12 text-neon mb-4" />
              <h3 className="text-2xl font-bold mb-4">Scales With Your Business</h3>
              <p className="text-muted-foreground mb-4">
                From startup to enterprise, our AI adapts to your growing complexity and changing needs.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Unlimited entities and locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Custom workflows and automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neon">✓</span>
                  <span>Enterprise-grade security</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business Tax Operations?</h2>
          <p className="text-xl text-muted-foreground mb-8">See how Taxu's AI can save your business time and money.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button size="lg" className="bg-neon hover:bg-neon/90 text-background text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-neon/20 text-lg px-8 bg-transparent">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
