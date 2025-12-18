"use client"

import Link from "next/link"
import { Copy, Terminal, ExternalLink, Smartphone } from "lucide-react"
import { useState } from "react"
import React from "react"
import { useTaxCalculation, useDocumentScanner } from "@taxu/react-native"

function ReactNativeSDKPageClient() {
  const taxCalculation = useTaxCalculation()
  const documentScanner = useDocumentScanner()
  const [result, setResult] = useState(null)
  const [taxResult, setTaxResult] = React.useState(null)
  const [scannedDocument, setScannedDocument] = React.useState(null)

  const handleCalculate = async () => {
    const response = await taxCalculation.calculate({
      income: 75000,
      filingStatus: "single",
    })
    setResult(response)
  }

  const handleScan = async () => {
    const document = await documentScanner.scanDocument()
    setScannedDocument(document)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">React Native SDK</div>
                <div className="text-xs text-slate-400">iOS & Android</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.npmjs.com/package/@taxu/react-native"
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
              <h1 className="text-4xl font-bold text-white mb-6">React Native SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  Build mobile tax and finance experiences for iOS and Android with React Native and Taxu.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu React Native SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu React Native SDK brings full-featured tax and financial capabilities to iOS and Android
                    mobile applications. Built specifically for React Native with native performance optimizations, it
                    enables developers to create sophisticated mobile tax apps with a unified codebase.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Perfect for mobile fintech apps, contractor management platforms, and on-the-go tax tools, the React
                    Native SDK provides mobile-optimized components, offline support, and native performance. It handles
                    tax calculations, document scanning with the device camera, and secure form submission across both
                    iOS and Android platforms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Perfect For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Cross-platform mobile apps</li>
                      <li>• Fintech and tax mobile experiences</li>
                      <li>• Document scanning applications</li>
                      <li>• On-the-go tax calculators</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Mobile Features:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• iOS and Android support</li>
                      <li>• Native performance optimization</li>
                      <li>• Camera integration for documents</li>
                      <li>• Offline-first capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                  v1.8.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium">
                  iOS & Android
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
                  <code className="text-green-400 font-mono text-sm">npm install @taxu/react-native</code>
                </div>
              </div>
            </section>

            <section id="setup" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Setup</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import { TaxuProvider } from '@taxu/react-native';

export default function App() {
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

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Usage</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import { View, Button, Text } from 'react-native';
import { useTaxCalculation } from '@taxu/react-native';

function TaxCalculator() {
  const { calculate, loading } = useTaxCalculation();

  const handleCalculate = async () => {
    const response = await calculate({
      income: 75000,
      filingStatus: 'single'
    });
    setResult(response);
  };

  return (
    <View>
      <Button
        title="Calculate Tax"
        onPress={handleCalculate}
        disabled={loading}
      />
      {result && (
        <Text>Tax Owed: ${result.totalTax}</Text>
      )}
    </View>
  );
}`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="examples" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Examples</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`// Example code for using the Taxu SDK in React Native`}
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

export default ReactNativeSDKPageClient
