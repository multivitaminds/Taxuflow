import Link from "next/link"
import { Code2, Book, Zap, Shield, Globe, Terminal } from "lucide-react"

export default function DeveloperPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Taxu <span className="text-blue-600">Developers</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/developer/docs" className="text-gray-600 hover:text-gray-900">
              Documentation
            </Link>
            <Link href="/developer/api-reference" className="text-gray-600 hover:text-gray-900">
              API Reference
            </Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get API Key
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            Build with Taxu API
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 text-balance">The Complete Tax & Accounting API</h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Integrate tax filing, document intelligence, and financial calculations into your application with our
            powerful REST API.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/developer/docs"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/developer/api-reference"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              View API Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Code2,
              title: "RESTful API",
              desc: "Simple, predictable REST endpoints with comprehensive documentation",
            },
            {
              icon: Shield,
              title: "Secure & Compliant",
              desc: "Bank-level encryption and SOC 2 Type II certified infrastructure",
            },
            {
              icon: Zap,
              title: "Real-time Processing",
              desc: "Process tax documents and calculations in milliseconds",
            },
            {
              icon: Book,
              title: "Complete Documentation",
              desc: "Detailed guides, code examples, and API references",
            },
            {
              icon: Terminal,
              title: "CLI & SDKs",
              desc: "Official libraries for Node.js, Python, Ruby, and more",
            },
            {
              icon: Globe,
              title: "Sandbox Environment",
              desc: "Test your integration with realistic data before going live",
            },
          ].map((feature) => (
            <div key={feature.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Start</h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
              <div className="text-gray-400"># Install the Taxu SDK</div>
              <div className="text-green-400">npm install @taxu/sdk</div>
              <br />
              <div className="text-gray-400"># Initialize the client</div>
              <div>
                <span className="text-purple-400">const</span> Taxu = <span className="text-purple-400">require</span>(
                <span className="text-yellow-300">'@taxu/sdk'</span>)
              </div>
              <div>
                <span className="text-purple-400">const</span> taxu = <span className="text-purple-400">new</span> Taxu(
                <span className="text-yellow-300">'your_api_key'</span>)
              </div>
              <br />
              <div className="text-gray-400"># File a tax return</div>
              <div>
                <span className="text-purple-400">const</span> filing = <span className="text-purple-400">await</span>{" "}
                taxu.taxReturns.create({"{"}
              </div>
              <div className="pl-4">
                year: <span className="text-yellow-300">2024</span>,
              </div>
              <div className="pl-4">
                type: <span className="text-yellow-300">'1040'</span>,
              </div>
              <div className="pl-4">
                taxpayer: {"{"} name: <span className="text-yellow-300">'John Doe'</span> {"}"}
              </div>
              <div>{"}"});</div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/developer/docs"
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2"
              >
                Read the full documentation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-xl text-blue-100 mb-8">Get your API key and start integrating Taxu today</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
