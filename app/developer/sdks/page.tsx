"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Download, BookOpen, ArrowRight, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SDKsPage() {
  const sdks = [
    {
      name: "Node.js",
      icon: (
        <Image src="/icons/nodejs.png" alt="Node.js" width={40} height={40} className="w-full h-full object-contain" />
      ),
      version: "v2.1.0",
      description: "Official Node.js SDK for server-side JavaScript and TypeScript applications",
      install: "npm install @taxu/node",
      docs: "/developer/sdks/nodejs",
      github: "https://github.com/taxu/taxu-node",
      popular: true,
    },
    {
      name: "Python",
      icon: (
        <Image src="/icons/python.png" alt="Python" width={40} height={40} className="w-full h-full object-contain" />
      ),
      version: "v2.0.5",
      description: "Official Python SDK for Django, Flask, and FastAPI applications",
      install: "pip install taxu",
      docs: "/developer/sdks/python",
      github: "https://github.com/taxu/taxu-python",
      popular: true,
    },
    {
      name: "Ruby",
      icon: <Image src="/icons/ruby.png" alt="Ruby" width={40} height={40} className="w-full h-full object-contain" />,
      version: "v1.8.2",
      description: "Official Ruby SDK for Rails and Sinatra applications",
      install: "gem install taxu",
      docs: "/developer/sdks/ruby",
      github: "https://github.com/taxu/taxu-ruby",
      popular: false,
    },
    {
      name: "Go",
      icon: <Image src="/icons/go.png" alt="Go" width={40} height={40} className="w-full h-full object-contain" />,
      version: "v1.5.0",
      description: "Official Go SDK for high-performance backend services",
      install: "go get github.com/taxu/taxu-go",
      docs: "/developer/sdks/go",
      github: "https://github.com/taxu/taxu-go",
      popular: true,
    },
    {
      name: "PHP",
      icon: <Image src="/icons/php.png" alt="PHP" width={40} height={40} className="w-full h-full object-contain" />,
      version: "v1.9.1",
      description: "Official PHP SDK for Laravel, Symfony, and WordPress",
      install: "composer require taxu/taxu-php",
      docs: "/developer/sdks/php",
      github: "https://github.com/taxu/taxu-php",
      popular: false,
    },
    {
      name: "Java",
      icon: <Image src="/icons/java.png" alt="Java" width={40} height={40} className="w-full h-full object-contain" />,
      version: "v1.7.3",
      description: "Official Java SDK for Spring Boot and enterprise applications",
      install: 'implementation "com.taxu:taxu-java:1.7.3"',
      docs: "/developer/sdks/java",
      github: "https://github.com/taxu/taxu-java",
      popular: false,
    },
    {
      name: ".NET",
      icon: (
        <svg viewBox="0 0 256 289" className="w-full h-full" fill="none">
          <path
            d="M255.569 84.452c-.002-4.83-1.035-9.098-3.124-12.76-2.052-3.603-5.125-6.622-9.247-9.009-34.025-19.619-68.083-39.178-102.097-58.817-9.17-5.294-18.061-5.1-27.163.27C100.395 12.39 86.59 20.938 72.83 29.555 48.23 43.94 23.694 58.446-.713 72.843c-5.294 3.12-8.954 7.594-10.706 13.372-1.55 5.11-1.566 10.41.003 15.557 10.582 13.268 44.137 26.074 88.263 52.17 132.432 78.186 6.85 4.036 14.028 4.802 21.334 1.712 6.14-2.597 10.512-7.017 13.118-13.075.443-1.032.695-2.146 1.028-3.224.01 8.946.005 17.893.01 26.84 0 6.834 5.553 12.388 12.387 12.388h75.915c6.834 0 12.387-5.554 12.387-12.388v-75.915c0-6.834-5.553-12.387-12.387-12.387h-39.888v-7.766zm-20.194 20.194v39.597h-39.597v-39.597h39.597z"
            fill="#68217A"
          />
          <circle cx="128.456" cy="143.705" r="39.597" fill="#68217A" />
          <path
            d="M23.809 226.447c3.304 0 5.976-2.672 5.976-5.976s-2.672-5.976-5.976-5.976-5.976 2.672-5.976 5.976 2.672 5.976 5.976 5.976z"
            fill="#68217A"
          />
        </svg>
      ),
      version: "v1.6.0",
      description: "Official .NET SDK for ASP.NET Core and C# applications",
      install: "dotnet add package Taxu.NET",
      docs: "/developer/sdks/dotnet",
      github: "https://github.com/taxu/taxu-dotnet",
      popular: false,
    },
    {
      name: "React",
      icon: (
        <Image src="/icons/react.png" alt="React" width={40} height={40} className="w-full h-full object-contain" />
      ),
      version: "v2.3.0",
      description: "Official React SDK with hooks and components for frontend integration",
      install: "npm install @taxu/react",
      docs: "/developer/sdks/react",
      github: "https://github.com/taxu/taxu-react",
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Updated hero section to use Stripe gradient and new styling */}
      <section className="gradient-stripe-hero text-white pt-44 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6 backdrop-blur-sm">
              <Package className="w-4 h-4" />
              <span>Official Client Libraries</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">SDKs & Libraries</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Integrate Taxu into your application in minutes with our official, type-safe libraries for your favorite
              languages and frameworks.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-10">
        {/* Popular SDKs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Libraries</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sdks
              .filter((sdk) => sdk.popular)
              .map((sdk) => (
                <Card
                  key={sdk.name}
                  className="bg-white border-slate-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm flex items-center justify-center">
                        {sdk.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{sdk.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-500 font-mono">{sdk.version}</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-6 leading-relaxed">{sdk.description}</p>

                  <div className="bg-slate-900 rounded-lg p-4 mb-6 font-mono text-sm text-slate-300 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
                    <span>{sdk.install}</span>
                    <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex gap-3">
                    <Link href={sdk.docs} className="flex-1">
                      <Button className="w-full bg-[#635BFF] hover:bg-[#5046E5] text-white shadow-sm group">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Docs
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 bg-transparent"
                      asChild
                    >
                      <a href={sdk.github} target="_blank" rel="noopener noreferrer">
                        <Code className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* All SDKs */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">All Supported Platforms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdks
              .filter((sdk) => !sdk.popular)
              .map((sdk) => (
                <Card
                  key={sdk.name}
                  className="bg-white border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 p-2 bg-slate-50 rounded-lg border border-slate-100 shadow-sm flex items-center justify-center">
                      {sdk.icon}
                    </div>
                    <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded-full">
                      {sdk.version}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 leading-relaxed h-10">{sdk.description}</p>

                  <div className="bg-slate-50 border border-slate-100 rounded p-2 mb-4 font-mono text-xs text-slate-600 overflow-x-auto whitespace-nowrap">
                    {sdk.install}
                  </div>

                  <Link href={sdk.docs}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-[#635BFF] hover:text-[#5046E5] hover:bg-[#635BFF]/5 p-0 h-auto font-medium"
                    >
                      Documentation
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </Card>
              ))}
          </div>
        </div>

        {/* CLI Tool */}
        <div className="mt-20">
          <div className="relative overflow-hidden rounded-2xl bg-[#0a2540] text-white shadow-2xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#00D4FF]/20 to-transparent opacity-50" />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#635BFF] text-white text-xs font-bold uppercase tracking-wider mb-6">
                  Developer Tools
                </div>
                <h3 className="text-3xl font-bold mb-4">Taxu CLI</h3>
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                  Manage API keys, listen to webhooks, and debug your integration directly from your terminal. The
                  fastest way to build with Taxu.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/developer/cli">
                    <Button className="bg-[#00D4FF] text-[#0a2540] hover:bg-[#00D4FF]/90 font-semibold px-6">
                      <Download className="w-4 h-4 mr-2" />
                      Install CLI
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:text-white hover:bg-white/10 bg-transparent"
                  >
                    View Commands
                  </Button>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <div className="bg-[#1a1f36] rounded-lg shadow-2xl border border-slate-700/50 p-4 font-mono text-sm text-slate-300 w-full max-w-md">
                  <div className="flex gap-2 mb-4 border-b border-slate-700/50 pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="text-[#00D4FF]">$</span> npm install -g @taxu/cli
                    </p>
                    <p className="text-slate-500">Installed version 1.2.0</p>
                    <p>
                      <span className="text-[#00D4FF]">$</span> taxu login
                    </p>
                    <p className="text-green-400">✓ Authenticated as user@example.com</p>
                    <p>
                      <span className="text-[#00D4FF]">$</span> taxu listen --forward-to localhost:3000
                    </p>
                    <p className="animate-pulse">Ready to receive webhooks...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
