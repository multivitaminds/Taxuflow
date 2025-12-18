import Link from "next/link"
import { DollarSign, CreditCard, TrendingUp, Shield } from "lucide-react"

export default function NeobankAPIPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/v1/accounts/create",
      description: "Open new checking or savings accounts with instant account numbers",
    },
    {
      method: "GET",
      path: "/v1/accounts/:id/balance",
      description: "Retrieve real-time account balance and transaction history",
    },
    {
      method: "POST",
      path: "/v1/transfers",
      description: "Initiate ACH, wire, or instant transfers between accounts",
    },
    {
      method: "POST",
      path: "/v1/cards/issue",
      description: "Issue virtual or physical debit cards with spending controls",
    },
    {
      method: "GET",
      path: "/v1/transactions",
      description: "Query transactions with advanced filtering and search",
    },
    {
      method: "POST",
      path: "/v1/payments/bill-pay",
      description: "Schedule and execute bill payments to vendors",
    },
  ]

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
            <span className="text-[#0a2540] font-medium">Neobank</span>
          </div>
          <h1 className="text-5xl font-bold text-[#0a2540] mb-4">Neobank API</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Modern banking infrastructure for checking accounts, savings, transfers, and card issuance with real-time
            transaction processing
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
                    <a href="#endpoints" className="text-gray-600 hover:text-[#635bff]">
                      Endpoints
                    </a>
                  </li>
                  <li>
                    <a href="#examples" className="text-gray-600 hover:text-[#635bff]">
                      Code Examples
                    </a>
                  </li>
                  <li>
                    <a href="#security" className="text-gray-600 hover:text-[#635bff]">
                      Security
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-green-900 text-sm mb-1">FDIC Insured</div>
                    <div className="text-sm text-green-700">All accounts insured up to $250,000 by FDIC</div>
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
                  The Neobank API provides complete banking-as-a-service capabilities. Open accounts, issue cards,
                  process transfers, and manage transactions with enterprise-grade security and compliance.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#635bff]/10 rounded-lg flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-[#635bff]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Instant Accounts</h3>
                    <p className="text-sm text-gray-600">Open checking and savings accounts in seconds</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-4">
                      <CreditCard className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Card Issuance</h3>
                    <p className="text-sm text-gray-600">Issue virtual and physical debit cards instantly</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-[#ff5c35]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Real-time Processing</h3>
                    <p className="text-sm text-gray-600">Process transactions and transfers instantly</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">API Endpoints</h2>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#635bff] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          endpoint.method === "POST" ? "bg-[#635bff] text-white" : "bg-[#00d4ff] text-[#0a2540]"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div className="flex-1">
                        <code className="text-[#0a2540] font-mono font-semibold">{endpoint.path}</code>
                        <p className="text-gray-600 mt-2">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Code Examples</h2>

              {/* Example 1: Create Account */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">Create Checking Account</h3>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Create a new checking account
const taxu = require('@taxu/taxu-js')('your_api_key');

const account = await taxu.neobank.accounts.create({
  type: 'checking',
  owner: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+1234567890',
    ssn: '123-45-6789',
    dateOfBirth: '1990-03-15',
    address: {
      street: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102'
    }
  },
  initialDeposit: 1000
});

console.log(account);
// {
//   id: 'acct_abc123',
//   accountNumber: '4567891234',
//   routingNumber: '021000021',
//   balance: 1000,
//   status: 'active',
//   createdAt: '2024-01-15T10:30:00Z'
// }`}</code>
                  </pre>
                </div>
              </div>

              {/* Example 2: Issue Card */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">Issue Virtual Card</h3>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Issue a virtual debit card
const card = await taxu.neobank.cards.issue({
  accountId: 'acct_abc123',
  type: 'virtual',
  spendingLimits: {
    daily: 1000,
    monthly: 5000,
    perTransaction: 500
  },
  restrictions: {
    allowedCategories: ['groceries', 'gas', 'restaurants'],
    blockedMerchants: []
  }
});

console.log(card);
// {
//   id: 'card_xyz789',
//   last4: '4242',
//   expMonth: 12,
//   expYear: 2027,
//   cvv: '123',
//   status: 'active',
//   balance: 1000
// }`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Security */}
            <section id="security">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Security & Compliance</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <Shield className="w-8 h-8 text-[#635bff] mb-4" />
                  <h3 className="font-bold text-[#0a2540] mb-2">Bank-Grade Encryption</h3>
                  <p className="text-sm text-gray-600">
                    All data encrypted at rest with AES-256 and in transit with TLS 1.3
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6">
                  <Shield className="w-8 h-8 text-[#00d4ff] mb-4" />
                  <h3 className="font-bold text-[#0a2540] mb-2">SOC 2 Type II Certified</h3>
                  <p className="text-sm text-gray-600">
                    Independently audited security controls and compliance procedures
                  </p>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-[#0a2540] mb-6">Next steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/developer/docs/api/investment"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">Investment API →</h4>
                  <p className="text-gray-600 text-sm">Trade stocks, ETFs, and crypto assets</p>
                </Link>
                <Link
                  href="/developer/playground"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">
                    Try it in Playground →
                  </h4>
                  <p className="text-gray-600 text-sm">Test the Neobank API interactively</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
