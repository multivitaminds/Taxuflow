"use client"

import { Card } from "@/components/ui/card"
import { Terminal, Download, BookOpen, Zap } from "lucide-react"

export default function CLIPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[#635BFF]/10 rounded-lg">
              <Terminal className="w-8 h-8 text-[#635BFF]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Taxu CLI</h1>
              <p className="text-gray-500">v1.5.0</p>
            </div>
          </div>
          <p className="text-xl text-gray-400">
            Command-line tool for managing API keys, testing webhooks, and deploying integrations
          </p>
        </div>

        {/* Installation */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Installation</h2>
          <div className="bg-black/50 rounded p-4 mb-4 font-mono text-sm text-gray-300">npm install -g @taxu/cli</div>
          <p className="text-gray-400 text-sm">
            Or use npx to run without installing: <code className="text-[#635BFF]">npx @taxu/cli</code>
          </p>
        </Card>

        {/* Quick Start */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Login</h3>
              <div className="bg-black/50 rounded p-4 font-mono text-sm text-gray-300">taxu login</div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Create API Key</h3>
              <div className="bg-black/50 rounded p-4 font-mono text-sm text-gray-300">
                taxu keys create --name "Production Key"
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Test Webhook</h3>
              <div className="bg-black/50 rounded p-4 font-mono text-sm text-gray-300">
                taxu webhooks test --event document.processed
              </div>
            </div>
          </div>
        </Card>

        {/* Commands */}
        <Card className="bg-[#111] border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Commands</h2>
          <div className="space-y-6">
            {/* Auth Commands */}
            <div>
              <h3 className="text-lg font-semibold text-[#635BFF] mb-3">Authentication</h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu login</code>
                  <p className="text-sm text-gray-400 mt-1">Login to your Taxu account</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu logout</code>
                  <p className="text-sm text-gray-400 mt-1">Logout from your account</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu whoami</code>
                  <p className="text-sm text-gray-400 mt-1">Display current user</p>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div>
              <h3 className="text-lg font-semibold text-[#635BFF] mb-3">API Keys</h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu keys list</code>
                  <p className="text-sm text-gray-400 mt-1">List all API keys</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu keys create --name "Key Name"</code>
                  <p className="text-sm text-gray-400 mt-1">Create a new API key</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu keys revoke [key-id]</code>
                  <p className="text-sm text-gray-400 mt-1">Revoke an API key</p>
                </div>
              </div>
            </div>

            {/* Webhooks */}
            <div>
              <h3 className="text-lg font-semibold text-[#635BFF] mb-3">Webhooks</h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu webhooks list</code>
                  <p className="text-sm text-gray-400 mt-1">List all webhook endpoints</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu webhooks create --url [url]</code>
                  <p className="text-sm text-gray-400 mt-1">Create a webhook endpoint</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu webhooks test --event [event-type]</code>
                  <p className="text-sm text-gray-400 mt-1">Send a test webhook event</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu webhooks listen</code>
                  <p className="text-sm text-gray-400 mt-1">Listen for webhook events locally</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-[#635BFF] mb-3">Documents</h3>
              <div className="space-y-3">
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu documents upload [file]</code>
                  <p className="text-sm text-gray-400 mt-1">Upload a document</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu documents list</code>
                  <p className="text-sm text-gray-400 mt-1">List all documents</p>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <code className="text-white">taxu documents get [id]</code>
                  <p className="text-sm text-gray-400 mt-1">Get document details</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="bg-[#111] border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex gap-3 p-4 bg-black/30 rounded">
              <Zap className="w-5 h-5 text-[#635BFF] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Fast & Lightweight</h3>
                <p className="text-sm text-gray-400">Optimized for speed with minimal dependencies</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-black/30 rounded">
              <Terminal className="w-5 h-5 text-[#635BFF] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Interactive Mode</h3>
                <p className="text-sm text-gray-400">Guided prompts for complex operations</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-black/30 rounded">
              <BookOpen className="w-5 h-5 text-[#635BFF] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Built-in Help</h3>
                <p className="text-sm text-gray-400">Comprehensive help for every command</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-black/30 rounded">
              <Download className="w-5 h-5 text-[#635BFF] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Auto-updates</h3>
                <p className="text-sm text-gray-400">Always stay on the latest version</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
