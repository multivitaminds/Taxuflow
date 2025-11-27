import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Link2, Zap, Database } from "lucide-react"

export default function ConnectPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
              <Link2 className="w-4 h-4" />
              Financial data integrations
            </div>
            <h1 className="text-6xl lg:text-[6rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
              Connect your financial data
            </h1>
            <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-2xl mx-auto">
              Taxu Connect integrates with QuickBooks, Plaid, Stripe, and thousands of financial institutions to
              automatically sync income, expenses, and transactions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
              >
                Connect your accounts
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/developer"
                className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#6366f1] transition-colors"
              >
                View integrations
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0a2540] mb-16 text-center">Connect everything in one place</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Database,
                title: "QuickBooks Online",
                desc: "Sync income, expenses, and invoices automatically. Two-way sync keeps your books up to date.",
              },
              {
                icon: Link2,
                title: "Plaid Banking",
                desc: "Connect 12,000+ banks and credit cards. Track business transactions in real-time.",
              },
              {
                icon: Zap,
                title: "Payment Platforms",
                desc: "Integrate Stripe, PayPal, Square, and more. Automatically track 1099 income sources.",
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
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#0a2540] mb-6">Automated tax prep with real-time data</h2>
            <p className="text-xl text-[#425466] mb-12">
              Stop manually entering transactions. Taxu Connect automatically categorizes income and expenses for
              accurate tax calculations.
            </p>
            <ul className="space-y-4 text-left max-w-2xl mx-auto">
              {[
                "Bank-level 256-bit encryption for all connections",
                "Real-time transaction sync with automatic categorization",
                "OAuth secure authentication - we never see your passwords",
                "Works with 12,000+ banks and financial institutions",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Start connecting your accounts</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Set up your integrations in minutes and never manually enter transaction data again.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
          >
            Connect accounts
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  )
}
