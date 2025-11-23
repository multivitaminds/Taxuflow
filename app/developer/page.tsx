import Link from "next/link"
import { Terminal, ArrowRight, BookOpen } from "lucide-react"

export default function DeveloperPortal() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Stripe-inspired dark blue */}
      <section className="bg-gradient-to-r from-[#0F2244] to-[#13254B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#635bff]/10 to-transparent" />
        <div className="container mx-auto px-6 py-24 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-8">
              <Terminal className="w-4 h-4 text-[#00d4ff]" />
              Designed for developers
            </div>
            <h1 className="text-6xl font-bold mb-6 leading-tight">Ship faster with powerful and easy-to-use APIs</h1>
            <p className="text-xl text-[#adbdcc] mb-10 leading-relaxed max-w-2xl">
              Complete tax and accounting infrastructure with AI-powered document processing, real-time calculations,
              and enterprise-grade security. Everything you need to build world-class financial applications.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/developer/docs/getting-started"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#635bff] text-white rounded-lg hover:bg-[#5851df] transition-all font-bold text-lg shadow-lg hover:shadow-xl"
              >
                Get started with Taxu <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/developer/docs/api/documents"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all font-bold text-lg border border-white/20"
              >
                <BookOpen className="w-5 h-5" /> Explore all products
              </Link>
            </div>

            {/* Code Example */}
            <div className="mt-16 bg-[#0d1117] rounded-xl p-6 border border-[#1a3a52] shadow-2xl">
              <div className="flex items-center gap-2 mb-4 text-sm text-[#adbdcc]">
                <Terminal className="w-4 h-4" />
                <span>Try it out</span>
              </div>
              <div className="font-mono text-sm space-y-2">
                <div>
                  <span className="text-[#ff7b72]">$</span> <span className="text-[#79c0ff]">npm install</span>{" "}
                  <span className="text-white">@taxu/taxu-js</span>
                </div>
                <div className="h-px bg-[#1a3a52] my-4" />
                <div>
                  <span className="text-[#ff7b72]">const</span> <span className="text-white">taxu</span>{" "}
                  <span className="text-[#ff7b72]">=</span> <span className="text-[#d2a8ff]">new</span>{" "}
                  <span className="text-[#79c0ff]">Taxu</span>
                  <span className="text-white">(</span>
                  <span className="text-[#a5d6ff]">'your_api_key'</span>
                  <span className="text-white">)</span>
                </div>
                <div>
                  <span className="text-[#ff7b72]">const</span> <span className="text-white">result</span>{" "}
                  <span className="text-[#ff7b72]">=</span> <span className="text-[#ff7b72]">await</span>{" "}
                  <span className="text-white">taxu.tax.</span>
                  <span className="text-[#d2a8ff]">calculate</span>
                  <span className="text-white">({"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">income:</span> <span className="text-[#79c0ff]">75000</span>
                  <span className="text-white">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">filingStatus:</span> <span className="text-[#a5d6ff]">'single'</span>
                </div>
                <div>
                  <span className="text-white">{"}"})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start CTAs */}
      <section className="border-b border-gray-200 bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">No-code</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/get-started" className="text-[#635bff] hover:underline font-medium">
                    File taxes online
                  </Link>
                </li>
                <li>
                  <Link href="/individuals" className="text-[#635bff] hover:underline font-medium">
                    Invoice clients and customers
                  </Link>
                </li>
                <li>
                  <Link href="/businesses" className="text-[#635bff] hover:underline font-medium">
                    Set up recurring payments
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Taxu-hosted</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/developer/sandbox" className="text-[#635bff] hover:underline font-medium">
                    Use a prebuilt checkout page
                  </Link>
                </li>
                <li>
                  <Link href="/developer-portal" className="text-[#635bff] hover:underline font-medium">
                    Set up the customer portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">For developers</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/developer/docs/api/documents"
                    className="text-[#635bff] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    API reference{" "}
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href="/developer/quickstart" className="text-[#635bff] hover:underline font-medium">
                    Development quickstart
                  </Link>
                </li>
                <li>
                  <Link href="/developer/examples" className="text-[#635bff] hover:underline font-medium">
                    Browse our sample projects
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Try it out */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Try it out</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Link
                href="/developer/playground"
                className="block p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#635bff]">
                  Calculate a tax refund
                </h3>
                <p className="text-gray-600">Test our tax calculation API with real-time results</p>
              </Link>
              <Link
                href="/developer/sandbox"
                className="block p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#635bff]">Process a document</h3>
                <p className="text-gray-600">Upload and extract data from tax documents</p>
              </Link>
              <Link
                href="/developer/examples"
                className="block p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#635bff]">Create an invoice</h3>
                <p className="text-gray-600">Generate professional invoices with our API</p>
              </Link>
              <Link
                href="/developer/docs/api/accounting"
                className="block p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#635bff]">
                  Sync accounting data
                </h3>
                <p className="text-gray-600">Connect to QuickBooks and other platforms</p>
              </Link>
            </div>
            <div className="bg-[#0d1117] rounded-xl p-8 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-400 font-mono">server.js</span>
              </div>
              <div className="font-mono text-sm space-y-2 text-white">
                <div>
                  <span className="text-gray-500">{"// Calculate tax refund"}</span>
                </div>
                <div>
                  <span className="text-[#ff7b72]">const</span> <span className="text-white">refund</span>{" "}
                  <span className="text-[#ff7b72]">=</span> <span className="text-[#ff7b72]">await</span>{" "}
                  <span className="text-white">taxu.tax.</span>
                  <span className="text-[#d2a8ff]">calculateRefund</span>
                  <span className="text-white">({"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">income:</span> <span className="text-[#79c0ff]">75000</span>
                  <span className="text-white">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">deductions:</span> <span className="text-[#79c0ff]">12000</span>
                  <span className="text-white">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">withheld:</span> <span className="text-[#79c0ff]">8500</span>
                </div>
                <div>
                  <span className="text-white">{"}"})</span>
                </div>
                <div className="h-px bg-gray-800 my-4" />
                <div>
                  <span className="text-gray-500">{"// Response"}</span>
                </div>
                <div>
                  <span className="text-white">{"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">refundAmount:</span> <span className="text-[#79c0ff]">1250</span>
                  <span className="text-white">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">taxLiability:</span> <span className="text-[#79c0ff]">7250</span>
                  <span className="text-white">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-white">effectiveRate:</span> <span className="text-[#a5d6ff]">"9.67%"</span>
                </div>
                <div>
                  <span className="text-white">{"}"}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-800">
                <Link
                  href="/developer/playground"
                  className="text-[#635bff] hover:underline font-medium inline-flex items-center gap-2"
                >
                  Learn more about Tax Calculation API <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by product */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Browse by product</h2>

          {/* Tax & Filing */}
          <div className="mb-12">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Tax & Filing</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/developer/docs/api/tax-calculation" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">Tax Calculation</h4>
                <p className="text-gray-600 text-sm">Real-time tax calculations and refund estimates</p>
              </Link>
              <Link href="/developer/docs/api/documents" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">Document Intelligence</h4>
                <p className="text-gray-600 text-sm">AI-powered document processing and data extraction</p>
              </Link>
              <Link href="/developer/docs/api/ai-agents" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">AI Agents</h4>
                <p className="text-gray-600 text-sm">Intelligent tax assistants and automation</p>
              </Link>
            </div>
          </div>

          {/* Accounting */}
          <div className="mb-12">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Accounting</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/developer/docs/api/accounting" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">Accounting API</h4>
                <p className="text-gray-600 text-sm">Invoices, expenses, and financial management</p>
              </Link>
              <Link href="/developer/docs/api/chat" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">Chat API</h4>
                <p className="text-gray-600 text-sm">Conversational AI for tax and accounting queries</p>
              </Link>
            </div>
          </div>

          {/* Developer Tools */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Developer Tools</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/developer/sdks" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">SDKs</h4>
                <p className="text-gray-600 text-sm">Official libraries for 8 programming languages</p>
              </Link>
              <Link href="/developer/playground" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">API Playground</h4>
                <p className="text-gray-600 text-sm">Interactive testing environment</p>
              </Link>
              <Link href="/developer/cli" className="group">
                <h4 className="text-lg font-bold text-[#635bff] group-hover:underline mb-2">CLI</h4>
                <p className="text-gray-600 text-sm">Command-line tools for developers</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600 font-medium">API Endpoints</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">8</div>
              <div className="text-gray-600 font-medium">Official SDKs</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime SLA</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-gray-900 mb-2">{"<100ms"}</div>
              <div className="text-gray-600 font-medium">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0F2244] to-[#13254B] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-[#adbdcc] mb-10 max-w-2xl mx-auto">
            Join thousands of developers building the future of tax and accounting technology
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0a2540] rounded-lg hover:bg-gray-100 transition-all font-bold text-lg shadow-lg"
            >
              Create account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/developer/docs/getting-started"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all font-bold text-lg border border-white/20"
            >
              <BookOpen className="w-5 h-5" /> Read documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
