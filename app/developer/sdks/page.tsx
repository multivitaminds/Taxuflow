"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Download, BookOpen, Terminal } from "lucide-react"
import Link from "next/link"

export default function SDKsPage() {
  const sdks = [
    {
      name: "Node.js",
      icon: "🟢",
      version: "v2.1.0",
      description: "Official Node.js SDK for server-side JavaScript and TypeScript applications",
      install: "npm install @taxu/node",
      docs: "/developer/sdks/nodejs",
      github: "https://github.com/taxu/taxu-node",
      popular: true,
    },
    {
      name: "Python",
      icon: "🐍",
      version: "v2.0.5",
      description: "Official Python SDK for Django, Flask, and FastAPI applications",
      install: "pip install taxu",
      docs: "/developer/sdks/python",
      github: "https://github.com/taxu/taxu-python",
      popular: true,
    },
    {
      name: "Ruby",
      icon: "💎",
      version: "v1.8.2",
      description: "Official Ruby SDK for Rails and Sinatra applications",
      install: "gem install taxu",
      docs: "/developer/sdks/ruby",
      github: "https://github.com/taxu/taxu-ruby",
      popular: false,
    },
    {
      name: "Go",
      icon: "🔵",
      version: "v1.5.0",
      description: "Official Go SDK for high-performance backend services",
      install: "go get github.com/taxu/taxu-go",
      docs: "/developer/sdks/go",
      github: "https://github.com/taxu/taxu-go",
      popular: true,
    },
    {
      name: "PHP",
      icon: "🐘",
      version: "v1.9.1",
      description: "Official PHP SDK for Laravel, Symfony, and WordPress",
      install: "composer require taxu/taxu-php",
      docs: "/developer/sdks/php",
      github: "https://github.com/taxu/taxu-php",
      popular: false,
    },
    {
      name: "Java",
      icon: "☕",
      version: "v1.7.3",
      description: "Official Java SDK for Spring Boot and enterprise applications",
      install: 'implementation "com.taxu:taxu-java:1.7.3"',
      docs: "/developer/sdks/java",
      github: "https://github.com/taxu/taxu-java",
      popular: false,
    },
    {
      name: ".NET",
      icon: "🔷",
      version: "v1.6.0",
      description: "Official .NET SDK for ASP.NET Core and C# applications",
      install: "dotnet add package Taxu.NET",
      docs: "/developer/sdks/dotnet",
      github: "https://github.com/taxu/taxu-dotnet",
      popular: false,
    },
    {
      name: "React",
      icon: "⚛️",
      version: "v2.3.0",
      description: "Official React SDK with hooks and components for frontend integration",
      install: "npm install @taxu/react",
      docs: "/developer/sdks/react",
      github: "https://github.com/taxu/taxu-react",
      popular: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">SDKs & Libraries</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Official SDKs for your favorite programming languages. Build faster with type-safe clients, automatic
            retries, and built-in error handling.
          </p>
        </div>

        {/* Popular SDKs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Popular SDKs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sdks
              .filter((sdk) => sdk.popular)
              .map((sdk) => (
                <Card key={sdk.name} className="bg-[#111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{sdk.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{sdk.name}</h3>
                        <span className="text-sm text-gray-500">{sdk.version}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#635BFF]/10 text-[#635BFF] text-xs rounded">Popular</span>
                  </div>

                  <p className="text-gray-400 mb-4">{sdk.description}</p>

                  <div className="bg-black/50 rounded p-3 mb-4 font-mono text-sm text-gray-300">{sdk.install}</div>

                  <div className="flex gap-3">
                    <Link href={sdk.docs}>
                      <Button className="flex-1 bg-[#635BFF] hover:bg-[#5046E5] text-white">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Documentation
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      <Code className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* All SDKs */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">All SDKs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks
              .filter((sdk) => !sdk.popular)
              .map((sdk) => (
                <Card key={sdk.name} className="bg-[#111] border-gray-800 p-6 hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{sdk.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{sdk.name}</h3>
                      <span className="text-xs text-gray-500">{sdk.version}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{sdk.description}</p>

                  <div className="bg-black/50 rounded p-2 mb-4 font-mono text-xs text-gray-300 overflow-x-auto">
                    {sdk.install}
                  </div>

                  <Link href={sdk.docs}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      View Docs
                    </Button>
                  </Link>
                </Card>
              ))}
          </div>
        </div>

        {/* CLI Tool */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-[#635BFF]/10 to-transparent border-[#635BFF]/20 p-8">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-[#635BFF]/10 rounded-lg">
                <Terminal className="w-8 h-8 text-[#635BFF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Taxu CLI</h3>
                <p className="text-gray-400 mb-4">
                  Command-line tool for managing API keys, testing webhooks, and deploying integrations directly from
                  your terminal.
                </p>
                <div className="bg-black/50 rounded p-4 mb-4 font-mono text-sm text-gray-300">
                  npm install -g @taxu/cli
                </div>
                <Link href="/developer/cli">
                  <Button className="bg-[#635BFF] hover:bg-[#5046E5] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Get Started with CLI
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
