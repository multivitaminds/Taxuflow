import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Shield, FileCheck, AlertTriangle } from "lucide-react"

export default function IdentityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              Identity verification for tax filing
            </div>
            <h1 className="text-6xl lg:text-[6rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
              Verify taxpayer identity instantly
            </h1>
            <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-2xl mx-auto">
              Taxu Identity helps prevent tax fraud with secure identity verification. Meet IRS requirements with
              automated ID checks and document validation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
              >
                Get started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/security"
                className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#6366f1] transition-colors"
              >
                Security features
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0a2540] mb-16 text-center">Comprehensive identity verification</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "Government ID verification",
                desc: "Validate driver's licenses, passports, and state IDs with real-time checks against government databases.",
              },
              {
                icon: FileCheck,
                title: "SSN validation",
                desc: "Verify Social Security Numbers against IRS records to prevent identity theft and fraud.",
              },
              {
                icon: AlertTriangle,
                title: "Fraud detection",
                desc: "AI-powered fraud detection identifies suspicious patterns and flags potential identity theft attempts.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="w-12 h-12 bg-[#f6f9fc] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6366f1] transition-colors">
                  <item.icon className="w-6 h-6 text-[#6366f1] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-[#0a2540] mb-3">{item.title}</h4>
                <p className="text-[#425466] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#0a2540] mb-6">IRS-compliant identity verification</h2>
            <p className="text-xl text-[#425466] mb-12">
              Taxu Identity meets all IRS requirements for taxpayer identity verification, including Secure Access
              authentication standards.
            </p>
            <ul className="space-y-4 text-left max-w-2xl mx-auto">
              {[
                "NIST 800-63-3 compliant authentication",
                "Real-time SSN validation against IRS databases",
                "Automated red flag detection and reporting",
                "Secure document storage with 256-bit encryption",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#6366f1] flex-shrink-0 mt-1" />
                  <span className="text-[#425466]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0a2540] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Protect your clients from tax fraud</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Enable identity verification in minutes and meet IRS compliance requirements automatically.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
          >
            Enable identity verification
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  )
}
