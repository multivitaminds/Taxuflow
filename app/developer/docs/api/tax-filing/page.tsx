import Link from "next/link"
import { Code2, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function TaxFilingAPIPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/v1/tax/calculate",
      description: "Calculate federal and state tax liability with real-time IRS rate tables",
    },
    {
      method: "POST",
      path: "/v1/tax/forms/1040",
      description: "Generate and prefill Form 1040 with taxpayer data",
    },
    {
      method: "POST",
      path: "/v1/tax/efile",
      description: "E-file tax returns directly to IRS via TaxBandits integration",
    },
    {
      method: "GET",
      path: "/v1/tax/status/:filingId",
      description: "Check e-filing status and retrieve acknowledgment codes",
    },
    {
      method: "POST",
      path: "/v1/tax/refund/estimate",
      description: "Estimate tax refund amount based on income and deductions",
    },
    {
      method: "POST",
      path: "/v1/tax/quarterly-estimates",
      description: "Calculate quarterly estimated tax payments for self-employed",
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
            <span className="text-[#0a2540] font-medium">Tax Filing</span>
          </div>
          <h1 className="text-5xl font-bold text-[#0a2540] mb-4">Tax Filing API</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Complete tax preparation, calculation, and e-filing infrastructure with IRS-compliant forms and real-time
            validation
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
                    <a href="#webhooks" className="text-gray-600 hover:text-[#635bff]">
                      Webhooks
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900 text-sm mb-1">IRS Certified</div>
                    <div className="text-sm text-blue-700">
                      Our e-file provider is IRS-authorized with 99.8% acceptance rate
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
                  The Tax Filing API provides comprehensive tax preparation and e-filing capabilities. Calculate taxes
                  in real-time, generate IRS forms, and submit returns electronically with full audit trail support.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#635bff]/10 rounded-lg flex items-center justify-center mb-4">
                      <Code2 className="w-6 h-6 text-[#635bff]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Real-time Calculation</h3>
                    <p className="text-sm text-gray-600">Instant tax calculations using current IRS tax tables</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Form Generation</h3>
                    <p className="text-sm text-gray-600">Generate 1040, W-2, 1099, and 50+ other tax forms</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle className="w-6 h-6 text-[#ff5c35]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">E-File Integration</h3>
                    <p className="text-sm text-gray-600">Direct IRS e-file with acknowledgment tracking</p>
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

              {/* Example 1: Calculate Taxes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">Calculate Federal Tax</h3>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Calculate federal tax liability
const taxu = require('@taxu/taxu-js')('your_api_key');

const result = await taxu.tax.calculate({
  filingStatus: 'single',
  income: 75000,
  deductions: {
    standard: true,
    itemized: []
  },
  credits: {
    childTaxCredit: 0,
    earnedIncomeCredit: 0
  },
  taxYear: 2024
});

console.log(result);
// {
//   taxLiability: 9488,
//   effectiveRate: 12.65,
//   marginalRate: 22,
//   refundAmount: 0,
//   breakdown: {
//     federalTax: 9488,
//     socialSecurity: 4650,
//     medicare: 1088
//   }
// }`}</code>
                  </pre>
                </div>
              </div>

              {/* Example 2: E-File Return */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">E-File Tax Return</h3>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Submit tax return for e-filing
const filing = await taxu.tax.efile({
  taxpayer: {
    ssn: '123-45-6789',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-06-15',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    }
  },
  form1040: {
    wages: 75000,
    interest: 250,
    dividends: 500,
    standardDeduction: 13850,
    taxWithheld: 9500
  },
  directDeposit: {
    routingNumber: '021000021',
    accountNumber: '1234567890',
    accountType: 'checking'
  }
});

console.log(filing);
// {
//   id: 'fil_1234567890',
//   status: 'submitted',
//   submittedAt: '2024-04-15T10:30:00Z',
//   acknowledgmentCode: 'ACK123456',
//   estimatedRefund: 12,
//   refundDate: '2024-05-01'
// }`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Webhooks */}
            <section id="webhooks">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Webhooks</h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Subscribe to real-time e-filing status updates and IRS acknowledgment notifications:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#635bff] mt-0.5" />
                    <div>
                      <code className="text-sm font-mono text-[#0a2540]">tax.filing.submitted</code>
                      <p className="text-sm text-gray-600 mt-1">Return submitted to IRS</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <code className="text-sm font-mono text-[#0a2540]">tax.filing.accepted</code>
                      <p className="text-sm text-gray-600 mt-1">IRS accepted the return</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <code className="text-sm font-mono text-[#0a2540]">tax.filing.rejected</code>
                      <p className="text-sm text-gray-600 mt-1">IRS rejected the return with error codes</p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-[#0a2540] mb-6">Next steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/developer/docs/api/documents"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">
                    Document Intelligence API →
                  </h4>
                  <p className="text-gray-600 text-sm">Extract data from W-2s, 1099s, and tax documents</p>
                </Link>
                <Link
                  href="/developer/playground"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">
                    Try it in Playground →
                  </h4>
                  <p className="text-gray-600 text-sm">Test the Tax Filing API interactively</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
