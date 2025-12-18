import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Copy, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Java SDK - Taxu Developer Docs",
  description: "Official Java library for the Taxu API with Maven and Gradle support.",
}

export default function JavaSDKPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-2">
                <Image
                  src="/icons/java.png"
                  alt="Java"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Java SDK</div>
                <div className="text-xs text-slate-400">Official Taxu Library</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://mvnrepository.com/artifact/io.taxu/taxu-java"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Maven Central
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
              <h1 className="text-4xl font-bold text-white mb-6">Java SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  The official Taxu Java library provides enterprise-grade access to the Taxu API with Maven/Gradle
                  support and full thread safety.
                </p>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu Java SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu Java SDK is an enterprise-grade library built for Java applications requiring robust tax
                    compliance and financial operations. With full support for Maven and Gradle, it integrates
                    seamlessly into Spring Boot, Jakarta EE, and legacy Java enterprise applications.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Designed for Fortune 500 companies and large-scale financial systems, the Java SDK provides
                    thread-safe operations, comprehensive error handling, and enterprise patterns that Java developers
                    expect. It handles tax calculations, IRS e-filing, and compliance monitoring with the reliability
                    and performance enterprise Java applications demand.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ideal For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Spring Boot applications</li>
                      <li>• Jakarta EE enterprise systems</li>
                      <li>• Banking and financial platforms</li>
                      <li>• Legacy Java application modernization</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Enterprise Features:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Thread-safe concurrent operations</li>
                      <li>• Builder pattern for configurations</li>
                      <li>• Maven Central repository</li>
                      <li>• Comprehensive error handling</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* </CHANGE> */}

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
                  v2.3.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  Java 11+
                </div>
              </div>
            </section>

            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>
              <p className="text-slate-300 mb-6">Add to your Maven pom.xml:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden mb-6">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <span className="text-sm text-slate-400">pom.xml</span>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`<dependency>
    <groupId>io.taxu</groupId>
    <artifactId>taxu-java</artifactId>
    <version>2.3.0</version>
</dependency>`}
                  </pre>
                </div>
              </div>

              <p className="text-slate-300 mb-4">Or Gradle:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                  <span className="text-sm text-slate-400">build.gradle</span>
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
                <div className="p-4">
                  <code className="text-green-400 font-mono text-sm">implementation 'io.taxu:taxu-java:2.3.0'</code>
                </div>
              </div>
            </section>

            <section id="authentication" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Authentication</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import io.taxu.TaxuClient;

TaxuClient client = new TaxuClient("your_api_key_here");`}
                  </pre>
                </div>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Basic Usage</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`Filing filing = client.tax().file1099NEC(
    File1099NECParams.builder()
        .taxYear(2024)
        .payer(Payer.builder()
            .name("Acme Corp")
            .ein("12-3456789")
            .address("123 Business St")
            .build())
        .recipient(Recipient.builder()
            .name("John Contractor")
            .ssn("123-45-6789")
            .address("456 Worker Ave")
            .build())
        .nonEmployeeCompensation(15000)
        .build()
);

System.out.println(filing.getId());  // fil_1234567890`}
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
                        {`TaxCalculation result = client.tax().calculate(
    CalculateParams.builder()
        .income(85000)
        .deductions(12000)
        .filingStatus("single")
        .state("CA")
        .build()
);

System.out.println("Federal tax: $" + result.getFederalTax());
System.out.println("State tax: $" + result.getStateTax());`}
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
