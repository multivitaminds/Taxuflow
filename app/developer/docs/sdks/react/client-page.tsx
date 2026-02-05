"use client"

import Link from "next/link"
import { Copy, Terminal, ExternalLink, Zap } from "lucide-react"

export default function ReactSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">React SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Hooks & Components</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.npmjs.com/package/@taxu/react"
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
                href="#setup"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Setup
              </a>
              <a
                href="#hooks"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Hooks
              </a>
              <a
                href="#components"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Components
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
              <h1 className="text-4xl font-bold text-white mb-6">React SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  Build powerful tax and finance experiences with React hooks and pre-built components from Taxu.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu React SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu React SDK is a collection of React hooks and pre-built components designed to make building
                    tax and financial applications effortless. With built-in state management, error handling, and
                    loading states, it provides a declarative API that feels natural to React developers.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Perfect for modern React applications using Next.js, Create React App, or Vite, the React SDK
                    enables developers to build sophisticated tax filing interfaces, calculation tools, and document
                    management systems with minimal code. It handles the complexity of API calls, state synchronization,
                    and error recovery so you can focus on building great user experiences.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ideal For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Next.js and Create React App projects</li>
                      <li>• Single-page applications (SPAs)</li>
                      <li>• Progressive web apps (PWAs)</li>
                      <li>• Tax and finance dashboards</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">React Benefits:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Custom React hooks for state</li>
                      <li>• Pre-built UI components</li>
                      <li>• Automatic error handling</li>
                      <li>• TypeScript support included</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                  v2.1.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                  React 18+
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
                  <code className="text-green-400 font-mono text-sm">npm install @taxu/react</code>
                </div>
              </div>
            </section>

            <section id="setup" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Setup</h2>
              <p className="text-slate-300 mb-6">Wrap your app with the TaxuProvider:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import { TaxuProvider } from '@taxu/react';

function App() {
  return (
    <TaxuProvider apiKey="your_publishable_key">
      <YourApp />
    </TaxuProvider>
  );
}`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="hooks" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Hooks</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">useTaxCalculation</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`function TaxCalculator() {
  const { calculate, result, loading, error } = useTaxCalculation();

  const handleCalculate = async () => {
    await calculate({
      income: 75000,
      filingStatus: 'single'
    });
  };

  return (
    <div>
      <button onClick={handleCalculate} disabled={loading}>
        Calculate Tax
      </button>
      {result && <p>Tax Owed: \${result.totalTax}</p>}
    </div>
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">useFilings</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`function FilingsList() {
  const { filings, loading, error, refetch } = useFilings();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {filings.map(filing => (
        <div key={filing.id}>
          {filing.formType} - {filing.status}
        </div>
      ))}
    </div>
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="components" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Pre-built Components</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">TaxFormUploader</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`function UploadPage() {
  return (
    <TaxFormUploader
      formType="w2"
      taxYear={2024}
      onSuccess={(document) => {
        console.log('Uploaded:', document.id);
      }}
    />
  );
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
