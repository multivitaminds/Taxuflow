import Link from "next/link"
import { ArrowRight, Check, ChevronRight, FileText, Download, Send } from "lucide-react"

export default function IssuingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
              <FileText className="w-4 h-4" />
              Automated 1099 generation and distribution
            </div>
            <h1 className="text-6xl lg:text-[6rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
              Issue 1099s automatically
            </h1>
            <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-2xl mx-auto">
              Generate, validate, and distribute 1099 forms to contractors automatically. Taxu Issuing handles all IRS
              filing requirements with guaranteed accuracy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
              >
                Start issuing 1099s
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/1099-filing"
                className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#6366f1] transition-colors"
              >
                Learn about 1099 filing
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0a2540] mb-16 text-center">Complete 1099 management platform</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: FileText,
                title: "Automatic generation",
                desc: "Pull payment data from QuickBooks, Stripe, or your accounting system to generate 1099s automatically.",
              },
              {
                icon: Download,
                title: "IRS e-filing",
                desc: "File 1099-NEC and 1099-K forms directly with the IRS. We handle all compliance requirements.",
              },
              {
                icon: Send,
                title: "Contractor distribution",
                desc: "Send 1099s to contractors via email or postal mail. Track delivery and access confirmations.",
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

      {/* Benefits */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-[#0a2540] mb-6 text-center">Why businesses choose Taxu Issuing</h2>
            <p className="text-xl text-[#425466] mb-12 text-center">
              Handle 1099 compliance without the manual work. We automate every step of the process.
            </p>
            <ul className="space-y-4 max-w-2xl mx-auto">
              {[
                "Automatic TIN matching to prevent IRS rejection",
                "Bulk import contractors from spreadsheets or accounting software",
                "State filing for all 50 states included at no extra cost",
                "Guaranteed accuracy with penalties covered up to $25,000",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Start issuing 1099s today</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Join thousands of businesses that trust Taxu to handle their 1099 compliance automatically.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
          >
            Get started free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  )
}
