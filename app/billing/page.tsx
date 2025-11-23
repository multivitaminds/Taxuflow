import Link from "next/link"
import { ArrowRight, Check, ChevronRight, RefreshCw, PieChart, FileText, Settings, Users, BarChart } from "lucide-react"

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4ff]/10 text-[#00a0c0] text-sm font-medium mb-8">
                <span className="bg-[#00d4ff] text-[#0a2540] text-xs px-2 py-0.5 rounded-full">New</span>
                Revenue Recognition - Automate your accounting
                <ChevronRight className="w-4 h-4" />
              </div>
              <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
                Billing for any business model
              </h1>
              <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-lg">
                Taxu Billing is the fastest way for your business to bill customers with subscriptions or invoices.
                Capture more revenue, support new products or business models, and accept recurring payments globally.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-[#00d4ff] text-[#0a2540] rounded-full font-medium hover:bg-[#00c4eb] transition-colors group"
                >
                  Start now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#00d4ff] transition-colors"
                >
                  Contact sales
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative lg:h-[600px] w-full hidden lg:block">
              {/* Billing UI Mockup */}
              <div className="absolute top-10 right-0 w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="font-bold text-[#0a2540]">Invoice #1024</div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Paid</div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Billed to</div>
                      <div className="font-medium text-[#0a2540]">Acme Corp</div>
                      <div className="text-sm text-gray-500">billing@acme.com</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Amount due</div>
                      <div className="text-2xl font-bold text-[#0a2540]">$299.00</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#0a2540]">Pro Plan</div>
                        <div className="text-sm text-gray-500">Monthly subscription</div>
                      </div>
                      <div className="font-medium text-[#0a2540]">$299.00</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#0a2540]">Tax</div>
                        <div className="text-sm text-gray-500">VAT (20%)</div>
                      </div>
                      <div className="font-medium text-[#0a2540]">$0.00</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-bold text-[#0a2540]">
                    <div>Total</div>
                    <div>$299.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-20 max-w-3xl">
            <h2 className="text-[#00d4ff] font-semibold mb-6">Flexible billing</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
              Powering the internet's subscription economy
            </h3>
            <p className="text-xl text-[#425466]">
              Taxu Billing lets you bill and manage customers however you want—from simple recurring billing to complex
              usage-based contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: RefreshCw,
                title: "Recurring billing",
                desc: "Bill customers on a recurring basis with support for daily, weekly, monthly, or annual subscriptions.",
              },
              {
                icon: FileText,
                title: "Invoicing",
                desc: "Create and send invoices that customers can pay online with cards, bank transfers, and more.",
              },
              {
                icon: Settings,
                title: "Flexible pricing models",
                desc: "Support per-seat, usage-based, tiered, and flat-rate pricing models out of the box.",
              },
              {
                icon: Users,
                title: "Customer portal",
                desc: "Let customers manage their subscriptions, payment methods, and invoices with a secure portal.",
              },
              {
                icon: PieChart,
                title: "Revenue recovery",
                desc: "Reduce churn with smart retries, automatic card updates, and payment reminders.",
              },
              {
                icon: BarChart,
                title: "Revenue recognition",
                desc: "Automate revenue recognition and reporting to streamline your accounting and finance operations.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="w-12 h-12 bg-[#f6f9fc] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00d4ff] transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-[#00d4ff] group-hover:text-[#0a2540] transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-bold text-[#0a2540] mb-3">{item.title}</h4>
                <p className="text-[#425466] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[#00d4ff] font-semibold mb-6">Easy integration</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
                Launch in minutes, not months
              </h3>
              <p className="text-xl text-[#425466] mb-8">
                Use our pre-built hosted pages to get started quickly, or build a custom integration with our flexible
                APIs.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Hosted customer portal for self-serve management",
                  "No-code pricing tables to test new models",
                  "Webhooks for real-time subscription updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-1" />
                    <span className="text-[#425466]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/developer"
                className="inline-flex items-center text-[#00d4ff] font-semibold hover:text-[#0a2540] transition-colors"
              >
                Read the documentation <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#1a2540] rounded-xl shadow-2xl overflow-hidden border border-[#2e3d50]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a2540] border-b border-[#2e3d50]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs text-[#adbdcc] font-mono">billing.js</div>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="text-[#adbdcc]">
                  <span className="text-[#ff7b72]">const</span> taxu <span className="text-[#ff7b72]">=</span> require(
                  <span className="text-[#a5d6ff]">'taxu'</span>)(
                  <span className="text-[#a5d6ff]">'sk_test_...'</span>);
                  <br />
                  <br />
                  <span className="text-[#8b949e]">// Create a new customer and subscription</span>
                  <br />
                  <span className="text-[#ff7b72]">const</span> subscription <span className="text-[#ff7b72]">=</span>{" "}
                  <span className="text-[#ff7b72]">await</span> taxu.subscriptions.create({"{ "}
                  <br />
                  &nbsp;&nbsp;customer: <span className="text-[#a5d6ff]">'cus_...'</span>,<br />
                  &nbsp;&nbsp;items: [
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{"{"} price: <span className="text-[#a5d6ff]">'price_pro_monthly'</span> {"}"}
                  ,<br />
                  &nbsp;&nbsp;],
                  <br />
                  {"}"});
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Start billing today</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Join the millions of businesses that use Taxu to manage their subscriptions and recurring revenue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-[#00d4ff] text-[#0a2540] rounded-full font-medium hover:bg-[#00c4eb] transition-colors group"
            >
              Start now
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              Contact sales
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f6f9fc] py-20 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Products</div>
              <ul className="space-y-3">
                {["Payments", "Billing", "Connect", "Payouts", "Issuing", "Terminal", "Tax", "Identity"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Solutions</div>
              <ul className="space-y-3">
                {[
                  "Ecommerce",
                  "SaaS",
                  "Marketplaces",
                  "Embedded Finance",
                  "Platforms",
                  "Creator Economy",
                  "Crypto",
                  "Global Businesses",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Resources</div>
              <ul className="space-y-3">
                {[
                  "Support",
                  "Contact Sales",
                  "Blog",
                  "Guides",
                  "Customer Stories",
                  "Developers",
                  "API Reference",
                  "Partners",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Company</div>
              <ul className="space-y-3">
                {["Jobs", "Newsroom", "Taxu Press", "Become a Partner", "Privacy & Terms", "Sitemap"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
            <div className="text-[#425466] font-medium">© 2025 Taxu, Inc.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-[#0a2540] font-bold">
                <div className="w-2 h-2 bg-[#0a2540] rounded-full" />
                Taxu
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
