import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  ArrowRight,
  Copy,
  CheckCircle2,
  Terminal,
  Code2,
  Zap,
  BookOpen,
  ExternalLink,
  Sparkles,
  Shield,
  Gauge,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Node.js SDK - Taxu Developer Docs",
  description: "Official Node.js library for the Taxu API with TypeScript support and comprehensive examples.",
}

export default function NodeJSSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F]">
      {/* Header */}
      <div className="border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-green-500/30 flex items-center justify-center p-2.5 group-hover:border-green-400/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Image
                  src="/icons/nodejs.png"
                  alt="Node.js"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
              <div>
                <div className="text-base font-semibold text-white group-hover:text-green-400 transition-colors">
                  Node.js SDK
                </div>
                <div className="text-xs text-slate-500">Official Taxu Library</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/taxu/taxu-node"
                target="_blank"
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                GitHub
              </Link>
              <Link
                href="/developer/api-explorer"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40"
              >
                API Explorer
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-1.5">
              <Link
                href="#installation"
                className="block px-4 py-2.5 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                Installation
              </Link>
              <Link
                href="#authentication"
                className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Authentication
              </Link>
              <Link
                href="#usage"
                className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Basic Usage
              </Link>
              <Link
                href="#typescript"
                className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                TypeScript
              </Link>
              <Link
                href="#examples"
                className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Examples
              </Link>
              <Link
                href="#error-handling"
                className="block px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Error Handling
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-1 space-y-20">
            {/* Hero Section */}
            <section>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Most Popular
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent">
                Node.js SDK
              </h1>

              <div className="space-y-6 mb-10">
                <p className="text-xl text-slate-300 leading-relaxed">
                  The official Taxu Node.js library provides convenient access to the Taxu API from applications written
                  in server-side JavaScript and TypeScript.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-green-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu Node.js SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu Node.js SDK is a production-ready library that enables developers to integrate tax filing,
                    compliance, and financial management capabilities directly into their Node.js applications. Built
                    with modern async/await patterns and full TypeScript support, it provides a seamless developer
                    experience for building tax and finance products.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Whether you're building a payroll platform, managing contractor payments with 1099 forms, or
                    calculating tax obligations, the Node.js SDK handles the complexity of tax regulations, e-filing
                    protocols, and IRS requirements so you can focus on your core product.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Perfect For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• SaaS platforms handling contractor payments</li>
                      <li>• Payroll and HR systems</li>
                      <li>• Accounting and bookkeeping software</li>
                      <li>• Marketplace and gig economy platforms</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Key Capabilities:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• IRS-compliant tax form filing (W-2, 1099, W-9)</li>
                      <li>• Real-time tax calculations</li>
                      <li>• Document extraction and validation</li>
                      <li>• Automated compliance monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-green-500/30 transition-all duration-300">
                    <Gauge className="w-8 h-8 text-green-400 mb-3" />
                    <div className="text-sm font-semibold text-white mb-1">TypeScript First</div>
                    <div className="text-xs text-slate-500">Full type safety & autocomplete</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-blue-500/30 transition-all duration-300">
                    <Zap className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-sm font-semibold text-white mb-1">Async/Await</div>
                    <div className="text-xs text-slate-500">Modern promise-based API</div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300">
                    <Shield className="w-8 h-8 text-purple-400 mb-3" />
                    <div className="text-sm font-semibold text-white mb-1">Battle Tested</div>
                    <div className="text-xs text-slate-500">Used by 5000+ companies</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-green-300 text-sm font-medium">
                  v4.2.0
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
                  TypeScript Support
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/20 text-slate-300 text-sm font-medium">
                  Node 14+
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
              <p className="text-slate-400 mb-8 text-lg">Install the package with your preferred package manager:</p>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative rounded-2xl border border-white/[0.08] bg-[#0D0D12] overflow-hidden group-hover:border-green-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-slate-400">npm</span>
                      </div>
                      <button className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <code className="text-green-400 font-mono text-sm">npm install taxu</code>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative rounded-2xl border border-white/[0.08] bg-[#0D0D12] overflow-hidden group-hover:border-blue-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-400">yarn</span>
                      </div>
                      <button className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <code className="text-blue-400 font-mono text-sm">yarn add taxu</code>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="relative rounded-2xl border border-white/[0.08] bg-[#0D0D12] overflow-hidden group-hover:border-slate-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-400">pnpm</span>
                      </div>
                      <button className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <code className="text-slate-400 font-mono text-sm">pnpm add taxu</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-200">
                  <strong>Requirements:</strong> Node.js 14.0.0 or higher
                </p>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>
              <p className="text-slate-300 mb-6">
                Initialize the library with your API key. You can find your API keys in your dashboard.
              </p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">javascript</span>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200">
                    <span className="text-purple-400">const</span> <span className="text-blue-300">Taxu</span>{" "}
                    <span className="text-pink-400">=</span> <span className="text-cyan-400">require</span>(
                    <span className="text-green-400">'taxu'</span>);
                    <br />
                    <br />
                    <span className="text-purple-400">const</span> <span className="text-blue-300">taxu</span>{" "}
                    <span className="text-pink-400">=</span> <span className="text-purple-400">new</span>{" "}
                    <span className="text-cyan-400">Taxu</span>(
                    <span className="text-green-400">'your_api_key_here'</span>);
                  </pre>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-200">
                  <strong>Security:</strong> Never commit your API keys to version control. Use environment variables
                  instead.
                </p>
              </div>
            </section>

            {/* Basic Usage */}
            <section id="usage" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>
              <p className="text-slate-300 mb-6">Here's a quick example of filing a Form 1099-NEC:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">javascript</span>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    <span className="text-purple-400">const</span> <span className="text-blue-300">filing</span>{" "}
                    <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-300">taxu</span>.<span className="text-yellow-300">tax</span>.
                    <span className="text-cyan-400">file1099NEC</span>({`({`}
                    <br />
                    {"  "}
                    <span className="text-yellow-300">taxYear</span>: <span className="text-purple-300">2024</span>,
                    <br />
                    {"  "}
                    <span className="text-yellow-300">payer</span>: {`{`}
                    <br />
                    {"    "}
                    <span className="text-yellow-300">name</span>: <span className="text-green-400">'Acme Corp'</span>,
                    <br />
                    {"    "}
                    <span className="text-yellow-300">ein</span>: <span className="text-green-400">'12-3456789'</span>,
                    <br />
                    {"    "}
                    <span className="text-yellow-300">address</span>:{" "}
                    <span className="text-green-400">'123 Business St'</span>,<br />
                    {"  "}
                    {`}`},<br />
                    {"  "}
                    <span className="text-yellow-300">recipient</span>: {`{`}
                    <br />
                    {"    "}
                    <span className="text-yellow-300">name</span>:{" "}
                    <span className="text-green-400">'John Contractor'</span>,<br />
                    {"    "}
                    <span className="text-yellow-300">ssn</span>: <span className="text-green-400">'123-45-6789'</span>,
                    <br />
                    {"    "}
                    <span className="text-yellow-300">address</span>:{" "}
                    <span className="text-green-400">'456 Worker Ave'</span>,<br />
                    {"  "}
                    {`}`},<br />
                    {"  "}
                    <span className="text-yellow-300">nonEmployeeCompensation</span>:{" "}
                    <span className="text-purple-300">15000</span>
                    <br />
                    {`});`}
                    <br />
                    <br />
                    <span className="text-blue-300">console</span>.<span className="text-cyan-400">log</span>(
                    <span className="text-blue-300">filing</span>.<span className="text-yellow-300">id</span>);{" "}
                    <span className="text-gray-500">// fil_1234567890</span>
                  </pre>
                </div>
              </div>
            </section>

            {/* TypeScript Support */}
            <section id="typescript" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-white mb-6">TypeScript Support</h2>
              <p className="text-slate-300 mb-6">
                The library includes TypeScript definitions for all API methods and responses:
              </p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">typescript</span>
                  </div>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    <span className="text-purple-400">import</span> <span className="text-blue-300">Taxu</span>{" "}
                    <span className="text-purple-400">from</span> <span className="text-green-400">'taxu'</span>;<br />
                    <span className="text-purple-400">import</span> <span className="text-purple-400">type</span> {`{ `}
                    <span className="text-blue-300">Filing</span>, <span className="text-blue-300">TaxCalculation</span>{" "}
                    {`}`} <span className="text-purple-400">from</span> <span className="text-green-400">'taxu'</span>;
                    <br />
                    <br />
                    <span className="text-purple-400">const</span> <span className="text-blue-300">taxu</span>{" "}
                    <span className="text-pink-400">=</span> <span className="text-purple-400">new</span>{" "}
                    <span className="text-cyan-400">Taxu</span>(<span className="text-blue-300">process</span>.
                    <span className="text-yellow-300">env</span>.<span className="text-yellow-300">TAXU_API_KEY</span>);
                    <br />
                    <br />
                    <span className="text-purple-400">const</span> <span className="text-blue-300">calculation</span>:{" "}
                    <span className="text-blue-300">TaxCalculation</span> <span className="text-pink-400">=</span>{" "}
                    <span className="text-purple-400">await</span> <span className="text-blue-300">taxu</span>.
                    <span className="text-yellow-300">tax</span>.<span className="text-cyan-400">calculate</span>({`({`}
                    <br />
                    {"  "}
                    <span className="text-yellow-300">income</span>: <span className="text-purple-300">75000</span>,
                    <br />
                    {"  "}
                    <span className="text-yellow-300">filingStatus</span>:{" "}
                    <span className="text-green-400">'single'</span>
                    <br />
                    {`});`}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Full Type Safety</h3>
                  <p className="text-sm text-slate-400">
                    Complete TypeScript definitions for all API endpoints and responses
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">IntelliSense Support</h3>
                  <p className="text-sm text-slate-400">
                    Auto-completion and inline documentation in VS Code and other IDEs
                  </p>
                </div>
              </div>
            </section>

            {/* More Examples */}
            <section id="examples" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-white mb-6">More Examples</h2>

              <div className="space-y-8">
                {/* Example 1: Tax Calculation */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Calculate Federal Tax</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                      <span className="text-sm text-slate-400">javascript</span>
                      <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                    </div>
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">result</span>{" "}
                        <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                        <span className="text-blue-300">taxu</span>.<span className="text-yellow-300">tax</span>.
                        <span className="text-cyan-400">calculate</span>({`({`}
                        <br />
                        {"  "}
                        <span className="text-yellow-300">income</span>: <span className="text-purple-300">85000</span>,
                        <br />
                        {"  "}
                        <span className="text-yellow-300">filingStatus</span>:{" "}
                        <span className="text-green-400">'married_filing_jointly'</span>,<br />
                        {"  "}
                        <span className="text-yellow-300">deductions</span>: {`{`}
                        <br />
                        {"    "}
                        <span className="text-yellow-300">standard</span>: <span className="text-purple-300">true</span>
                        <br />
                        {"  "}
                        {`}`}
                        <br />
                        {`});`}
                        <br />
                        <br />
                        <span className="text-gray-500">// Result:</span>
                        <br />
                        <span className="text-gray-500">// {`{ taxLiability: 7488, effectiveRate: 8.8 }`}</span>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Example 2: Document Upload */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Upload & Extract W-2</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                      <span className="text-sm text-slate-400">javascript</span>
                      <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                    </div>
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">fs</span>{" "}
                        <span className="text-pink-400">=</span> <span className="text-cyan-400">require</span>(
                        <span className="text-green-400">'fs'</span>);
                        <br />
                        <br />
                        <span className="text-purple-400">const</span> <span className="text-blue-300">document</span>{" "}
                        <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                        <span className="text-blue-300">taxu</span>.<span className="text-yellow-300">documents</span>.
                        <span className="text-cyan-400">upload</span>({`({`}
                        <br />
                        {"  "}
                        <span className="text-yellow-300">file</span>: <span className="text-blue-300">fs</span>.
                        <span className="text-cyan-400">createReadStream</span>(
                        <span className="text-green-400">'./w2.pdf'</span>),
                        <br />
                        {"  "}
                        <span className="text-yellow-300">type</span>: <span className="text-green-400">'w2'</span>
                        <br />
                        {`});`}
                        <br />
                        <br />
                        <span className="text-gray-500">// Wait for processing</span>
                        <br />
                        <span className="text-purple-400">const</span> <span className="text-blue-300">extracted</span>{" "}
                        <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                        <span className="text-blue-300">taxu</span>.<span className="text-yellow-300">documents</span>.
                        <span className="text-cyan-400">retrieve</span>(<span className="text-blue-300">document</span>.
                        <span className="text-yellow-300">id</span>);
                        <br />
                        <span className="text-blue-300">console</span>.<span className="text-cyan-400">log</span>(
                        <span className="text-blue-300">extracted</span>.<span className="text-yellow-300">data</span>.
                        <span className="text-yellow-300">wages</span>); <span className="text-gray-500">// 75000</span>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Error Handling */}
            <section id="error-handling" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-white mb-6">Error Handling</h2>
              <p className="text-slate-300 mb-6">
                The SDK throws specific error types for different failure scenarios:
              </p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <span className="text-sm text-slate-400">javascript</span>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    <span className="text-purple-400">try</span> {`{`}
                    <br />
                    {"  "}
                    <span className="text-purple-400">const</span> <span className="text-blue-300">filing</span>{" "}
                    <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                    <span className="text-blue-300">taxu</span>.<span className="text-yellow-300">tax</span>.
                    <span className="text-cyan-400">file1099</span>(data);
                    <br />
                    {`}`} <span className="text-purple-400">catch</span> (<span className="text-blue-300">error</span>){" "}
                    {`{`}
                    <br />
                    {"  "}
                    <span className="text-purple-400">if</span> (<span className="text-blue-300">error</span>{" "}
                    <span className="text-purple-400">instanceof</span> <span className="text-blue-300">Taxu</span>.
                    <span className="text-blue-300">errors</span>.
                    <span className="text-blue-300">TaxuAuthenticationError</span>) {`{`}
                    <br />
                    {"    "}
                    <span className="text-gray-500">// Invalid API key</span>
                    <br />
                    {"  "}
                    {`}`} <span className="text-purple-400">else if</span> (<span className="text-blue-300">error</span>{" "}
                    <span className="text-purple-400">instanceof</span> <span className="text-blue-300">Taxu</span>.
                    <span className="text-blue-300">errors</span>.
                    <span className="text-blue-300">TaxuValidationError</span>) {`{`}
                    <br />
                    {"    "}
                    <span className="text-gray-500">// Invalid parameters</span>
                    <br />
                    {"  "}
                    {`}`} <span className="text-purple-400">else if</span> (<span className="text-blue-300">error</span>{" "}
                    <span className="text-purple-400">instanceof</span> <span className="text-blue-300">Taxu</span>.
                    <span className="text-blue-300">errors</span>.
                    <span className="text-blue-300">TaxuRateLimitError</span>) {`{`}
                    <br />
                    {"    "}
                    <span className="text-gray-500">// Too many requests</span>
                    <br />
                    {"  "}
                    {`}`}
                    <br />
                    {`}`}
                  </pre>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50 border border-white/10">
                  <code className="text-sm font-mono text-blue-300">TaxuAuthenticationError</code>
                  <p className="text-xs text-slate-400 mt-2">Invalid API key or authentication failure</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-white/10">
                  <code className="text-sm font-mono text-blue-300">TaxuValidationError</code>
                  <p className="text-xs text-slate-400 mt-2">Invalid request parameters or missing required fields</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-white/10">
                  <code className="text-sm font-mono text-blue-300">TaxuRateLimitError</code>
                  <p className="text-xs text-slate-400 mt-2">API rate limit exceeded</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-white/10">
                  <code className="text-sm font-mono text-blue-300">TaxuAPIError</code>
                  <p className="text-xs text-slate-400 mt-2">General API error or server-side issue</p>
                </div>
              </div>
            </section>

            {/* Resources */}
            <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Additional Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/developer/docs/api/overview"
                  className="p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">API Reference</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link
                  href="/developer/api-explorer"
                  className="p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">API Explorer</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link
                  href="https://github.com/taxu/taxu-node"
                  target="_blank"
                  className="p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-green-400" />
                      <span className="text-white font-medium">GitHub Repository</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
                <Link
                  href="https://npmjs.com/package/taxu"
                  target="_blank"
                  className="p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-cyan-400" />
                      <span className="text-white font-medium">npm Package</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
