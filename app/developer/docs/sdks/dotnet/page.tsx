import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Copy, Terminal, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: ".NET SDK - Taxu Developer Docs",
  description: "Official .NET library for the Taxu API with NuGet package support and async/await.",
}

export default function DotNetSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center p-2">
                <Image
                  src="/icons/dotnet.png"
                  alt=".NET"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">.NET SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Package</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.nuget.org/packages/Taxu"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                NuGet
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
              <h1 className="text-4xl font-bold text-white mb-6">.NET SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  The official Taxu .NET library provides modern C# access to the Taxu API with async/await support and
                  full NuGet integration.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu .NET SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu .NET SDK is a modern C# library built for .NET 6+, ASP.NET Core, and Azure cloud
                    applications. With full async/await support and LINQ-friendly interfaces, it brings enterprise tax
                    compliance to the .NET ecosystem with the patterns and practices .NET developers expect.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Perfect for Azure-hosted applications, ASP.NET Core APIs, Blazor web apps, and desktop applications,
                    the .NET SDK provides strongly-typed models, comprehensive XML documentation, and seamless
                    integration with Microsoft's development ecosystem for building sophisticated tax and financial
                    platforms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Perfect For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• ASP.NET Core web applications</li>
                      <li>• Azure cloud services</li>
                      <li>• Blazor and desktop apps</li>
                      <li>• Enterprise .NET systems</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">.NET Features:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Full async/await support</li>
                      <li>• Strongly-typed models</li>
                      <li>• NuGet package manager</li>
                      <li>• LINQ query support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                  v3.0.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                  .NET 6.0+
                </div>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Package Manager Console</span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">Install-Package Taxu</code>
                </div>
              </div>
            </section>

            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`using Taxu;

var client = new TaxuClient("your_api_key_here");`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`var filing = await client.Tax.File1099NECAsync(new File1099NECParams
{
    TaxYear = 2024,
    Payer = new Payer
    {
        Name = "Acme Corp",
        EIN = "12-3456789",
        Address = "123 Business St"
    },
    Recipient = new Recipient
    {
        Name = "John Contractor",
        SSN = "123-45-6789",
        Address = "456 Worker Ave"
    },
    NonEmployeeCompensation = 15000
});

Console.WriteLine(filing.Id);  // fil_1234567890`}
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
                        {`var client = new TaxuClient("your_api_key_here");
var result = await client.Tax.CalculateAsync(new CalculateParams
{
    Income = 85000,
    Deductions = 12000,
    FilingStatus = "single",
    State = "CA"
});

Console.WriteLine($"Federal tax: \${result.FederalTax}");
Console.WriteLine($"State tax: \${result.StateTax}");`}
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
