import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Key, Zap, CheckCircle2, Code2 } from "lucide-react"

export const metadata: Metadata = {
  title: "API Overview - Taxu Developer Docs",
  description: "Learn about Taxu's unified APIs for tax filing, banking, investment, and accounting.",
}

export default function APIOverview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Taxu</div>
                <div className="text-xs text-slate-400">API Overview</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/developer/api-explorer"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                Try it out
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-1">
                <Link href="#overview" className="block px-3 py-2 text-sm text-blue-400 bg-blue-500/10 rounded-lg">
                  Overview
                </Link>
                <Link
                  href="#authentication"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Authentication
                </Link>
                <Link
                  href="#rate-limits"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Rate limits
                </Link>
                <Link
                  href="#api-versions"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  API versions
                </Link>
                <Link
                  href="#errors"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Error handling
                </Link>
                <Link
                  href="#pagination"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Pagination
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Overview Section */}
            <section id="overview">
              <h1 className="text-4xl font-bold text-white mb-6">Taxu's APIs</h1>
              <p className="text-lg text-slate-300 mb-8">
                Learn about Taxu's powerful unified APIs for tax filing, banking, investment, and accounting.
              </p>

              <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-8">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-300">
                      Taxu provides a unified set of <span className="text-blue-400 font-semibold">REST APIs</span>,
                      comprised of <span className="text-blue-400 font-semibold">four namespaces</span>, for accepting
                      payments, managing financial workflows, filing taxes, and building comprehensive financial
                      applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
                <p className="text-slate-300 mb-6">
                  You can authenticate requests, shape responses, localize data, test integrations, and handle errors
                  consistently across Taxu products.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      RESTful Architecture
                    </h3>
                    <p className="text-sm text-slate-400">
                      Simple HTTP verbs (GET, POST, PUT, DELETE) with predictable resource-oriented URLs
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      JSON Responses
                    </h3>
                    <p className="text-sm text-slate-400">
                      All API responses return JSON with consistent error formatting
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Idempotent Requests
                    </h3>
                    <p className="text-sm text-slate-400">
                      Safe retries with idempotency keys to prevent duplicate operations
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Webhooks
                    </h3>
                    <p className="text-sm text-slate-400">Real-time event notifications for asynchronous operations</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Base URL */}
            <section className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Base URL</h3>
              <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 font-mono">
                <code className="text-sm text-blue-400">https://api.taxu.com/v1</code>
              </div>
            </section>

            {/* Authentication Section */}
            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication and security</h2>
              <p className="text-slate-300 mb-6">
                Taxu uses API keys to authenticate requests. You can view and manage your API keys in the Dashboard.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-400" />
                    API Keys
                  </h3>
                  <p className="text-sm text-slate-300 mb-4">Authenticate requests with secret and restricted keys.</p>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10">
                      <div className="text-xs text-slate-500 mb-1">Test Mode</div>
                      <code className="text-sm text-green-400 font-mono">sk_test_51StgIqE...</code>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10">
                      <div className="text-xs text-slate-500 mb-1">Live Mode</div>
                      <code className="text-sm text-orange-400 font-mono">sk_live_51StgIqE...</code>
                    </div>
                  </div>
                  <Link
                    href="/developer/docs/api/authentication"
                    className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mt-4"
                  >
                    Learn more about API keys
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-200">
                    <strong>Important:</strong> Your API keys carry many privileges, so be sure to keep them secure! Do
                    not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so
                    forth.
                  </p>
                </div>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Rate limits</h2>
              <p className="text-slate-300 mb-6">Understand throttling and rate limiting behavior with the Taxu API.</p>
              <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-blue-400 mb-2">100</div>
                    <div className="text-sm text-slate-400">requests per second</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-400 mb-2">10,000</div>
                    <div className="text-sm text-slate-400">requests per minute</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">500,000</div>
                    <div className="text-sm text-slate-400">requests per day</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Start */}
            <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
              <p className="text-slate-300 mb-6">
                Try out our interactive API explorer or dive into the comprehensive documentation.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/developer/api-explorer"
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors inline-flex items-center gap-2"
                >
                  Open API Explorer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/developer/workbench"
                  className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium transition-all"
                >
                  Try Workbench
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
