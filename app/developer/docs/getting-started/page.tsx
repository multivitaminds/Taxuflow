"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { ArrowRight, Copy, Check } from "lucide-react"
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
    <div className="rounded-lg overflow-hidden border border-gray-800 bg-[#0d1117] my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-800">
        <span className="text-xs font-medium text-gray-400 select-none">{language}</span>
        <button onClick={onCopy} className="text-gray-400 hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed" id={`code-${language}`}>
          {code}
        </pre>
      </div>
    </div>
  )
}

export default function GettingStartedPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-6 text-gray-900">Get started</h1>
        <p className="text-xl text-gray-600 leading-relaxed">Create an account and learn how to build on Taxu.</p>
      </div>

      {/* Create an account */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Create an account</h2>
        <p className="text-gray-600 mb-6">Set up a Taxu account and immediately start building your integration.</p>
        <p className="text-gray-600 mb-6">
          If you're ready to start developing, see our{" "}
          <Link href="/developer/quickstart" className="text-[#635bff] hover:underline font-medium">
            Checkout quickstart
          </Link>
          .
        </p>
        <Link href="/login" className="inline-flex items-center gap-2 text-[#635bff] hover:underline font-bold text-lg">
          Create account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Developer setup */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Developer setup</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Set up your development environment</h3>
            <p className="text-gray-600 mb-4">Get familiar with the Taxu CLI and our core SDKs.</p>
            <Link href="/developer/cli" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Get your API keys</h3>
            <p className="text-gray-600 mb-4">Get your API keys and learn about authentication.</p>
            <Link href="/developer-portal/keys/create" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
        </div>
      </section>

      {/* Start building */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Start building</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Accept a payment</h3>
            <p className="text-gray-600 mb-4">Set up a payment integration for the web or iOS and Android apps.</p>
            <Link href="/developer/docs/api/documents" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Checkout quickstart</h3>
            <p className="text-gray-600 mb-4">Create a Taxu-hosted checkout page.</p>
            <Link href="/developer/sandbox" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Subscriptions quickstart</h3>
            <p className="text-gray-600 mb-4">
              Build a subscriptions integration using Taxu Billing, Checkout, and your test data.
            </p>
            <Link href="/developer/docs/api/accounting" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Build a marketplace or platform</h3>
            <p className="text-gray-600 mb-4">
              Use one of our platform models to accept payments on behalf of your users, or build a marketplace, or
              other business that manages payments for multiple parties.
            </p>
            <Link href="/developer/examples" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Use Taxu without writing code</h3>
            <p className="text-gray-600 mb-4">Accept payments with shareable links or sending an invoice.</p>
            <Link href="/get-started" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200 hover:border-[#635bff] transition-colors">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Explore all products</h3>
            <p className="text-gray-600 mb-4">Don't see your use case? Browse all of Taxu's products.</p>
            <Link href="/developer" className="text-[#635bff] hover:underline font-medium">
              Learn more →
            </Link>
          </Card>
        </div>
      </section>

      {/* Quick Start Code Example */}
      <section className="bg-gray-50 -mx-6 px-6 py-12 rounded-xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Quick start code example</h2>
        <p className="text-gray-600 mb-8">Here's a simple example to process a W-2 document and calculate taxes:</p>

        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Node.js</h3>
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
                  <span className="text-[#79c0ff]">method</span>: <span className="text-[#a5d6ff]">'POST'</span>,{"\n"}
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
                  <span className="text-[#ff7b72]">= await</span> response.<span className="text-[#d2a8ff]">json</span>
                  ();{"\n"}
                  {"\n"}
                  <span className="text-[#8b949e]">// Get AI analysis results</span>
                  {"\n"}
                  <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">analysisResponse</span>{" "}
                  <span className="text-[#ff7b72]">= await</span> <span className="text-[#d2a8ff]">fetch</span>(
                  <span className="text-[#a5d6ff]">{`\`https://api.taxu.io/v1/documents/\${uploadedFile.id}\``}</span>,{" "}
                  {"{"}
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
                  <span className="text-[#79c0ff]">method</span>: <span className="text-[#a5d6ff]">'POST'</span>,{"\n"}
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
            <h3 className="font-bold text-gray-900 mb-3">Python</h3>
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
                  <span className="text-[#a5d6ff]">f'Employer: {`{analysis["extracted_data"]["employer_name"]}`}'</span>
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

      {/* Authentication */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Authentication</h2>
        <p className="text-gray-600 mb-6">
          All API requests require authentication using your API key in the Authorization header:
        </p>
        <pre className="bg-[#0d1117] p-4 rounded-lg overflow-x-auto text-sm mb-4 border border-gray-800">
          <code className="text-white font-mono">Authorization: Bearer your_api_key_here</code>
        </pre>
        <p className="text-sm text-gray-600">
          Keep your API keys secure and never share them publicly. Use environment variables in production.
        </p>
      </section>

      {/* More resources */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">More resources</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Browse sample projects</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Use one of our sample projects to get started integrating Taxu.
            </p>
            <Link href="/developer/examples" className="text-[#635bff] hover:underline font-medium text-sm">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Test your integration</h3>
            <p className="text-gray-600 mb-4 text-sm">Test your integration before you go live with Taxu.</p>
            <Link href="/developer/sandbox" className="text-[#635bff] hover:underline font-medium text-sm">
              Learn more →
            </Link>
          </Card>
          <Card className="p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold mb-3 text-gray-900">Build on Taxu with LLMs</h3>
            <p className="text-gray-600 mb-4 text-sm">Use LLMs in your Taxu integration workflow.</p>
            <Link href="/developer/docs/api/ai-agents" className="text-[#635bff] hover:underline font-medium text-sm">
              Learn more →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  )
}
