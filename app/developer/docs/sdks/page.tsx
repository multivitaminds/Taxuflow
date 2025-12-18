import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Package, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "SDKs - Taxu Developer Docs",
  description: "Client and server libraries for your favorite programming languages.",
}

const serverSdks = [
  {
    name: "Node.js",
    icon: (
      <Image src="/icons/nodejs.png" alt="Node.js" width={48} height={48} className="w-full h-full object-contain" />
    ),
    color: "from-green-500 to-green-600",
    install: "npm install taxu",
    docs: "/developer/docs/sdks/nodejs",
    popular: true,
  },
  {
    name: "Python",
    icon: (
      <Image src="/icons/python.png" alt="Python" width={48} height={48} className="w-full h-full object-contain" />
    ),
    color: "from-blue-500 to-blue-600",
    install: "pip install taxu",
    docs: "/developer/docs/sdks/python",
    popular: true,
  },
  {
    name: "Ruby",
    icon: <Image src="/icons/ruby.png" alt="Ruby" width={48} height={48} className="w-full h-full object-contain" />,
    color: "from-red-500 to-red-600",
    install: "gem install taxu",
    docs: "/developer/docs/sdks/ruby",
    popular: false,
  },
  {
    name: "PHP",
    icon: <Image src="/icons/php.png" alt="PHP" width={48} height={48} className="w-full h-full object-contain" />,
    color: "from-purple-500 to-purple-600",
    install: "composer require taxu/taxu-php",
    docs: "/developer/docs/sdks/php",
    popular: false,
  },
  {
    name: "Go",
    icon: <Image src="/icons/go.png" alt="Go" width={48} height={48} className="w-full h-full object-contain" />,
    color: "from-cyan-500 to-cyan-600",
    install: "go get github.com/taxu/taxu-go",
    docs: "/developer/docs/sdks/go",
    popular: true,
  },
  {
    name: "Java",
    icon: <Image src="/icons/java.png" alt="Java" width={48} height={48} className="w-full h-full object-contain" />,
    color: "from-orange-500 to-orange-600",
    install: 'implementation "com.taxu:taxu-java:1.0.0"',
    docs: "/developer/docs/sdks/java",
    popular: false,
  },
  {
    name: ".NET",
    icon: <Image src="/icons/dotnet.png" alt=".NET" width={48} height={48} className="w-full h-full object-contain" />,
    color: "from-indigo-500 to-indigo-600",
    install: "dotnet add package Taxu.net",
    docs: "/developer/docs/sdks/dotnet",
    popular: false,
  },
]

const clientSdks = [
  {
    name: "React",
    icon: "⚛️",
    color: "from-blue-400 to-cyan-400",
    install: "npm install @taxu/react",
    docs: "/developer/docs/sdks/react",
    description: "React hooks and components",
  },
  {
    name: "JavaScript",
    icon: "📜",
    color: "from-yellow-500 to-yellow-600",
    install: "npm install @taxu/js",
    docs: "/developer/docs/sdks/javascript",
    description: "Vanilla JavaScript SDK",
  },
  {
    name: "React Native",
    icon: "📱",
    color: "from-blue-500 to-purple-500",
    install: "npm install @taxu/react-native",
    docs: "/developer/docs/sdks/react-native",
    description: "Mobile SDK for iOS and Android",
  },
]

export default function SDKsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Taxu SDKs</div>
                <div className="text-xs text-slate-400">Client & Server Libraries</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">SDKs</h1>
          <p className="text-lg text-slate-300 max-w-3xl">
            Client and server libraries for your favorite programming languages. Install via your package manager and
            start building with Taxu's APIs in minutes.
          </p>
        </div>

        {/* Server-side SDKs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Server-side SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serverSdks.map((sdk) => (
              <Link key={sdk.name} href={sdk.docs} className="group relative">
                <div className="h-full p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-white/20 transition-all">
                  {sdk.popular && (
                    <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-blue-600 text-xs text-white font-medium">
                      Popular
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sdk.color} flex items-center justify-center text-2xl`}
                    >
                      {sdk.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {sdk.name}
                  </h3>
                  <div className="p-3 rounded-lg bg-slate-950/50 border border-white/10 mb-4">
                    <code className="text-xs text-green-400 font-mono break-all">{sdk.install}</code>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    View documentation
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Client-side SDKs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Client-side SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientSdks.map((sdk) => (
              <Link key={sdk.name} href={sdk.docs} className="group">
                <div className="h-full p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-white/20 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${sdk.color} flex items-center justify-center text-2xl`}
                    >
                      {sdk.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {sdk.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{sdk.description}</p>
                  <div className="p-3 rounded-lg bg-slate-950/50 border border-white/10 mb-4">
                    <code className="text-xs text-green-400 font-mono break-all">{sdk.install}</code>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-400">
                    View documentation
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">What's included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Type safety</h3>
              <p className="text-sm text-slate-400">
                Full TypeScript support with comprehensive type definitions for all APIs
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Automatic retries</h3>
              <p className="text-sm text-slate-400">Built-in retry logic for transient failures and network issues</p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Webhook verification</h3>
              <p className="text-sm text-slate-400">Cryptographic signature verification for secure webhook handling</p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50">
              <CheckCircle2 className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Idempotency</h3>
              <p className="text-sm text-slate-400">Automatic idempotency key generation for safe request retries</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to start building?</h3>
          <p className="text-slate-300 mb-6">
            Install your preferred SDK and start integrating Taxu into your application today.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/developer/api-explorer"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors inline-flex items-center gap-2"
            >
              Try API Explorer
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/developer/docs/api/overview"
              className="px-6 py-3 rounded-lg border border-white/20 hover:border-white/40 text-white font-medium transition-all"
            >
              View API docs
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
