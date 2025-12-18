import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Calculator, TrendingUp, Globe } from "lucide-react"

export default function TaxPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
              <Calculator className="w-4 h-4" />
              AI-powered tax filing
            </div>
            <h1 className="text-6xl lg:text-[6rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
              Automated tax filing for contractors
            </h1>
            <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-2xl mx-auto">
              File federal and state tax returns in minutes with AI-powered accuracy. Taxu handles quarterly estimates,
              deductions, and multi-state compliance automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/file"
                className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
              >
                File your taxes
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#6366f1] transition-colors"
              >
                View pricing
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0a2540] mb-16 text-center">
            Complete tax solution for independent contractors
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Calculator,
                title: "Quarterly estimates",
                desc: "AI calculates and tracks quarterly estimated payments. Never miss a deadline or face penalties again.",
              },
              {
                icon: TrendingUp,
                title: "Smart deductions",
                desc: "Maximize deductions with AI categorization. Track mileage, home office, equipment, and more.",
              },
              {
                icon: Globe,
                title: "Multi-state filing",
                desc: "File in all 50 states automatically. We handle nexus determinations and state-specific requirements.",
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

      {/* Accuracy Guarantee */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#0a2540] mb-6">100% accuracy guarantee</h2>
            <p className="text-xl text-[#425466] mb-12">
              Our AI is trained on millions of tax returns and stays current with every IRS code change. We guarantee
              accuracy or we cover penalties.
            </p>
            <ul className="space-y-4 text-left max-w-2xl mx-auto">
              {[
                "IRS e-file certified with 99.9% acceptance rate",
                "Real-time error checking and validation",
                "Audit support included with all filings",
                "Penalties covered up to $100,000",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-8">File your taxes with confidence</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Join over 50,000 independent contractors who trust Taxu for accurate, automated tax filing.
          </p>
          <Link
            href="/file"
            className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
          >
            Start your return
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  )
}
