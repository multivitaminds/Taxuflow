"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Download, BookOpen, Zap } from "lucide-react"
import Link from "next/link"

export default function PHPSDKPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#777BB3]/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-[#777BB3]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">PHP SDK</h1>
              <p className="text-gray-400 mt-1">Official Taxu PHP library</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#635BFF] hover:bg-[#0A2540] text-white">
              <Download className="w-4 h-4 mr-2" />
              Install via Composer
            </Button>
            <Button variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-900 bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Installation</h2>
          <Card className="bg-[#111111] border-gray-800 p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Composer (Recommended)</p>
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">composer require taxu/taxu-php</code>
                </pre>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Manual Installation</p>
                <pre className="bg-black p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-gray-300">{`git clone https://github.com/taxu/taxu-php.git
cd taxu-php
composer install`}</code>
                </pre>
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
          <Card className="bg-[#111111] border-gray-800 p-6">
            <pre className="bg-black p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-gray-300">{`<?php
require_once('vendor/autoload.php');

// Initialize client
$taxu = new \\Taxu\\TaxuClient([
    'api_key' => 'your_api_key_here'
]);

// Upload and process W-2
$client->documents->upload([
    'file' => fopen('w2.pdf', 'r'),
    'type' => 'w2'
]);

// Calculate refund
$client->tax->calculateRefund([
    'income' => 75000,
    'filing_status' => 'single',
    'state' => 'CA'
]);`}</code>
            </pre>
          </Card>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: "PSR-7 Compatible", desc: "Works with any PSR-7 HTTP client" },
              { icon: Code, title: "Type Hints", desc: "Full PHP 7.4+ type declarations" },
              { icon: BookOpen, title: "Laravel Support", desc: "First-class Laravel integration" },
              { icon: Download, title: "Composer Ready", desc: "Easy installation via Composer" },
            ].map((feature, i) => (
              <Card key={i} className="bg-[#111111] border-gray-800 p-6">
                <feature.icon className="w-8 h-8 text-[#635BFF] mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">API Reference</h2>
          <div className="space-y-4">
            <Card className="bg-[#111111] border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Document Upload</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm text-gray-300">{`$client->documents->upload([
    'file' => fopen('document.pdf', 'r'),
    'type' => 'w2'
]);`}</code>
              </pre>
            </Card>

            <Card className="bg-[#111111] border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Tax Calculation</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm text-gray-300">{`$client->tax->calculateRefund([
    'income' => 75000,
    'filing_status' => 'single'
]);`}</code>
              </pre>
            </Card>

            <Card className="bg-[#111111] border-gray-800 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Webhook Verification</h3>
              <pre className="bg-black p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm text-gray-300">{`$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_TAXU_SIGNATURE'];

$client->webhooks->verify($payload, $signature);`}</code>
              </pre>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/developer/docs/api/documents">
              <Card className="bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
                <p className="text-gray-400 text-sm">Explore all available endpoints</p>
              </Card>
            </Link>
            <Link href="/developer/examples">
              <Card className="bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Code Examples</h3>
                <p className="text-gray-400 text-sm">See real-world implementations</p>
              </Card>
            </Link>
            <Link href="/developer/support">
              <Card className="bg-[#111111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-2">Get Help</h3>
                <p className="text-gray-400 text-sm">Contact our support team</p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
