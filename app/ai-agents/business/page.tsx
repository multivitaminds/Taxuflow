import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, BarChart3, Users, FileText, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function BusinessAIAgentsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-stripe-hero text-white pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <Building2 className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm font-medium text-[#00D4FF]">Business Tax AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
            AI Agents Built for
            <br />
            Your Business Taxes
          </h1>
          <p className="text-xl text-white/80 mb-10 text-balance max-w-2xl mx-auto leading-relaxed">
            From payroll to quarterly filings, expense tracking to compliance—your AI team handles enterprise-level tax
            complexity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0a2540] font-semibold rounded-full px-8 h-12"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent rounded-full px-8 h-12"
              >
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Enterprise-Grade AI for Your Business
            </h2>
            <p className="text-xl text-slate-600">Scalable solutions for every stage of growth</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <BarChart3 className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Real-Time Tax Intelligence</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Get instant insights into your tax position, estimated liabilities, and optimization opportunities.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Live tax liability tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Quarterly estimate calculations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Multi-entity consolidation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Users className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Team Collaboration</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your entire team can work together with role-based access and real-time synchronization.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Multi-user access with permissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Accountant collaboration tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Audit trail and activity logs</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <FileText className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Automated Compliance</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Never miss a deadline or filing requirement. Our AI monitors all federal, state, and local obligations.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Automatic deadline tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Multi-jurisdiction compliance</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Regulatory change alerts</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group bg-white">
              <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-6 group-hover:bg-[#635BFF] transition-colors">
                <Building2 className="w-6 h-6 text-[#635BFF] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Scales With Your Business</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                From startup to enterprise, our AI adapts to your growing complexity and changing needs.
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Unlimited entities and locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Custom workflows and automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00D4FF] flex-shrink-0" />
                  <span>Enterprise-grade security</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#f6f9fc]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Business Tax Operations?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            See how Taxu's AI can save your business time and money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-[#635BFF] hover:bg-[#5046E5] text-white rounded-full px-10 h-12 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-white hover:border-[#635BFF] hover:text-[#635BFF] bg-white rounded-full px-10 h-12 text-lg"
              >
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
