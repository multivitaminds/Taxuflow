import type { Metadata } from "next"
import Link from "next/link"
import {
  BookOpen,
  Code2,
  Terminal,
  Package,
  Zap,
  FileText,
  Globe,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Taxu Developer Documentation",
  description: "Explore our guides and examples to integrate Taxu.",
}

const products = [
  {
    name: "Tax Filing",
    description: "Complete 1099, W-2, and business tax filing",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    apis: ["Form 1099-NEC", "Form W-2", "1040 Filing", "State Filing"],
  },
  {
    name: "Neobank",
    description: "Banking and payment infrastructure",
    icon: Globe,
    color: "from-purple-500 to-purple-600",
    apis: ["Accounts", "Transactions", "Cards", "ACH Transfers"],
  },
  {
    name: "Investment",
    description: "Trading and portfolio management",
    icon: Zap,
    color: "from-indigo-500 to-indigo-600",
    apis: ["Orders", "Positions", "Market Data", "Portfolio Analytics"],
  },
  {
    name: "Accounting",
    description: "Bookkeeping and financial reporting",
    icon: BookOpen,
    color: "from-cyan-500 to-cyan-600",
    apis: ["Invoices", "Expenses", "Reports", "Reconciliation"],
  },
]

const quickLinks = [
  { name: "API Overview", href: "/developer/docs/api/overview", description: "Core concepts and getting started" },
  { name: "Authentication", href: "/developer/docs/api/authentication", description: "API keys and OAuth 2.0" },
  { name: "Webhooks", href: "/developer/docs/webhooks", description: "Real-time event notifications" },
  { name: "Rate Limits", href: "/developer/docs/api/rate-limits", description: "Request throttling and quotas" },
]

const sdks = [
  { name: "Node.js", icon: "⬢", color: "text-green-400" },
  { name: "Python", icon: "🐍", color: "text-blue-400" },
  { name: "Ruby", icon: "💎", color: "text-red-400" },
  { name: "PHP", icon: "🐘", color: "text-purple-400" },
  { name: "Go", icon: "🔷", color: "text-cyan-400" },
  { name: "Java", icon: "☕", color: "text-orange-400" },
  { name: ".NET", icon: "🔷", color: "text-indigo-400" },
  { name: "React", icon: "⚛️", color: "text-blue-400" },
]

export default function DeveloperDocumentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Taxu</div>
                <div className="text-xs text-slate-400">Documentation</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/developer/api-explorer"
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                API Explorer
              </Link>
              <Link href="/developer/workbench" className="text-sm text-slate-300 hover:text-white transition-colors">
                Workbench
              </Link>
              <Link
                href="/developer/docs/api/overview"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
              Documentation
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Explore our guides and examples to integrate Taxu's powerful financial platform into your application.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/developer/docs/api/overview"
                className="group px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all flex items-center gap-2"
              >
                Get started with APIs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/developer/api-explorer"
                className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium transition-all"
              >
                Explore APIs
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-white/20 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {link.name}
                </h3>
                <p className="text-sm text-slate-400">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Browse by Product */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Browse by product</h2>
          <p className="text-slate-400">Choose a platform to explore its APIs and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <Link
              key={product.name}
              href={`/developer/docs/api/${product.name.toLowerCase().replace(" ", "-")}`}
              className="group"
            >
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-white/20 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <product.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{product.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.apis.map((api) => (
                    <span
                      key={api}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300"
                    >
                      {api}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SDKs and Tools */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SDKs */}
          <Link href="/developer/docs/sdks" className="group lg:col-span-1">
            <div className="h-full p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">SDKs</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">Client and server libraries for your favorite languages</p>
              <div className="grid grid-cols-4 gap-3">
                {sdks.map((sdk) => (
                  <div key={sdk.name} className="flex flex-col items-center gap-1">
                    <div className="text-2xl">{sdk.icon}</div>
                    <span className="text-xs text-slate-400">{sdk.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-blue-400 text-sm font-medium">
                View SDKs
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* CLI */}
          <Link href="/developer/docs/cli" className="group lg:col-span-1">
            <div className="h-full p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Taxu CLI</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Manage your Taxu resources in test mode from the command line
              </p>
              <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 mb-6">
                <code className="text-sm text-green-400 font-mono">$ npm install -g taxu-cli</code>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Test webhooks locally
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Trigger test events
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Call APIs directly
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                Install CLI
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Workbench */}
          <Link href="/developer/workbench" className="group lg:col-span-1">
            <div className="h-full p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-semibold text-white">Workbench</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">Interactive shell for testing APIs directly in your browser</p>
              <div className="p-4 rounded-lg bg-slate-950/50 border border-white/10 mb-6">
                <div className="space-y-1 font-mono text-xs">
                  <div className="text-slate-500">$ taxu</div>
                  <div className="text-green-400">
                    {">"} payments.create({"{"}amount: 1099{"}"})
                  </div>
                  <div className="text-blue-400">✓ Payment created</div>
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Run code in browser
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Test all endpoints
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Real-time feedback
                </div>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
                Open Workbench
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Resources Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 mb-20">
        <div className="p-12 rounded-2xl bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Designed for developers</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl">
                Ship faster with powerful and easy-to-use APIs. We obsess over the maze of financial regulations so that
                your teams can build what you need on one platform.
              </p>
              <Link
                href="/developer/docs/api/overview"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Read the docs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <Shield className="w-24 h-24 text-blue-500/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
