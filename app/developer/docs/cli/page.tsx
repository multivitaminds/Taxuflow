import type { Metadata } from "next"
import Link from "next/link"
import { Terminal, Download, CheckCircle2, ArrowRight, Copy } from "lucide-react"

export const metadata: Metadata = {
  title: "Taxu CLI - Developer Docs",
  description: "Install and use the Taxu CLI to manage your resources from the command line.",
}

export default function TaxuCLI() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Taxu CLI</div>
                <div className="text-xs text-slate-400">Command Line Interface</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-1">
                <Link href="#overview" className="block px-3 py-2 text-sm text-purple-400 bg-purple-500/10 rounded-lg">
                  Overview
                </Link>
                <Link
                  href="#install"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Installation
                </Link>
                <Link
                  href="#usage"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Usage
                </Link>
                <Link
                  href="#commands"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Commands
                </Link>
                <Link
                  href="#webhooks"
                  className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Testing webhooks
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Hero */}
            <section id="overview">
              <h1 className="text-4xl font-bold text-white mb-6">Install the Taxu CLI</h1>
              <p className="text-lg text-slate-300 mb-8">
                Install the Taxu CLI on macOS, Windows, or Linux. Use it to manage your Taxu resources in test mode,
                test webhooks locally, and interact with the Taxu API directly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Test webhooks</h3>
                  <p className="text-sm text-slate-400">Forward webhook events to your local development server</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Trigger events</h3>
                  <p className="text-sm text-slate-400">Generate test events to simulate real scenarios</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">Call APIs</h3>
                  <p className="text-sm text-slate-400">Interact with the Taxu API directly from your terminal</p>
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="install" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Install the Taxu CLI</h2>

              <div className="space-y-6">
                {/* npm */}
                <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">npm</h3>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 font-mono">
                    <code className="text-sm text-green-400">npm install -g taxu-cli</code>
                  </div>
                </div>

                {/* Homebrew */}
                <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Homebrew (macOS)</h3>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 font-mono">
                    <code className="text-sm text-green-400">brew install taxu-cli</code>
                  </div>
                </div>

                {/* Windows */}
                <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Windows (Scoop)</h3>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 font-mono">
                    <code className="text-sm text-green-400">scoop install taxu-cli</code>
                  </div>
                </div>

                {/* Linux */}
                <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Linux (Debian/Ubuntu)</h3>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 font-mono space-y-2">
                    <div className="text-sm text-green-400">curl -fsSL https://cli.taxu.com/install.sh | bash</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Login */}
            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Log in to the CLI</h2>
              <p className="text-slate-300 mb-6">
                Log in and authenticate your Taxu account with your account credentials to generate a set of restricted
                keys.
              </p>
              <div className="p-6 rounded-xl bg-slate-900/50 border border-white/10">
                <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 font-mono mb-4">
                  <code className="text-sm text-green-400">taxu login</code>
                </div>
                <p className="text-sm text-slate-400">
                  This opens your browser for authentication and generates a pair of API keys for your account.
                </p>
              </div>
            </section>

            {/* Common Commands */}
            <section id="commands" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Common commands</h2>

              <div className="space-y-4">
                {[
                  { cmd: "taxu help", desc: "View supported Taxu commands" },
                  { cmd: "taxu customers list", desc: "List all customers" },
                  { cmd: "taxu payments list", desc: "List recent payments" },
                  { cmd: "taxu trigger payment_intent.created", desc: "Trigger test webhook event" },
                  {
                    cmd: "taxu listen --forward-to localhost:3000/api/webhooks",
                    desc: "Forward webhooks to local server",
                  },
                ].map((item) => (
                  <div key={item.cmd} className="p-4 rounded-xl border border-white/10 bg-slate-900/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="p-3 rounded-lg bg-slate-950/50 border border-white/10 font-mono mb-2">
                          <code className="text-sm text-green-400">{item.cmd}</code>
                        </div>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0">
                        <Copy className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">Get started with the CLI</h3>
              <p className="text-slate-300 mb-6">Download the Taxu CLI and start testing your integration today.</p>
              <div className="flex items-center gap-4">
                <button className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors inline-flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download CLI
                </button>
                <Link
                  href="/developer/docs"
                  className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium transition-all inline-flex items-center gap-2"
                >
                  View documentation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
