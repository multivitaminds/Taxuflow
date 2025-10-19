import Link from "next/link"
import {
  FileText,
  Wallet,
  Users,
  BarChart3,
  Building2,
  CreditCard,
  Package,
  TrendingUp,
  Zap,
  Brain,
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            AI-Powered Business Operating System
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Complete Accounting & Bookkeeping for Modern Businesses
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Taxu combines the power of enterprise accounting with cutting-edge AI to automate your finances, save time,
            and give you real-time insights into your business performance.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg cursor-pointer"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg cursor-pointer"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Run Your Business</h2>
          <p className="text-xl text-gray-600">Comprehensive tools that work together seamlessly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Invoicing */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <FileText className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoicing</h3>
            <p className="text-gray-600 text-sm">Create professional invoices and get paid faster</p>
          </div>

          {/* Expense Tracking */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Wallet className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense Tracking</h3>
            <p className="text-gray-600 text-sm">Capture receipts and categorize expenses automatically</p>
          </div>

          {/* Customer Management */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Users className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600 text-sm">Track customer relationships and payment history</p>
          </div>

          {/* Financial Reports */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <BarChart3 className="w-12 h-12 text-orange-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-600 text-sm">Real-time P&L, balance sheets, and cash flow</p>
          </div>

          {/* Vendor Management */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Building2 className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vendor Management</h3>
            <p className="text-gray-600 text-sm">Manage bills and vendor relationships</p>
          </div>

          {/* Banking */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <CreditCard className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Banking</h3>
            <p className="text-gray-600 text-sm">Connect accounts and reconcile transactions</p>
          </div>

          {/* Products & Services */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Package className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Products & Services</h3>
            <p className="text-gray-600 text-sm">Manage your product catalog and pricing</p>
          </div>

          {/* Project Tracking */}
          <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <TrendingUp className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Tracking</h3>
            <p className="text-gray-600 text-sm">Track project profitability and time</p>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <Brain className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Powered by Artificial Intelligence</h2>
            <p className="text-xl text-blue-100">Let AI handle the busywork while you focus on growing your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Categorization</h3>
              <p className="text-blue-100">AI automatically categorizes transactions and expenses</p>
            </div>
            <div className="text-center">
              <Brain className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Receipt OCR</h3>
              <p className="text-blue-100">Extract data from receipts instantly with computer vision</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cash Flow Predictions</h3>
              <p className="text-blue-100">Forecast your cash flow with machine learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">$2B+</div>
            <div className="text-gray-600">Transactions Processed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gray-900 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses using Taxu to streamline their finances
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg cursor-pointer"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg cursor-pointer"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 border-t border-gray-200">
        <div className="flex justify-center gap-8 mb-4 flex-wrap">
          <Link href="/about" className="hover:text-gray-900">
            About
          </Link>
          <Link href="/pricing" className="hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/security" className="hover:text-gray-900">
            Security
          </Link>
          <Link href="/developers" className="hover:text-gray-900">
            Developers
          </Link>
          <Link href="/contact" className="hover:text-gray-900">
            Contact
          </Link>
        </div>
        <p>&copy; 2025 Taxu. All rights reserved.</p>
      </footer>
    </main>
  )
}
