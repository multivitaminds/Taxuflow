export default function ServerSideSDKsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="text-sm text-slate-400 mb-4">
            <a href="/developer" className="hover:text-blue-400 transition-colors">
              Developer resources
            </a>
            <span className="mx-2">/</span>
            <a href="/developer/docs/sdks" className="hover:text-blue-400 transition-colors">
              SDKs
            </a>
            <span className="mx-2">/</span>
            <span className="text-slate-300">Server-side SDKs</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Server-side SDKs</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Official Taxu libraries for server-side integration across all major programming languages.
          </p>
        </div>

        {/* SDK Grid */}
        <div className="grid gap-6">
          {/* Node.js SDK */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Node.js</h3>
                <p className="text-slate-400">Official Taxu SDK for Node.js applications</p>
              </div>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/20">
                Recommended
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Installation</h4>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-slate-400"># npm</div>
                  <div className="text-blue-400">npm install taxu</div>
                  <div className="text-slate-400 mt-2"># yarn</div>
                  <div className="text-blue-400">yarn add taxu</div>
                  <div className="text-slate-400 mt-2"># pnpm</div>
                  <div className="text-blue-400">pnpm add taxu</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Quick Start</h4>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-purple-400">const</div> <span className="text-blue-300">Taxu</span> ={" "}
                  <span className="text-purple-400">require</span>(<span className="text-green-400">'taxu'</span>);
                  <br />
                  <br />
                  <div className="text-purple-400">const</div> <span className="text-blue-300">taxu</span> ={" "}
                  <span className="text-purple-400">new</span> <span className="text-blue-300">Taxu</span>(
                  <span className="text-green-400">process.env.TAXU_API_KEY</span>);
                  <br />
                  <br />
                  <div className="text-slate-400">// File a tax return</div>
                  <div className="text-purple-400">const</div> <span className="text-blue-300">taxReturn</span> ={" "}
                  <span className="text-purple-400">await</span> taxu.taxFiling.returns.create({"{"}
                  <br />
                  {"  "}taxYear: <span className="text-orange-400">2024</span>,
                  <br />
                  {"  "}taxpayerId: <span className="text-green-400">'tax_123'</span>,
                  <br />
                  {"  "}formType: <span className="text-green-400">'1040'</span>
                  <br />
                  {"}"});
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="/developer/docs/sdks/nodejs"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View Full Documentation
                </a>
                <a
                  href="https://github.com/taxu/taxu-node"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>

          {/* Python SDK */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Python</h3>
                <p className="text-slate-400">Official Taxu SDK for Python applications</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Installation</h4>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-slate-400"># pip</div>
                  <div className="text-blue-400">pip install taxu</div>
                  <div className="text-slate-400 mt-2"># poetry</div>
                  <div className="text-blue-400">poetry add taxu</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Quick Start</h4>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-purple-400">import</div> <span className="text-blue-300">taxu</span>
                  <br />
                  <br />
                  taxu.api_key = <span className="text-green-400">"your_api_key"</span>
                  <br />
                  <br />
                  <div className="text-slate-400"># Create a bank account</div>
                  account = taxu.neobank.Account.create(
                  <br />
                  {"    "}account_type=<span className="text-green-400">"checking"</span>,
                  <br />
                  {"    "}currency=<span className="text-green-400">"usd"</span>
                  <br />)
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="/developer/docs/sdks/python"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View Full Documentation
                </a>
                <a
                  href="https://github.com/taxu/taxu-python"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>

          {/* Ruby SDK */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-blue-500/50 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-white mb-2">Ruby</h3>
              <p className="text-slate-400">Official Taxu SDK for Ruby applications</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Installation</h4>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-slate-400"># Gemfile</div>
                  <div className="text-blue-400">gem 'taxu'</div>
                  <div className="text-slate-400 mt-2"># or install directly</div>
                  <div className="text-blue-400">gem install taxu</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-3">Quick Start</h4>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-purple-400">require</div> <span className="text-green-400">'taxu'</span>
                  <br />
                  <br />
                  <span className="text-blue-300">Taxu</span>.api_key ={" "}
                  <span className="text-green-400">'your_api_key'</span>
                  <br />
                  <br />
                  <div className="text-slate-400"># Create an investment portfolio</div>
                  portfolio = <span className="text-blue-300">Taxu::Investment::Portfolio</span>.create(
                  <br />
                  {"  "}name: <span className="text-green-400">'Growth Portfolio'</span>,
                  <br />
                  {"  "}risk_level: <span className="text-green-400">'moderate'</span>
                  <br />)
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="/developer/docs/sdks/ruby"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View Full Documentation
                </a>
                <a
                  href="https://github.com/taxu/taxu-ruby"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>

          {/* Additional SDKs Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* PHP */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">PHP</h3>
              <p className="text-slate-400 text-sm mb-4">For PHP and Laravel applications</p>
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-sm mb-4">
                <span className="text-blue-400">composer require taxu/taxu-php</span>
              </div>
              <a href="/developer/docs/sdks/php" className="text-blue-400 hover:text-blue-300 text-sm">
                View documentation →
              </a>
            </div>

            {/* Go */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Go</h3>
              <p className="text-slate-400 text-sm mb-4">For Go backend services</p>
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-sm mb-4">
                <span className="text-blue-400">go get github.com/taxu/taxu-go</span>
              </div>
              <a href="/developer/docs/sdks/go" className="text-blue-400 hover:text-blue-300 text-sm">
                View documentation →
              </a>
            </div>

            {/* Java */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Java</h3>
              <p className="text-slate-400 text-sm mb-4">For Java and Spring Boot apps</p>
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-sm mb-4">
                <span className="text-blue-400">implementation 'com.taxu:taxu-java'</span>
              </div>
              <a href="/developer/docs/sdks/java" className="text-blue-400 hover:text-blue-300 text-sm">
                View documentation →
              </a>
            </div>

            {/* .NET */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">.NET</h3>
              <p className="text-slate-400 text-sm mb-4">For C# and .NET applications</p>
              <div className="bg-slate-950 rounded-lg p-3 font-mono text-sm mb-4">
                <span className="text-blue-400">dotnet add package Taxu</span>
              </div>
              <a href="/developer/docs/sdks/dotnet" className="text-blue-400 hover:text-blue-300 text-sm">
                View documentation →
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">SDK Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Type Safe</h3>
              <p className="text-slate-400 text-sm">
                Full TypeScript and type definitions included for autocomplete and type checking.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure by Default</h3>
              <p className="text-slate-400 text-sm">
                Built-in security best practices including automatic request signing and retry logic.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Comprehensive Docs</h3>
              <p className="text-slate-400 text-sm">
                Detailed documentation with code examples and integration guides for every platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
