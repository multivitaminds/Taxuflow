import Link from "next/link"
import { Key, Shield, Lock, Eye, AlertTriangle, CheckCircle2 } from "lucide-react"
import { SyntaxHighlighter } from "@/components/developer/syntax-highlighter"

export const metadata = {
  title: "Authentication - Taxu API Documentation",
  description: "Learn how to authenticate API requests with Taxu using API keys and OAuth 2.0",
}

export default function AuthenticationPage() {
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
            <span className="text-[#0a2540] font-medium">Authentication</span>
          </div>
          <h1 className="text-5xl font-bold text-[#0a2540] mb-4">Authentication</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Secure your API requests with API keys and OAuth 2.0 authentication
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
                    <a href="#api-keys" className="text-gray-600 hover:text-[#635bff]">
                      API Keys
                    </a>
                  </li>
                  <li>
                    <a href="#test-live-modes" className="text-gray-600 hover:text-[#635bff]">
                      Test & Live Modes
                    </a>
                  </li>
                  <li>
                    <a href="#restricted-keys" className="text-gray-600 hover:text-[#635bff]">
                      Restricted Keys
                    </a>
                  </li>
                  <li>
                    <a href="#oauth" className="text-gray-600 hover:text-[#635bff]">
                      OAuth 2.0
                    </a>
                  </li>
                  <li>
                    <a href="#best-practices" className="text-gray-600 hover:text-[#635bff]">
                      Best Practices
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-900 text-sm mb-1">Keep Keys Secure</div>
                    <div className="text-sm text-amber-700">
                      Never expose your secret keys in client-side code or public repositories
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
                  The Taxu API uses API keys to authenticate requests. You can view and manage your API keys in the{" "}
                  <Link href="/dashboard" className="text-[#635bff] hover:underline">
                    Dashboard
                  </Link>
                  . Your API keys carry many privileges, so be sure to keep them secure!
                </p>

                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-8">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-blue-900 mb-2">Authentication is required</h3>
                      <p className="text-blue-800">
                        All API requests must be authenticated using an API key passed in the Authorization header. Do
                        not share your secret API keys in publicly accessible areas such as GitHub, client-side code,
                        and so forth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* API Keys */}
            <section id="api-keys">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">API Keys</h2>

              <p className="text-gray-700 mb-6">
                Taxu provides two types of API keys: <strong>secret keys</strong> and <strong>publishable keys</strong>.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#635bff]/10 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-[#635bff]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0a2540]">Secret Keys</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Use secret keys on the server-side. They can perform any API request to Taxu.
                  </p>
                  <div className="p-3 bg-slate-50 rounded font-mono text-sm">
                    <span className="text-gray-500">sk_test_</span>
                    <span className="text-[#0a2540]">51StgIqEDGn...</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-[#00d4ff]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0a2540]">Publishable Keys</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Use publishable keys in client-side code. They have limited permissions.
                  </p>
                  <div className="p-3 bg-slate-50 rounded font-mono text-sm">
                    <span className="text-gray-500">pk_test_</span>
                    <span className="text-[#0a2540]">51StgIqEDGn...</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#0a2540] mb-4">Making authenticated requests</h3>
              <p className="text-gray-700 mb-4">
                Include your API key in the{" "}
                <code className="px-2 py-1 bg-slate-100 rounded text-sm">Authorization</code> header as a Bearer token:
              </p>

              <SyntaxHighlighter
                language="bash"
                code={`curl https://api.taxu.com/v1/tax/calculate \\
  -H "Authorization: Bearer sk_test_51StgIqEDGn..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "filingStatus": "single",
    "income": 75000
  }'`}
              />

              <div className="mt-6">
                <SyntaxHighlighter
                  language="javascript"
                  code={`// Using the Taxu SDK
const taxu = require('@taxu/taxu-js')('sk_test_51StgIqEDGn...');

const result = await taxu.tax.calculate({
  filingStatus: 'single',
  income: 75000
});`}
                />
              </div>
            </section>

            {/* Test & Live Modes */}
            <section id="test-live-modes">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Test and Live Modes</h2>

              <p className="text-gray-700 mb-6">
                Taxu has two environments: <strong>test mode</strong> for development and <strong>live mode</strong> for
                production.
              </p>

              <div className="space-y-4 mb-8">
                <div className="border-l-4 border-green-500 bg-green-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-green-900 mb-2">Test Mode</h3>
                      <p className="text-green-800 mb-3">
                        Test mode keys start with <code className="px-2 py-1 bg-white rounded text-sm">sk_test_</code>{" "}
                        or <code className="px-2 py-1 bg-white rounded text-sm">pk_test_</code>
                      </p>
                      <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                        <li>No real money or tax filings processed</li>
                        <li>Use for development and testing</li>
                        <li>Separate data from live mode</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-orange-500 bg-orange-50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-orange-900 mb-2">Live Mode</h3>
                      <p className="text-orange-800 mb-3">
                        Live mode keys start with <code className="px-2 py-1 bg-white rounded text-sm">sk_live_</code>{" "}
                        or <code className="px-2 py-1 bg-white rounded text-sm">pk_live_</code>
                      </p>
                      <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                        <li>Processes real payments and tax filings</li>
                        <li>Use for production applications</li>
                        <li>Requires account activation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Restricted Keys */}
            <section id="restricted-keys">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Restricted API Keys</h2>

              <p className="text-gray-700 mb-6">
                Create restricted keys with limited permissions to minimize security risks. Restricted keys can only
                access specific resources and operations.
              </p>

              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Permission</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">tax:read</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Read tax calculations and filings</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">tax:write</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Create and submit tax filings</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">banking:read</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Read banking accounts and transactions</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm">
                        <code className="text-[#635bff]">accounting:write</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Create invoices and manage books</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* OAuth */}
            <section id="oauth">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">OAuth 2.0</h2>

              <p className="text-gray-700 mb-6">
                Use OAuth 2.0 to allow users to authorize your application to access their Taxu account without sharing
                credentials.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0a2540] mb-4">Authorization Flow</h3>
                  <div className="border border-gray-200 rounded-lg p-6 bg-slate-50">
                    <ol className="space-y-3 text-sm text-gray-700">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#635bff] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>Redirect user to Taxu authorization URL</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#635bff] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>User grants permission to your application</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#635bff] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Exchange authorization code for access token</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#635bff] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>Use access token to make API requests</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <SyntaxHighlighter
                  language="javascript"
                  code={`// Step 1: Redirect to authorization URL
const authUrl = 'https://connect.taxu.com/oauth/authorize?' +
  'response_type=code&' +
  'client_id=YOUR_CLIENT_ID&' +
  'redirect_uri=https://yourapp.com/callback&' +
  'scope=tax:read tax:write';

// Step 3: Exchange code for token
const response = await fetch('https://connect.taxu.com/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    code: 'AUTHORIZATION_CODE',
    redirect_uri: 'https://yourapp.com/callback'
  })
});

const { access_token } = await response.json();`}
                />
              </div>
            </section>

            {/* Best Practices */}
            <section id="best-practices">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Security Best Practices</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Rotate keys regularly</h4>
                    <p className="text-sm text-green-800">
                      Change your API keys periodically to minimize security risks
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Use environment variables</h4>
                    <p className="text-sm text-green-800">Store API keys in environment variables, never in code</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-green-200 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Use restricted keys when possible</h4>
                    <p className="text-sm text-green-800">
                      Limit permissions to only what's needed for each integration
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Never expose secret keys client-side</h4>
                    <p className="text-sm text-red-800">
                      Secret keys should only be used on secure servers, never in browsers or mobile apps
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-[#0a2540] mb-6">Next steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/developer/docs/api/rate-limits"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">Rate Limits →</h4>
                  <p className="text-gray-600 text-sm">Learn about API rate limiting and best practices</p>
                </Link>
                <Link
                  href="/developer/docs/api/tax-filing"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">Start Building →</h4>
                  <p className="text-gray-600 text-sm">Explore the Tax Filing API endpoints</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
