import type { Metadata } from "next"
import Link from "next/link"
import { Copy, Terminal, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "JavaScript SDK - Taxu Developer Docs",
  description: "Official JavaScript library for the Taxu API for browser and Node.js environments.",
}

export default function JavaScriptSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-slate-900 font-bold text-lg">
                JS
              </div>
              <div>
                <div className="text-sm font-semibold text-white">JavaScript SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Library</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.npmjs.com/package/@taxu/js"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                npm
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
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              <a href="#installation" className="block px-3 py-2 text-sm text-blue-400 bg-blue-500/10 rounded-lg">
                Installation
              </a>
              <a
                href="#usage"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Usage
              </a>
              <a
                href="#examples"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Examples
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-16">
            <section>
              <h1 className="text-4xl font-bold text-white mb-6">JavaScript SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  Universal JavaScript library for the Taxu API, works in browser and Node.js environments.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu JavaScript SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu JavaScript SDK is a universal library that works seamlessly in both browser and Node.js
                    environments. Whether you're building a client-side single-page application, a server-rendered
                    website, or a full-stack JavaScript app, this SDK provides a consistent API for tax and financial
                    operations.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    With zero dependencies and a tiny bundle size, the JavaScript SDK is perfect for modern web
                    applications where performance matters. It handles tax calculations, form generation, and document
                    processing with a simple, promise-based API that works everywhere JavaScript runs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ideal For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Vanilla JavaScript applications</li>
                      <li>• jQuery and legacy codebases</li>
                      <li>• Server-side rendering (SSR)</li>
                      <li>• Static site generators</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Universal Features:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Browser and Node.js compatible</li>
                      <li>• Zero dependencies</li>
                      <li>• Tiny bundle size (~15KB gzipped)</li>
                      <li>• Promise-based API</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium">
                  v1.5.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                  Universal
                </div>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">npm</span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">npm install @taxu/js</code>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Usage</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import Taxu from '@taxu/js';

const taxu = new Taxu('your_publishable_key');

// Calculate tax
const result = await taxu.tax.calculate({
  income: 75000,
  filingStatus: 'single'
});

console.log(result.totalTax);`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
