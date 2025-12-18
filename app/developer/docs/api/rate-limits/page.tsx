import Link from "next/link"
import { Zap, TrendingUp, AlertCircle, CheckCircle2, BarChart3 } from "lucide-react"
import { SyntaxHighlighter } from "@/components/developer/syntax-highlighter"

export const metadata = {
  title: "Rate Limits - Taxu API Documentation",
  description: "Understand API rate limits and throttling policies for the Taxu platform",
}

export default function RateLimitsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-[#f6f9fc]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <Link href="/developer" className="hover:text-[#635bff]">
              Developers
            </Link>
            <span>/</span>
            <Link href="/developer/docs" className="hover:text-[#635bff]">
              Docs
            </Link>
            <span>/</span>
            <Link href="/developer/docs/api/overview" className="hover:text-[#635bff]">
              API
            </Link>
            <span>/</span>
            <span className="text-[#0a2540] font-medium">Rate Limits</span>
          </div>
          <h1 className="text-5xl font-bold text-[#0a2540] mb-4">Rate Limits</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Understand throttling policies and optimize your API usage for production applications
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">On this page</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#overview" className="text-gray-600 hover:text-[#635bff]">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#limits" className="text-gray-600 hover:text-[#635bff]">
                      Rate Limit Tiers
                    </a>
                  </li>
                  <li>
                    <a href="#headers" className="text-gray-600 hover:text-[#635bff]">
                      Response Headers
                    </a>
                  </li>
                  <li>
                    <a href="#handling" className="text-gray-600 hover:text-[#635bff]">
                      Handling Limits
                    </a>
                  </li>
                  <li>
                    <a href="#best-practices" className="text-gray-600 hover:text-[#635bff]">
                      Best Practices
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900 text-sm mb-1">Need Higher Limits?</div>
                    <div className="text-sm text-blue-700">
                      Contact our sales team to discuss enterprise rate limits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Overview */}
            <section id="overview">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The Taxu API implements rate limiting to ensure fair usage and maintain platform stability. Rate
                  limits are applied per API key and calculated using a sliding window algorithm.
                </p>

                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-8">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-blue-900 mb-2">Generous Default Limits</h3>
                      <p className="text-blue-800">
                        Our default rate limits are designed to support most production applications without requiring
                        upgrades. Monitor your usage in the Dashboard to ensure you stay within limits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Rate Limit Tiers */}
            <section id="limits">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Rate Limit Tiers</h2>

              <p className="text-gray-700 mb-6">
                Rate limits vary by account tier and endpoint type. All limits are applied per API key.
              </p>

              <div className="grid gap-6 mb-8">
                {/* Standard Tier */}
                <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-[#635bff] transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0a2540] mb-2">Standard</h3>
                      <p className="text-gray-600">Default for all accounts</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">Active</div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-4xl font-bold text-[#635bff] mb-2">100</div>
                      <div className="text-sm text-gray-600">requests/second</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-4xl font-bold text-[#00d4ff] mb-2">10K</div>
                      <div className="text-sm text-gray-600">requests/minute</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-4xl font-bold text-[#ff5c35] mb-2">500K</div>
                      <div className="text-sm text-gray-600">requests/day</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600">
                      <strong className="text-gray-900">Burst allowance:</strong> Up to 200 req/s for 10 seconds
                    </div>
                  </div>
                </div>

                {/* Professional Tier */}
                <div className="border-2 border-purple-300 rounded-xl p-8 bg-gradient-to-br from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0a2540] mb-2">Professional</h3>
                      <p className="text-gray-600">Higher limits for growing businesses</p>
                    </div>
                    <div className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold">
                      Contact Sales
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-purple-600 mb-2">500</div>
                      <div className="text-sm text-gray-600">requests/second</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-purple-600 mb-2">50K</div>
                      <div className="text-sm text-gray-600">requests/minute</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-purple-600 mb-2">2.5M</div>
                      <div className="text-sm text-gray-600">requests/day</div>
                    </div>
                  </div>

                  <div className="border-t border-purple-200 pt-4">
                    <div className="text-sm text-gray-600">
                      <strong className="text-gray-900">Burst allowance:</strong> Up to 1,000 req/s for 30 seconds
                    </div>
                  </div>
                </div>

                {/* Enterprise Tier */}
                <div className="border-2 border-orange-300 rounded-xl p-8 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0a2540] mb-2">Enterprise</h3>
                      <p className="text-gray-600">Custom limits for large-scale operations</p>
                    </div>
                    <div className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold">Custom</div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-orange-600 mb-2">Custom</div>
                      <div className="text-sm text-gray-600">Tailored to your needs</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-orange-600 mb-2">Custom</div>
                      <div className="text-sm text-gray-600">Dedicated support</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-4xl font-bold text-orange-600 mb-2">SLA</div>
                      <div className="text-sm text-gray-600">99.99% uptime</div>
                    </div>
                  </div>

                  <div className="border-t border-orange-200 pt-4">
                    <div className="text-sm text-gray-600">
                      <strong className="text-gray-900">Includes:</strong> Dedicated infrastructure, custom burst
                      limits, priority support
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoint-Specific Limits */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-[#0a2540]">Endpoint-Specific Limits</h3>
                  <p className="text-sm text-gray-600 mt-1">Some endpoints have different rate limits</p>
                </div>
                <table className="w-full">
                  <thead className="bg-white border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Endpoint Type</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Standard Limit</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">/v1/tax/efile</code>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">10 req/min</td>
                      <td className="px-6 py-4 text-sm text-gray-600">IRS submission throttling</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">/v1/documents/extract</code>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">30 req/min</td>
                      <td className="px-6 py-4 text-sm text-gray-600">AI processing resources</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">/v1/banking/accounts</code>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">50 req/min</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Bank data provider limits</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Response Headers */}
            <section id="headers">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Rate Limit Response Headers</h2>

              <p className="text-gray-700 mb-6">
                Every API response includes headers that show your current rate limit status:
              </p>

              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Header</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">X-RateLimit-Limit</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Maximum requests allowed in the time window</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">X-RateLimit-Remaining</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Requests remaining in the current window</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">X-RateLimit-Reset</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Unix timestamp when the limit resets</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">Retry-After</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Seconds to wait before retrying (429 responses only)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SyntaxHighlighter
                language="bash"
                code={`HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1704067200
Content-Type: application/json

{
  "status": "success",
  "data": { ... }
}`}
              />
            </section>

            {/* Handling Rate Limits */}
            <section id="handling">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Handling Rate Limit Errors</h2>

              <p className="text-gray-700 mb-6">
                When you exceed a rate limit, the API returns a{" "}
                <code className="px-2 py-1 bg-slate-100 rounded text-sm">429 Too Many Requests</code> error:
              </p>

              <SyntaxHighlighter
                language="json"
                code={`{
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded. Please retry after 12 seconds.",
    "code": "rate_limit_exceeded",
    "retry_after": 12
  }
}`}
              />

              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">Retry Logic Example</h3>
                <p className="text-gray-700 mb-4">
                  Implement exponential backoff with the{" "}
                  <code className="px-2 py-1 bg-slate-100 rounded text-sm">Retry-After</code> header:
                </p>

                <SyntaxHighlighter
                  language="javascript"
                  code={`async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
      console.log(\`Rate limited. Retrying after \${retryAfter} seconds...\`);
      
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error(\`Request failed: \${response.status}\`);
  }
  
  throw new Error('Max retries exceeded');
}

// Usage
const result = await makeRequestWithRetry('https://api.taxu.com/v1/tax/calculate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_test_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ filingStatus: 'single', income: 75000 })
});`}
                />
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Best Practices</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Monitor rate limit headers</h4>
                    <p className="text-sm text-green-800">
                      Track <code className="px-1.5 py-0.5 bg-white rounded text-xs">X-RateLimit-Remaining</code> to
                      proactively slow down requests before hitting limits
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Implement exponential backoff</h4>
                    <p className="text-sm text-green-800">
                      Use exponential backoff when retrying failed requests to avoid thundering herd problems
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Cache responses when possible</h4>
                    <p className="text-sm text-green-800">
                      Reduce API calls by caching data that doesn't change frequently
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Use webhooks for async operations</h4>
                    <p className="text-sm text-green-800">
                      Instead of polling, use webhooks to get notified when operations complete
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Batch requests when supported</h4>
                    <p className="text-sm text-green-800">
                      Use batch endpoints to perform multiple operations in a single request
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-1">Avoid tight polling loops</h4>
                    <p className="text-sm text-amber-800">
                      Repeatedly checking for updates can quickly exhaust your rate limit
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Monitoring */}
            <section className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0a2540] mb-2">Monitor Your Usage</h3>
                  <p className="text-gray-700">
                    View real-time rate limit metrics and usage analytics in your Dashboard
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/api/usage"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                View API Usage Dashboard
              </Link>
            </section>

            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-[#0a2540] mb-6">Next steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/developer/docs/api/authentication"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">Authentication →</h4>
                  <p className="text-gray-600 text-sm">Learn how to authenticate API requests</p>
                </Link>
                <Link
                  href="/developer/docs/webhooks"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">Webhooks →</h4>
                  <p className="text-gray-600 text-sm">Receive real-time event notifications</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
