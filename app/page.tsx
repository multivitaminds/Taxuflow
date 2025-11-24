import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight, Globe, Layout, Zap, ShoppingBag } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-24 lg:pb-32 overflow-hidden gradient-stripe-hero">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              {/* Changed div to Link to make it clickable and pointing to /login, added hover styles */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-8 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
              >
                <span className="bg-[#00d4ff] text-[#0a2540] text-xs px-2 py-0.5 rounded-full font-semibold">New</span>
                Taxu Sessions 2025 - Early bird registration now open
                <ChevronRight className="w-4 h-4" />
              </Link>
              <h1 className="text-6xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.1] mb-8">
                AI-powered tax & finance for everyone
              </h1>
              <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-lg">
                Join thousands of individuals and businesses who rely on Taxu for smarter tax filing, automated
                bookkeeping, payouts, banking, payroll, and financial compliance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-white text-[#0a2540] rounded-full font-medium hover:bg-white/90 transition-colors group shadow-lg"
                >
                  Start now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 text-white font-medium hover:text-[#00d4ff] transition-colors border border-white/20 rounded-full backdrop-blur-sm"
                >
                  Contact sales
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="relative lg:h-[800px] w-full hidden lg:block">
              {/* Abstract Phone Mockup */}
              <div className="absolute top-0 right-0 w-[300px] h-[600px] bg-white rounded-[3rem] shadow-2xl border-8 border-[#f6f9fc] overflow-hidden transform rotate-[-12deg] translate-x-12">
                <div className="p-6 bg-[#f6f9fc] h-full">
                  <div className="w-full h-40 bg-white rounded-2xl mb-4 shadow-sm p-4">
                    <div className="w-12 h-12 bg-[#635bff]/10 rounded-full mb-2" />
                    <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full h-16 bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-full" />
                        <div className="flex-1">
                          <div className="h-3 w-20 bg-gray-100 rounded mb-1" />
                          <div className="h-2 w-12 bg-gray-50 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Dashboard Card Mockup */}
              <div className="absolute top-[200px] right-[200px] w-[400px] bg-white rounded-xl shadow-xl p-6 transform rotate-[5deg]">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm font-semibold text-gray-500">Total Revenue</div>
                  <div className="text-[#635bff] text-sm font-medium">+12.5%</div>
                </div>
                <div className="text-4xl font-bold text-[#0a2540] mb-6">$1,245,000.00</div>
                <div className="h-32 flex items-end gap-2">
                  {[40, 60, 45, 70, 55, 80, 65, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#635bff]" style={{ height: `${h}%`, opacity: 0.2 + i * 0.1 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-center text-[#425466] mb-8 font-medium">Trusted by gig workers from</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            <div className="flex justify-center">
              <Image src="/brands/uber.png" alt="Uber" width={100} height={40} className="h-8 w-auto object-contain" />
            </div>
            <div className="flex justify-center">
              <Image
                src="/brands/doordash.png"
                alt="Doordash"
                width={120}
                height={40}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/brands/fiverr.png"
                alt="Fiverr"
                width={100}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/brands/instacart.svg"
                alt="Instacart"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex justify-center">
              <Image src="/brands/lyft.png" alt="Lyft" width={100} height={40} className="h-8 w-auto object-contain" />
            </div>
            <div className="flex justify-center">
              <Image
                src="/brands/upwork.png"
                alt="Upwork"
                width={100}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/brands/shopify.jpg"
                alt="Shopify"
                width={100}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/brands/airbnb.png"
                alt="Airbnb"
                width={100}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modular Solutions */}
      <section className="py-32 bg-[#f6f9fc]">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-[#635bff] font-semibold mb-6">Modular solutions</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-[#0a2540] max-w-2xl leading-tight">
              A fully integrated suite of financial and tax products
            </h3>
            <p className="mt-6 text-xl text-[#425466] max-w-3xl">
              Everything you need to manage accounting, file taxes, and grow your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link
              href="https://taxu.io/services/invoicing"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#635bff]/20"
            >
              <div className="w-12 h-12 bg-[#635bff]/10 rounded-lg flex items-center justify-center mb-4 text-[#635bff] group-hover:bg-[#635bff] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Invoicing</h4>
              <p className="text-[#425466] text-sm">Create professional invoices and get paid faster</p>
            </Link>

            <Link
              href="https://taxu.io/services/expense-tracking"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#00d4ff]/20"
            >
              <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-4 text-[#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Expense Tracking</h4>
              <p className="text-[#425466] text-sm">Capture receipts and categorize expenses automatically</p>
            </Link>

            <Link
              href="https://taxu.io/services/customer-management"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#7a73ff]/20"
            >
              <div className="w-12 h-12 bg-[#7a73ff]/10 rounded-lg flex items-center justify-center mb-4 text-[#7a73ff] group-hover:bg-[#7a73ff] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Customer Management</h4>
              <p className="text-[#425466] text-sm">Track customer relationships and payment history</p>
            </Link>

            <Link
              href="https://taxu.io/services/financial-reports"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#ff5c35]/20"
            >
              <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-4 text-[#ff5c35] group-hover:bg-[#ff5c35] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Financial Reports</h4>
              <p className="text-[#425466] text-sm">Real-time P&L, balance sheets, and cash flow</p>
            </Link>

            <Link
              href="https://taxu.io/services/vendor-management"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#df1b41]/20"
            >
              <div className="w-12 h-12 bg-[#df1b41]/10 rounded-lg flex items-center justify-center mb-4 text-[#df1b41] group-hover:bg-[#df1b41] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Vendor Management</h4>
              <p className="text-[#425466] text-sm">Manage bills and vendor relationships</p>
            </Link>

            <Link
              href="https://taxu.io/services/banking"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#00d4ff]/20"
            >
              <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-4 text-[#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Banking</h4>
              <p className="text-[#425466] text-sm">Connect accounts and reconcile transactions</p>
            </Link>

            <Link
              href="https://taxu.io/services/products-services"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#ffc043]/20"
            >
              <div className="w-12 h-12 bg-[#ffc043]/10 rounded-lg flex items-center justify-center mb-4 text-[#ffc043] group-hover:bg-[#ffc043] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Products & Services</h4>
              <p className="text-[#425466] text-sm">Manage your product catalog and pricing</p>
            </Link>

            <Link
              href="https://taxu.io/services/tax-filing"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#635bff]/20"
            >
              <div className="w-12 h-12 bg-[#635bff]/10 rounded-lg flex items-center justify-center mb-4 text-[#635bff] group-hover:bg-[#635bff] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-[#0a2540] mb-2">Tax Filing</h4>
              <p className="text-[#425466] text-sm">File W-2, 1099, 941, and more with AI</p>
            </Link>
          </div>
          {/* </CHANGE> */}
        </div>
      </section>

      {/* Global Scale */}
      <section className="py-32 bg-[#0a2540] text-white relative overflow-hidden clip-diagonal">
        <div className="absolute inset-0 bg-[url('https://assets.ctfassets.net/fzn2n1nzq965/3W0Nn6j6j6j6j6j6j6j6j6/5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c/globe.png')] bg-no-repeat bg-right-bottom opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mb-20">
            <h2 className="text-[#00d4ff] font-semibold mb-6">Global scale</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              The backbone for modern tax, compliance, and financial operations.
            </h3>
            <p className="text-xl text-[#adbdcc]">
              Taxu makes tax filing, bookkeeping, payouts, and financial operations seamless, automated, and
              intelligent. From uploading a W-2 to reconciling accounts to getting paid—Taxu handles every step.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="text-3xl font-bold mb-2 border-l-4 border-[#00d4ff] pl-4">500M+</div>
              <div className="text-[#adbdcc] pl-4">API requests per day</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 border-l-4 border-[#00d4ff] pl-4">99.999%</div>
              <div className="text-[#adbdcc] pl-4">Historical uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 border-l-4 border-[#00d4ff] pl-4">90%</div>
              <div className="text-[#adbdcc] pl-4">U.S. adults covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 border-l-4 border-[#00d4ff] pl-4">135+</div>
              <div className="text-[#adbdcc] pl-4">Currencies supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Support for any business type */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-[#0a2540] mb-6">Built for all business types</h3>
            <p className="text-xl text-[#425466] max-w-3xl">
              From gig workers and small businesses to startups, creators, marketplaces, and enterprises. If money
              moves, Taxu automates the tax and financial work behind it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "AI",
                desc: "Powering the next generation of AI startups with flexible billing and payments.",
              },
              {
                icon: Layout,
                title: "SaaS",
                desc: "Manage recurring revenue and subscription lifecycles with ease.",
              },
              {
                icon: ShoppingBag,
                title: "Ecommerce",
                desc: "Unified online and in-person payments for modern retailers.",
              },
              {
                icon: Globe,
                title: "Platforms",
                desc: "Enable payments for your software platform or marketplace.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-xl bg-[#f6f9fc] hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-100"
              >
                <item.icon className="w-8 h-8 text-[#635bff] mb-6" />
                <h4 className="text-xl font-bold text-[#0a2540] mb-3">{item.title}</h4>
                <p className="text-[#425466] mb-6 text-sm leading-relaxed">{item.desc}</p>
                <div className="text-[#635bff] font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-32 bg-[#0a2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#635bff]/20 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[#00d4ff] font-semibold mb-6">Designed for developers</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Build tax, bookkeeping, and financial workflows faster with powerful APIs.
              </h3>
              <p className="text-xl text-[#adbdcc] mb-10">
                Save engineering time with unified tax, compliance, bookkeeping, and payout APIs. Taxu abstracts IRS
                rules, accounting logic, forms, identity checks, and banking rails—so your team builds once, not ten
                times.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/developer"
                  className="inline-flex items-center px-6 py-3 bg-[#00d4ff] text-[#0a2540] rounded-full font-medium hover:bg-[#00c4eb] transition-colors"
                >
                  Read the docs <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="bg-[#1a2540] rounded-xl border border-[#2e3d50] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a2540] border-b border-[#2e3d50]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="text-xs text-[#adbdcc] font-mono">server.js</div>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="text-[#adbdcc]">
                  <span className="text-[#ff7b72]">const</span> taxu <span className="text-[#ff7b72]">=</span> require(
                  <span className="text-[#a5d6ff]">'taxu'</span>)(
                  <span className="text-[#a5d6ff]">'sk_test_...'</span>);
                  <br />
                  <br />
                  <span className="text-[#ff7b72]">const</span> paymentIntent <span className="text-[#ff7b72]">=</span>{" "}
                  <span className="text-[#ff7b72]">await</span> taxu.paymentIntents.create({"{ "}
                  <br />
                  &nbsp;&nbsp;amount: <span className="text-[#79c0ff]">2000</span>,<br />
                  &nbsp;&nbsp;currency: <span className="text-[#a5d6ff]">'usd'</span>,<br />
                  &nbsp;&nbsp;payment_method_types: [<span className="text-[#a5d6ff]">'card'</span>],
                  <br />
                  {"}"});
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mt-20">
            {[
              {
                title: "Use Stripe with your stack",
                desc: "We offer client and server libraries in everything from React and PHP to .NET and iOS.",
              },
              {
                title: "Build AI agents",
                desc: "Create agents that can manage money and handle support tasks using the Taxu API.",
              },
              {
                title: "Explore prebuilt integrations",
                desc: "Connect Taxu to over a hundred tools including Adobe, Salesforce, and Xero.",
              },
              {
                title: "Build on Taxu Apps",
                desc: "Create an app just for your team or for the millions of businesses on Taxu.",
              },
            ].map((item) => (
              <div key={item.title} className="border-l border-[#2e3d50] pl-6">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-[#adbdcc] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h3 className="text-4xl font-bold text-[#0a2540] mb-6">Ready to get started?</h3>
            <p className="text-xl text-[#425466] mb-10">
              Create an account instantly to get started or contact us to design a custom package for your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-[#635bff] text-white rounded-full font-medium hover:bg-[#5851df] transition-colors group"
              >
                Start now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 text-[#0a2540] font-medium hover:text-[#635bff] transition-colors"
              >
                Contact sales
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
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
                {[
                  { label: "Payments", href: "/products/payments" },
                  { label: "Billing", href: "/products/billing" },
                  { label: "Connect", href: "/products/connect" },
                  { label: "Payouts", href: "/products/payouts" },
                  { label: "Issuing", href: "/products/issuing" },
                  { label: "Terminal", href: "/products/terminal" },
                  { label: "Tax", href: "/products/tax" },
                  { label: "Identity", href: "/products/identity" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Solutions</div>
              <ul className="space-y-3">
                {[
                  { label: "Ecommerce", href: "/solutions/ecommerce" },
                  { label: "SaaS", href: "/solutions/saas" },
                  { label: "Marketplaces", href: "/solutions/marketplaces" },
                  { label: "Embedded Finance", href: "/solutions/embedded-finance" },
                  { label: "Platforms", href: "/solutions/platforms" },
                  { label: "Creator Economy", href: "/solutions/creator-economy" },
                  { label: "Crypto", href: "/solutions/crypto" },
                  { label: "Global Businesses", href: "/solutions/global-businesses" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Resources</div>
              <ul className="space-y-3">
                {[
                  { label: "Support", href: "/support" },
                  { label: "Contact Sales", href: "/contact" },
                  { label: "Blog", href: "/blog" },
                  { label: "Guides", href: "/guides" },
                  { label: "Customer Stories", href: "/customers" },
                  { label: "Developers", href: "/developers" },
                  { label: "API Reference", href: "/docs" },
                  { label: "Partners", href: "/partners" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#0a2540] mb-6">Company</div>
              <ul className="space-y-3">
                {[
                  { label: "Jobs", href: "/jobs" },
                  { label: "Newsroom", href: "/newsroom" },
                  { label: "Taxu Press", href: "/press" },
                  { label: "Become a Partner", href: "/partners" },
                  { label: "Privacy & Terms", href: "/privacy" },
                  { label: "Sitemap", href: "/sitemap" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[#425466] hover:text-[#0a2540] font-medium transition-colors"
                    >
                      {item.label}
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
