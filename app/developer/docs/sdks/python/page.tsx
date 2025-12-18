import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Copy, Terminal, Code2, CheckCircle2, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Python SDK - Taxu Developer Docs",
  description: "Official Python library for the Taxu API with async support and comprehensive type hints.",
}

export default function PythonSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-yellow-500 flex items-center justify-center p-2">
                <Image
                  src="/icons/python.png"
                  alt="Python"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Python SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Library</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/taxu/taxu-python"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
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
          {/* Sidebar Navigation */}
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
                href="#async"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Async Support
              </a>
              <a
                href="#examples"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Examples
              </a>
              <a
                href="#error-handling"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Error Handling
              </a>
              {/* New Section Marker */}
              <a
                href="#new-section"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                New Section
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            {/* Hero Section */}
            <section>
              <h1 className="text-4xl font-bold text-white mb-6">Python SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  The official Taxu Python library provides convenient access to the Taxu API with full async/await
                  support, type hints, and comprehensive documentation.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-yellow-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu Python SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu Python SDK is a modern Python library that brings enterprise-grade tax and compliance
                    capabilities to your Python applications. With native async/await support and full type hints, it
                    integrates seamlessly into FastAPI, Django, Flask, and other Python frameworks.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Perfect for data science teams, fintech startups, and enterprise applications, the Python SDK
                    handles tax calculations, form generation, e-filing, and compliance monitoring with a clean,
                    Pythonic API that feels natural to Python developers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ideal For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• FastAPI and Django applications</li>
                      <li>• Data science and ML platforms</li>
                      <li>• Financial automation tools</li>
                      <li>• High-concurrency web services</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Developer Benefits:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Full async/await support for performance</li>
                      <li>• Type hints for IDE autocomplete</li>
                      <li>• mypy compatible for type safety</li>
                      <li>• Works with popular Python frameworks</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              {/* Installation */}
              <section id="installation" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
                <p className="text-slate-300 mb-6">Install the package using pip:</p>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">pip</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <code className="text-green-400 font-mono text-sm">pip install taxu</code>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-200">
                    <strong>Requirements:</strong> Python 3.7 or higher
                  </p>
                </div>
              </section>

              {/* Authentication */}
              <section id="authentication" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>
                <p className="text-slate-300 mb-6">Initialize the client with your API key from your Taxu dashboard:</p>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">python</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                      {`import taxu

client = taxu.Client(api_key='your_api_key_here')`}
                    </pre>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-200">
                    <strong>Security:</strong> Use environment variables for API keys in production.
                  </p>
                </div>
              </section>

              {/* Basic Usage */}
              <section id="usage" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>
                <p className="text-slate-300 mb-6">File a Form 1099-NEC with the Python SDK:</p>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">python</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                      {`filing = client.tax.file_1099_nec(
    tax_year=2024,
    payer={
        'name': 'Acme Corp',
        'ein': '12-3456789',
        'address': '123 Business St'
    },
    recipient={
        'name': 'John Contractor',
        'ssn': '123-45-6789',
        'address': '456 Worker Ave'
    },
    non_employee_compensation=15000
)

print(filing.id)  # fil_1234567890`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Async Support */}
              <section id="async" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">Async Support</h2>
                <p className="text-slate-300 mb-6">The Python SDK supports async/await for non-blocking operations:</p>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">python</span>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6">
                    <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                      {
                        "async def main():\n    client = taxu.AsyncClient(api_key='your_api_key')\n    \n    calculation = await client.tax.calculate(\n        income=75000,\n        filing_status='single'\n    )\n    \n    print(f\"Tax owed: ${calculation.total_tax}\")\n\nasyncio.run(main())"
                      }
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                    <CheckCircle2 className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Non-Blocking I/O</h3>
                    <p className="text-sm text-slate-400">Perfect for high-concurrency applications and web servers</p>
                  </div>
                  <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
                    <CheckCircle2 className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Type Safety</h3>
                    <p className="text-sm text-slate-400">Full type hints support with mypy and modern IDEs</p>
                  </div>
                </div>
              </section>

              {/* More Examples */}
              <section id="examples" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">More Examples</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Calculate Federal Tax</h3>
                    <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                      <div className="p-6">
                        <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                          {
                            "result = taxu.Client(api_key='your_api_key').tax.calculate(\n    income=85000,\n    deductions=12000,\n    filing_status='single',\n    state='CA'\n)\n\nprint(f\"Federal tax: ${result.federal_tax}\")\nprint(f\"State tax: ${result.state_tax}\")\nprint(f\"Effective rate: {result.effective_rate}%\")"
                          }
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Upload Tax Document</h3>
                    <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                      <div className="p-6">
                        <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                          {`with open('w2.pdf', 'rb') as file:
    document = taxu.Client(api_key='your_api_key').documents.upload(
        file=file,
        type='w2',
        tax_year=2024
    )

print(f"Document ID: {document.id}")
print(f"Status: {document.status}")`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Error Handling */}
              <section id="error-handling" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">Error Handling</h2>
                <p className="text-slate-300 mb-6">Handle API errors gracefully with Python exceptions:</p>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="p-6">
                    <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                      {`from taxu.exceptions import (
    TaxuError,
    AuthenticationError,
    ValidationError,
    RateLimitError
)

try:
    filing = taxu.Client(api_key='your_api_key').tax.file_1099_nec(...)
except AuthenticationError:
    print("Invalid API key")
except ValidationError as e:
    print(f"Validation error: {e.message}")
except RateLimitError:
    print("Rate limit exceeded")
except TaxuError as e:
    print(f"API error: {e}")`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* Next Steps */}
              <section className="border-t border-white/10 pt-12">
                <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    href="/developer/docs/api/tax-filing"
                    className="p-6 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-900 transition-colors group"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      Tax Filing API
                    </h3>
                    <p className="text-sm text-slate-400">Learn about all available tax filing endpoints and options</p>
                  </Link>
                  <Link
                    href="/developer/api-explorer"
                    className="p-6 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-900 transition-colors group"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      API Explorer
                    </h3>
                    <p className="text-sm text-slate-400">Test API endpoints interactively in your browser</p>
                  </Link>
                </div>
              </section>

              {/* New Section */}
              <section id="new-section" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-white mb-6">New Section</h2>
                <p className="text-slate-300 mb-6">This is a new section added to the documentation:</p>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="p-6">
                    <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                      {`# New code snippet here\nprint("This is a new section")`}
                    </pre>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
