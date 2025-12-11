"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Copy, Check, Terminal, Key, Code, Zap, BookOpen, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Simple code block component for syntax highlighting
function CodeBlock({ language, code }: { language: string; code: React.ReactNode }) {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    // Extract text content from React node children for copying
    const text = document.getElementById(`code-${language}`)?.innerText || ""
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700 bg-[#0a2540] my-4 shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1729] border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-medium text-slate-400 select-none ml-2">{language}</span>
        </div>
        <button onClick={onCopy} className="text-slate-400 hover:text-white transition-colors">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-5 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed" id={`code-${language}`}>
          {code}
        </pre>
      </div>
    </div>
  )
}

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        {/* Hero Header */}
        <div className="mb-16">
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="border-[#635bff]/30 bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20 px-3 py-1"
            >
              <Zap className="w-3 h-3 mr-1.5" />
              Quick Start
            </Badge>
            <Badge variant="outline" className="border-slate-300 bg-white text-slate-600 px-3 py-1">
              5 min setup
            </Badge>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-[#0a2540] tracking-tight">Get started with Taxu</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            Create an account and learn how to integrate tax filing, document processing, and compliance automation into
            your application.
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-[#635bff] mb-1">5 min</div>
            <div className="text-sm text-slate-600">Average integration time</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-[#635bff] mb-1">99.9%</div>
            <div className="text-sm text-slate-600">API uptime SLA</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-[#635bff] mb-1">24/7</div>
            <div className="text-sm text-slate-600">Developer support</div>
          </div>
        </div>

        {/* Create Account Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#635bff] text-white font-bold text-lg">
              1
            </div>
            <h2 className="text-3xl font-bold text-[#0a2540]">Create an account</h2>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Set up a Taxu account and immediately start building your integration. No credit card required for
              testing.
            </p>
            <p className="text-slate-600 mb-8">
              If you're ready to start developing, see our{" "}
              <Link
                href="/developer/quickstart"
                className="text-[#635bff] hover:text-[#5851df] font-semibold underline decoration-2 underline-offset-2"
              >
                Checkout quickstart
              </Link>{" "}
              or explore the{" "}
              <Link
                href="/developer/sandbox"
                className="text-[#635bff] hover:text-[#5851df] font-semibold underline decoration-2 underline-offset-2"
              >
                Sandbox environment
              </Link>
              .
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#635bff] hover:bg-[#5851df] text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Create free account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Developer Setup */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#635bff] text-white font-bold text-lg">
              2
            </div>
            <h2 className="text-3xl font-bold text-[#0a2540]">Developer setup</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group relative overflow-hidden border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#635bff]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#635bff]/10 transition-colors" />
              <div className="relative p-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[#635bff]/10 text-[#635bff] mb-4 group-hover:bg-[#635bff] group-hover:text-white transition-colors">
                  <Terminal className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Set up your development environment</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Get familiar with the Taxu CLI and our core SDKs for Node.js, Python, and Ruby.
                </p>
                <Link
                  href="/developer/cli"
                  className="inline-flex items-center gap-2 text-[#635bff] hover:text-[#5851df] font-semibold group/link"
                >
                  View documentation
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Card>
            <Card className="group relative overflow-hidden border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#635bff]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#635bff]/10 transition-colors" />
              <div className="relative p-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Key className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Get your API keys</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Get your API keys and learn about authentication, rate limits, and best practices.
                </p>
                <Link
                  href="/developer-portal/keys/create"
                  className="inline-flex items-center gap-2 text-[#635bff] hover:text-[#5851df] font-semibold group/link"
                >
                  Manage API keys
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Card>
            <Card className="group relative overflow-hidden border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#635bff]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#635bff]/10 transition-colors" />
              <div className="relative p-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-100 text-cyan-600 mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Terminal className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0a2540]">Try Taxu Shell</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Interactive browser-based shell with pre-configured CLI for testing APIs instantly.
                </p>
                <Link
                  href="/developer/shell"
                  className="inline-flex items-center gap-2 text-[#635bff] hover:text-[#5851df] font-semibold group/link"
                >
                  Open Shell
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Start Building */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#635bff] text-white font-bold text-lg">
              3
            </div>
            <h2 className="text-3xl font-bold text-[#0a2540]">Start building</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="group border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#0a2540]">Accept a payment</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Set up a payment integration for the web or iOS and Android apps.
              </p>
              <Link
                href="/developer/docs/api/documents"
                className="inline-flex items-center gap-1.5 text-sm text-[#635bff] hover:text-[#5851df] font-semibold group/link"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Card>
            <Card className="group border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-50 text-violet-600 mb-4 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#0a2540]">Checkout quickstart</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Create a Taxu-hosted checkout page with prebuilt components.
              </p>
              <Link
                href="/developer/sandbox"
                className="inline-flex items-center gap-1.5 text-sm text-[#635bff] hover:text-[#5851df] font-semibold group/link"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Card>
            <Card className="group border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#0a2540]">Subscriptions quickstart</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Build a subscriptions integration using Taxu Billing and Checkout.
              </p>
              <Link
                href="/developer/docs/api/accounting"
                className="inline-flex items-center gap-1.5 text-sm text-[#635bff] hover:text-[#5851df] font-semibold group/link"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#0a2540]">Build a marketplace or platform</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Use our platform models to accept payments on behalf of your users or build a multi-party marketplace.
              </p>
              <Link
                href="/developer/examples"
                className="inline-flex items-center gap-1.5 text-sm text-[#635bff] hover:text-[#5851df] font-semibold group/link"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Card>
            <Card className="group border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-pink-50 text-pink-600 mb-4 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#0a2540]">Use Taxu without writing code</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Accept payments with shareable links or by sending an invoice directly.
              </p>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-1.5 text-sm text-[#635bff] hover:text-[#5851df] font-semibold group/link"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Card>
            <Card className="group border-2 border-slate-200 bg-white hover:border-[#635bff] transition-all duration-300 hover:shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-50 text-cyan-600 mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#0a2540]">Explore all products</h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                Don't see your use case? Browse all of Taxu's tax and compliance products.
              </p>
              <Link
                href="/developer"
                className="inline-flex items-center gap-1.5 text-sm text-[#635bff] hover:text-[#5851df] font-semibold group/link"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Card>
          </div>
        </section>

        {/* Quick Start Code Example */}
        <section className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm">
          <div className="mb-8">
            <Badge variant="outline" className="border-[#635bff]/30 bg-[#635bff]/10 text-[#635bff] mb-4 px-3 py-1">
              <Code className="w-3 h-3 mr-1.5" />
              Code Example
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-[#0a2540]">Quick start code example</h2>
            <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
              Here's a simple example to process a W-2 document and calculate taxes. Copy and run this in your
              environment to test the API.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#0a2540] flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#68a063] flex items-center justify-center text-white text-xs">
                    N
                  </span>
                  Node.js
                </h3>
              </div>
              <CodeBlock
                language="Node.js"
                code={
                  <code className="text-[#e6edf3]">
                    <span className="text-[#8b949e]">// SDK coming soon - use REST API for now</span>
                    {"\n"}
                    <span className="text-[#8b949e]">// REST API Example</span>
                    {"\n"}
                    <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">response</span>{" "}
                    <span className="text-[#ff7b72]">= await</span> <span className="text-[#d2a8ff]">fetch</span>(
                    <span className="text-[#a5d6ff]">'https://api.taxu.io/v1/documents/upload'</span>, {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">method</span>: <span className="text-[#a5d6ff]">'POST'</span>,
                    {"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">headers</span>: {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">'Authorization'</span>:{" "}
                    <span className="text-[#a5d6ff]">'Bearer your_api_key'</span>,{"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">'Content-Type'</span>:{" "}
                    <span className="text-[#a5d6ff]">'application/json'</span>
                    {"\n"}
                    {"  "}
                    {"}"},{"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">body</span>: <span className="text-[#ff7b72]">JSON</span>.
                    <span className="text-[#d2a8ff]">stringify</span>({"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">file</span>: fileData,{"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">type</span>: <span className="text-[#a5d6ff]">'w2'</span>
                    {"\n"}
                    {"  "}
                    {"})"}
                    {"\n"}
                    {"}"});{"\n"}
                    {"\n"}
                    <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">uploadedFile</span>{" "}
                    <span className="text-[#ff7b72]">= await</span> response.
                    <span className="text-[#d2a8ff]">json</span>
                    ();{"\n"}
                    {"\n"}
                    <span className="text-[#8b949e]">// Get AI analysis results</span>
                    {"\n"}
                    <span className="text-[#ff7b72]">const</span>{" "}
                    <span className="text-[#d2a8ff]">analysisResponse</span>{" "}
                    <span className="text-[#ff7b72]">= await</span> <span className="text-[#d2a8ff]">fetch</span>(
                    <span className="text-[#a5d6ff]">{`\`https://api.taxu.io/v1/documents/\${uploadedFile.id}\``}</span>
                    , {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">headers</span>: {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">'Authorization'</span>:{" "}
                    <span className="text-[#a5d6ff]">'Bearer your_api_key'</span>
                    {"\n"}
                    {"  "}
                    {"}"}
                    {"\n"}
                    {"}"});{"\n"}
                    {"\n"}
                    <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">analysis</span>{" "}
                    <span className="text-[#ff7b72]">= await</span> analysisResponse.
                    <span className="text-[#d2a8ff]">json</span>();{"\n"}
                    <span className="text-[#d2a8ff]">console</span>.<span className="text-[#d2a8ff]">log</span>(
                    <span className="text-[#a5d6ff]">'Employer:'</span>, analysis.extracted_data.employer_name);{"\n"}
                    <span className="text-[#d2a8ff]">console</span>.<span className="text-[#d2a8ff]">log</span>(
                    <span className="text-[#a5d6ff]">'Wages:'</span>, analysis.extracted_data.wages);{"\n"}
                    {"\n"}
                    <span className="text-[#8b949e]">// Calculate tax refund</span>
                    {"\n"}
                    <span className="text-[#ff7b72]">const</span>{" "}
                    <span className="text-[#d2a8ff]">calculationResponse</span>{" "}
                    <span className="text-[#ff7b72]">= await</span> <span className="text-[#d2a8ff]">fetch</span>(
                    <span className="text-[#a5d6ff]">'https://api.taxu.io/v1/tax/calculate'</span>, {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">method</span>: <span className="text-[#a5d6ff]">'POST'</span>,
                    {"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">headers</span>: {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">'Authorization'</span>:{" "}
                    <span className="text-[#a5d6ff]">'Bearer your_api_key'</span>,{"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">'Content-Type'</span>:{" "}
                    <span className="text-[#a5d6ff]">'application/json'</span>
                    {"\n"}
                    {"  "}
                    {"}"},{"\n"}
                    {"  "}
                    <span className="text-[#79c0ff]">body</span>: <span className="text-[#ff7b72]">JSON</span>.
                    <span className="text-[#d2a8ff]">stringify</span>({"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">income</span>: analysis.extracted_data.wages,{"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">withheld</span>: analysis.extracted_data.federal_tax_withheld{"\n"}
                    {"  "}
                    {"})"}
                    {"\n"}
                    {"}"});{"\n"}
                    {"\n"}
                    <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">calculation</span>{" "}
                    <span className="text-[#ff7b72]">= await</span> calculationResponse.
                    <span className="text-[#d2a8ff]">json</span>();{"\n"}
                    <span className="text-[#d2a8ff]">console</span>.<span className="text-[#d2a8ff]">log</span>(
                    <span className="text-[#a5d6ff]">'Estimated Refund:'</span>, calculation.estimated_refund);
                  </code>
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#0a2540] flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#3776ab] flex items-center justify-center text-white text-xs">
                    Py
                  </span>
                  Python
                </h3>
              </div>
              <CodeBlock
                language="Python"
                code={
                  <code className="text-[#e6edf3]">
                    <span className="text-[#8b949e]"># SDK coming soon - use REST API for now</span>
                    {"\n"}
                    <span className="text-[#8b949e]"># REST API Example</span>
                    {"\n"}
                    <span className="text-[#ff7b72]">import</span> requests{"\n"}
                    {"\n"}
                    <span className="text-[#79c0ff]">API_KEY</span> ={" "}
                    <span className="text-[#a5d6ff]">'your_api_key'</span>
                    {"\n"}
                    <span className="text-[#79c0ff]">BASE_URL</span> ={" "}
                    <span className="text-[#a5d6ff]">'https://api.taxu.io/v1'</span>
                    {"\n"}
                    {"\n"}
                    <span className="text-[#8b949e]"># Upload and process a W-2 document</span>
                    {"\n"}
                    <span className="text-[#ff7b72]">with</span> <span className="text-[#d2a8ff]">open</span>(
                    <span className="text-[#a5d6ff]">'w2.pdf'</span>, <span className="text-[#a5d6ff]">'rb'</span>){" "}
                    <span className="text-[#ff7b72]">as</span> file:{"\n"}
                    {"    "}
                    <span className="text-[#d2a8ff]">response</span> = requests.post({"\n"}
                    {"        "}
                    <span className="text-[#a5d6ff]">f'{`{BASE_URL}`}/documents/upload'</span>,{"\n"}
                    {"        "}
                    <span className="text-[#79c0ff]">headers</span>={"{"}
                    <span className="text-[#a5d6ff]">'Authorization'</span>:{" "}
                    <span className="text-[#a5d6ff]">f'Bearer {`{API_KEY}`}'</span>
                    {"}"},{"\n"}
                    {"        "}
                    <span className="text-[#79c0ff]">files</span>={"{"}
                    <span className="text-[#a5d6ff]">'file'</span>: file{"}"},{"\n"}
                    {"        "}
                    <span className="text-[#79c0ff]">data</span>={"{"}
                    <span className="text-[#a5d6ff]">'type'</span>: <span className="text-[#a5d6ff]">'w2'</span>
                    {"}"}
                    {"\n"}
                    {"    "}){"\n"}
                    {"    "}
                    <span className="text-[#d2a8ff]">uploaded</span> = response.json(){"\n"}
                    {"\n"}
                    <span className="text-[#8b949e]"># Get AI analysis results</span>
                    {"\n"}
                    <span className="text-[#d2a8ff]">analysis_response</span> = requests.get({"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">
                      f'{`{BASE_URL}`}/documents/{`{uploaded["id"]}`}'
                    </span>
                    ,{"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">headers</span>={"{"}
                    <span className="text-[#a5d6ff]">'Authorization'</span>:{" "}
                    <span className="text-[#a5d6ff]">f'Bearer {`{API_KEY}`}'</span>
                    {"}"}
                    {"\n"}){"\n"}
                    <span className="text-[#d2a8ff]">analysis</span> = analysis_response.json(){"\n"}
                    <span className="text-[#d2a8ff]">print</span>(
                    <span className="text-[#a5d6ff]">
                      f'Employer: {`{analysis["extracted_data"]["employer_name"]}`}'
                    </span>
                    ){"\n"}
                    <span className="text-[#d2a8ff]">print</span>(
                    <span className="text-[#a5d6ff]">f'Wages: {`{analysis["extracted_data"]["wages"]}`}'</span>){"\n"}
                    {"\n"}
                    <span className="text-[#8b949e]"># Calculate tax refund</span>
                    {"\n"}
                    <span className="text-[#d2a8ff]">calculation_response</span> = requests.post({"\n"}
                    {"    "}
                    <span className="text-[#a5d6ff]">f'{`{BASE_URL}`}/tax/calculate'</span>,{"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">headers</span>={"{"}
                    <span className="text-[#a5d6ff]">'Authorization'</span>:{" "}
                    <span className="text-[#a5d6ff]">f'Bearer {`{API_KEY}`}'</span>
                    {"}"},{"\n"}
                    {"    "}
                    <span className="text-[#79c0ff]">json</span>={"{"}
                    {"\n"}
                    {"        "}
                    <span className="text-[#a5d6ff]">'income'</span>: analysis[
                    <span className="text-[#a5d6ff]">'extracted_data'</span>][
                    <span className="text-[#a5d6ff]">'wages'</span>],{"\n"}
                    {"        "}
                    <span className="text-[#a5d6ff]">'withheld'</span>: analysis[
                    <span className="text-[#a5d6ff]">'extracted_data'</span>][
                    <span className="text-[#a5d6ff]">'federal_tax_withheld'</span>]{"\n"}
                    {"    "}
                    {"}"}
                    {"\n"}){"\n"}
                    <span className="text-[#d2a8ff]">calculation</span> = calculation_response.json(){"\n"}
                    <span className="text-[#d2a8ff]">print</span>(
                    <span className="text-[#a5d6ff]">f'Estimated Refund: {`{calculation["estimated_refund"]}`}'</span>)
                  </code>
                }
              />
            </div>
          </div>
        </section>

        {/* Authentication Section */}
        <section className="mt-20">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3 text-[#0a2540]">Authentication</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  All API requests require authentication using your API key in the Authorization header:
                </p>
              </div>
            </div>
            <div className="bg-[#0a2540] rounded-lg p-4 mb-4 border border-slate-700">
              <code className="text-emerald-400 font-mono text-sm">Authorization: Bearer your_api_key_here</code>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Keep your API keys secure and never expose them in client-side code. Use environment variables and
              server-side requests only. Learn more about{" "}
              <Link
                href="/developer/docs/security"
                className="text-[#635bff] hover:text-[#5851df] font-semibold underline"
              >
                API security best practices
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-[#0a2540]">Next steps</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/developer/docs/api/accounting"
              className="group block bg-white border-2 border-slate-200 hover:border-[#635bff] rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#635bff]/10 text-[#635bff]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#635bff] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#0a2540]">Explore API reference</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dive deep into our API documentation with examples for every endpoint and data model.
              </p>
            </Link>
            <Link
              href="/developer/examples"
              className="group block bg-white border-2 border-slate-200 hover:border-[#635bff] rounded-xl p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                  <Code className="w-5 h-5" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#635bff] group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-[#0a2540]">View code examples</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Browse real-world integration examples and sample projects to accelerate your development.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
