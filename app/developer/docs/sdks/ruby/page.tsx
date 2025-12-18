import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Copy, Terminal, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Ruby SDK - Taxu Developer Docs",
  description: "Official Ruby gem for the Taxu API with elegant Ruby syntax and comprehensive documentation.",
}

export default function RubySDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-2">
                <Image
                  src="/icons/ruby.png"
                  alt="Ruby"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Ruby SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Gem</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://rubygems.org/gems/taxu"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                RubyGems
              </Link>
              <Link
                href="/developer/api-explorer"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                API Explorer
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              <a href="#installation" className="block px-3 py-2 text-sm text-blue-400 bg-blue-500/10 rounded-lg">
                Installation
              </a>
              <a
                href="#authentication"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Authentication
              </a>
              <a
                href="#usage"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Basic Usage
              </a>
              <a
                href="#examples"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Examples
              </a>
              <a
                href="#error-handling"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Error Handling
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            <section>
              <h1 className="text-4xl font-bold text-white mb-6">Ruby SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  The official Taxu Ruby gem provides idiomatic Ruby access to the Taxu API with elegant syntax and
                  comprehensive error handling.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-pink-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu Ruby SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu Ruby gem brings the power of automated tax compliance and filing to Ruby and Rails
                    applications. Built with Ruby conventions and idioms in mind, it provides a beautiful, expressive
                    API for handling tax operations in your Ruby projects.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Whether you're building a Rails SaaS application, managing contractor payments, or integrating tax
                    calculations into your Ruby stack, the gem handles IRS compliance, form generation, and e-filing
                    with elegant Ruby syntax that Ruby developers love.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Perfect For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Ruby on Rails SaaS platforms</li>
                      <li>• E-commerce and marketplace apps</li>
                      <li>• Financial services platforms</li>
                      <li>• Contractor payment systems</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ruby Advantages:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Idiomatic Ruby conventions</li>
                      <li>• Rails integration out of the box</li>
                      <li>• Elegant error handling</li>
                      <li>• Active Record style syntax</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  v2.5.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium">
                  Ruby 2.7+
                </div>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
              <p className="text-slate-300 mb-6">Add to your Gemfile:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden mb-4">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <span className="text-sm text-slate-400">Gemfile</span>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">gem 'taxu'</code>
                </div>
              </div>

              <p className="text-slate-300 mb-4">Then run:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">terminal</span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">bundle install</code>
                </div>
              </div>
            </section>

            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>
              <p className="text-slate-300 mb-6">Configure your API key:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`require 'taxu'

Taxu.api_key = 'your_api_key_here'`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>
              <p className="text-slate-300 mb-6">File a Form 1099-NEC:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`filing = Taxu::Tax.file_1099_nec(
  tax_year: 2024,
  payer: {
    name: 'Acme Corp',
    ein: '12-3456789',
    address: '123 Business St'
  },
  recipient: {
    name: 'John Contractor',
    ssn: '123-45-6789',
    address: '456 Worker Ave'
  },
  non_employee_compensation: 15000
)

puts filing.id  # fil_1234567890`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="examples" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">More Examples</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Calculate Federal Tax</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`result = Taxu::Tax.calculate(
  income: 85000,
  deductions: 12000,
  filing_status: 'single',
  state: 'CA'
)

puts "Federal tax: $#{result.federal_tax}"
puts "State tax: $#{result.state_tax}"
puts "Effective rate: #{result.effective_rate}%"`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Upload Tax Document</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`document = Taxu::Documents.upload(
  file: File.open('w2.pdf'),
  type: 'w2',
  tax_year: 2024
)

puts "Document ID: #{document.id}"
puts "Status: #{document.status}"`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="error-handling" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Error Handling</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`begin
  filing = Taxu::Tax.file_1099_nec(...)
rescue Taxu::AuthenticationError
  puts "Invalid API key"
rescue Taxu::ValidationError => e
  puts "Validation error: #{e.message}"
rescue Taxu::RateLimitError
  puts "Rate limit exceeded"
rescue Taxu::TaxuError => e
  puts "API error: #{e}"
end`}
                  </pre>
                </div>
              </div>
            </section>

            <section className="border-t border-white/10 pt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                  href="/developer/docs/api/tax-filing"
                  className="p-6 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-900 transition-colors group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Tax Filing API
                  </h3>
                  <p className="text-sm text-slate-400">Complete API reference for tax filing</p>
                </Link>
                <Link
                  href="/developer/api-explorer"
                  className="p-6 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-900 transition-colors group"
                >
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    API Explorer
                  </h3>
                  <p className="text-sm text-slate-400">Test API endpoints interactively</p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
