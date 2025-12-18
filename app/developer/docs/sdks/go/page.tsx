import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Copy, Terminal, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Go SDK - Taxu Developer Docs",
  description: "Official Go package for the Taxu API with full context support and concurrent safety.",
}

export default function GoSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center p-2">
                <Image src="/icons/go.png" alt="Go" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Go SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Package</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://pkg.go.dev/github.com/taxu/taxu-go"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                pkg.go.dev
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
            </div>
          </div>

          <div className="lg:col-span-3 space-y-16">
            <section>
              <h1 className="text-4xl font-bold text-white mb-6">Go SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  The official Taxu Go package provides idiomatic Go access to the Taxu API with context support,
                  goroutine safety, and comprehensive error handling.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu Go SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu Go SDK is a high-performance, goroutine-safe library designed for cloud-native
                    applications. Built with Go's concurrency patterns and context support, it enables developers to
                    build scalable tax and compliance systems with Go's speed and reliability.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Perfect for microservices, Kubernetes deployments, and high-throughput systems, the Go SDK provides
                    idiomatic Go interfaces with proper error handling, context propagation, and concurrent safety for
                    building production-grade financial and tax platforms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Perfect For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Cloud-native microservices</li>
                      <li>• High-performance financial systems</li>
                      <li>• Kubernetes and container deployments</li>
                      <li>• Concurrent processing pipelines</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Go Benefits:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Context support for cancellation</li>
                      <li>• Goroutine-safe concurrency</li>
                      <li>• Native error handling patterns</li>
                      <li>• Zero-dependency design</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                  v1.9.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                  Go 1.20+
                </div>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">terminal</span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">go get github.com/taxu/taxu-go</code>
                </div>
              </div>
            </section>

            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`package main

import (
    "github.com/taxu/taxu-go"
    "context"
)

func main() {
    client := taxu.NewClient("your_api_key_here")
}`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`filing, err := client.Tax.File1099NEC(context.Background(), &taxu.File1099NECParams{
    TaxYear: 2024,
    Payer: &taxu.Payer{
        Name:    "Acme Corp",
        EIN:     "12-3456789",
        Address: "123 Business St",
    },
    Recipient: &taxu.Recipient{
        Name:    "John Contractor",
        SSN:     "123-45-6789",
        Address: "456 Worker Ave",
    },
    NonEmployeeCompensation: 15000,
})

if err != nil {
    log.Fatal(err)
}

fmt.Println(filing.ID)  // fil_1234567890`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="examples" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">More Examples</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Calculate Tax with Context</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

result, err := client.Tax.Calculate(ctx, &taxu.CalculateParams{
    Income:       85000,
    Deductions:   12000,
    FilingStatus: "single",
    State:        "CA",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Federal tax: $%d\\n", result.FederalTax)
fmt.Printf("State tax: $%d\\n", result.StateTax)`}
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
