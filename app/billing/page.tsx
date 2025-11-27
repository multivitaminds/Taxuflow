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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] text-sm font-medium mb-8">
                <span className="bg-[#6366f1] text-white text-xs px-2 py-0.5 rounded-full">New</span>
                Automated Tax Compliance - Built for your business
                <ChevronRight className="w-4 h-4" />
              </div>
              <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-8">
                Tax compliance billing made simple
              </h1>
              <p className="text-xl text-[#425466] mb-10 leading-relaxed max-w-lg">
                Taxu Billing automates tax compliance for independent contractors. Handle 1099 forms, quarterly
                payments, and deductions with intelligent billing that works for your business.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/get-started"
                  className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
                >
                  Get started free
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
            <div className="relative lg:h-[600px] w-full hidden lg:block">
              <div className="absolute top-10 right-0 w-[450px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="font-bold text-[#0a2540]">Q4 Tax Summary</div>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Filed</div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Contractor</div>
                      <div className="font-medium text-[#0a2540]">Jane Developer</div>
                      <div className="text-sm text-gray-500">jane@contractor.com</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Quarterly tax</div>
                      <div className="text-2xl font-bold text-[#0a2540]">$4,250</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#0a2540]">Gross Income</div>
                        <div className="text-sm text-gray-500">Q4 2024</div>
                      </div>
                      <div className="font-medium text-[#0a2540]">$45,000</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#0a2540]">Deductions</div>
                        <div className="text-sm text-gray-500">Business expenses</div>
                      </div>
                      <div className="font-medium text-green-600">-$8,500</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#0a2540]">Est. Tax (30%)</div>
                        <div className="text-sm text-gray-500">Federal + State</div>
                      </div>
                      <div className="font-medium text-[#0a2540]">$10,950</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-bold text-[#0a2540]">
                    <div>Quarterly Payment</div>
                    <div>$4,250</div>
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
            <h2 className="text-[#6366f1] font-semibold mb-6">Tax-first billing</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
              Automated tax compliance for independent contractors
            </h3>
            <p className="text-xl text-[#425466]">
              Taxu Billing handles all your tax obligations automatically—from quarterly estimates to 1099 generation
              and filing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: RefreshCw,
                title: "Quarterly estimates",
                desc: "Automatically calculate and schedule quarterly estimated tax payments based on your income.",
              },
              {
                icon: FileText,
                title: "1099 generation",
                desc: "Generate and e-file 1099-NEC and 1099-K forms for contractors with IRS-certified accuracy.",
              },
              {
                icon: Settings,
                title: "Smart deductions",
                desc: "Track business expenses and maximize deductions with AI-powered categorization.",
              },
              {
                icon: Users,
                title: "Multi-state filing",
                desc: "Handle state tax obligations across all 50 states with automated compliance.",
              },
              {
                icon: PieChart,
                title: "Income tracking",
                desc: "Connect QuickBooks, Plaid, and other platforms to automatically track all income sources.",
              },
              {
                icon: BarChart,
                title: "Tax optimization",
                desc: "Get personalized recommendations to minimize your tax liability throughout the year.",
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="w-12 h-12 bg-[#f6f9fc] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#6366f1] transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-[#6366f1] group-hover:text-white transition-colors duration-300" />
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
              <h2 className="text-[#6366f1] font-semibold mb-6">Seamless integrations</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] mb-6 leading-tight">
                Connect your financial ecosystem
              </h3>
              <p className="text-xl text-[#425466] mb-8">
                Taxu integrates with QuickBooks, Plaid, Stripe, and more to automatically sync your income and expenses.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "QuickBooks Online sync for automatic bookkeeping",
                  "Plaid integration for bank transaction tracking",
                  "Real-time tax calculation with IRS compliance",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#6366f1] flex-shrink-0 mt-1" />
                    <span className="text-[#425466]">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/developer"
                className="inline-flex items-center text-[#6366f1] font-semibold hover:text-[#0a2540] transition-colors"
              >
                Read the API documentation <ChevronRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#1a2540] rounded-xl shadow-2xl overflow-hidden border border-[#2e3d50]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a2540] border-b border-[#2e3d50]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs text-[#adbdcc] font-mono">tax-estimate.js</div>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="text-[#adbdcc]">
                  <span className="text-[#ff7b72]">const</span> taxu <span className="text-[#ff7b72]">=</span> require(
                  <span className="text-[#a5d6ff]">'@taxu/api'</span>)(
                  <span className="text-[#a5d6ff]">'sk_live_...'</span>);
                  <br />
                  <br />
                  <span className="text-[#8b949e]">// Calculate quarterly tax estimate</span>
                  <br />
                  <span className="text-[#ff7b72]">const</span> estimate <span className="text-[#ff7b72]">=</span>{" "}
                  <span className="text-[#ff7b72]">await</span> taxu.quarterly.calculate({"{ "}
                  <br />
                  &nbsp;&nbsp;income: <span className="text-[#79c0ff]">45000</span>,<br />
                  &nbsp;&nbsp;deductions: <span className="text-[#79c0ff]">8500</span>,<br />
                  &nbsp;&nbsp;state: <span className="text-[#a5d6ff]">'CA'</span>,<br />
                  &nbsp;&nbsp;quarter: <span className="text-[#79c0ff]">4</span>
                  <br />
                  {"}"});
                  <br />
                  <br />
                  <span className="text-[#8b949e]">// Returns: {`{ federal: 3250, state: 1000 }`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Start filing with confidence</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Join thousands of independent contractors who trust Taxu to handle their tax compliance automatically.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center px-8 py-4 bg-[#6366f1] text-white rounded-full font-medium hover:bg-[#5558e3] transition-colors group"
            >
              Get started free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              View pricing
              <ChevronRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
