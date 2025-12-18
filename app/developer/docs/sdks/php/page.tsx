import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Copy, Terminal, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "PHP SDK - Taxu Developer Docs",
  description: "Official PHP library for the Taxu API with PSR-7 compliance and Composer support.",
}

export default function PHPSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center p-2">
                <Image src="/icons/php.png" alt="PHP" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">PHP SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Library</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://packagist.org/packages/taxu/taxu-php"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Packagist
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
              <h1 className="text-4xl font-bold text-white mb-6">PHP SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  The official Taxu PHP library provides modern PHP access to the Taxu API with PSR-7 compliance and
                  full Composer support.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu PHP SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu PHP SDK is a modern, PSR-compliant library that brings enterprise tax compliance to PHP
                    applications. Compatible with PHP 8.0+ and following PHP-FIG standards, it integrates seamlessly
                    with Laravel, Symfony, WordPress, and custom PHP frameworks.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Built for the millions of PHP applications powering e-commerce, SaaS, and business platforms
                    worldwide, the PHP SDK provides a robust, well-tested solution for tax calculations, form
                    generation, and IRS e-filing with modern PHP features and best practices.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ideal For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Laravel and Symfony applications</li>
                      <li>• WordPress and WooCommerce sites</li>
                      <li>• E-commerce platforms</li>
                      <li>• Business management systems</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">PHP Standards:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• PSR-7 HTTP message compliance</li>
                      <li>• Composer package management</li>
                      <li>• PHP 8.0+ modern features</li>
                      <li>• Framework agnostic design</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                  v2.8.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                  PHP 8.0+
                </div>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
              <p className="text-slate-300 mb-6">Install via Composer:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">composer</span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">composer require taxu/taxu-php</code>
                </div>
              </div>
            </section>

            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`<?php

require_once 'vendor/autoload.php';

use Taxu\\TaxuClient;

$taxu = new TaxuClient('your_api_key_here');`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`$filing = $taxu->tax->file1099NEC([
    'tax_year' => 2024,
    'payer' => [
        'name' => 'Acme Corp',
        'ein' => '12-3456789',
        'address' => '123 Business St'
    ],
    'recipient' => [
        'name' => 'John Contractor',
        'ssn' => '123-45-6789',
        'address' => '456 Worker Ave'
    ],
    'non_employee_compensation' => 15000
]);

echo $filing->id;  // fil_1234567890`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="examples" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">More Examples</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Calculate Tax</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`$result = $taxu->tax->calculate([
    'income' => 85000,
    'deductions' => 12000,
    'filing_status' => 'single',
    'state' => 'CA'
]);

echo "Federal tax: $" . $result->federal_tax;
echo "State tax: $" . $result->state_tax;`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Upload Document</h3>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`$document = $taxu->documents->upload([
    'file' => fopen('w2.pdf', 'r'),
    'type' => 'w2',
    'tax_year' => 2024
]);

echo "Document ID: " . $document->id;`}
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
