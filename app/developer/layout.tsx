import type React from "react"
import Link from "next/link"

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-gray-900">Tax</span>
                <span className="text-[#635bff]">u</span>
                <span className="ml-2 text-sm font-bold text-[#635bff]">DOCS</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href="/developer"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Get started
                </Link>
                <Link
                  href="/developer/docs/api/documents"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Payments
                </Link>
                <Link
                  href="/developer/docs/api/accounting"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Revenue
                </Link>
                <Link
                  href="/developer/sdks"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Platforms and marketplaces
                </Link>
                <Link
                  href="/developer/docs/api/accounting"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Money management
                </Link>
                <Link
                  href="/developer/examples"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Developer resources
                </Link>
                <Link
                  href="/developer/changelog"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Changelog
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="search"
                placeholder="Search"
                className="hidden md:block w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#635bff] focus:border-transparent"
              />
              <Link href="/developer-portal" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                APIs & SDKs
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-bold text-white bg-[#635bff] rounded-lg hover:bg-[#5851df] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Products & pricing */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Products & pricing</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/documents" className="text-sm text-gray-600 hover:text-gray-900">
                    Tax Filing
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/accounting" className="text-sm text-gray-600 hover:text-gray-900">
                    Accounting
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/ai-agents" className="text-sm text-gray-600 hover:text-gray-900">
                    AI Agents
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/chat" className="text-sm text-gray-600 hover:text-gray-900">
                    Chat API
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Solutions</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/individuals" className="text-sm text-gray-600 hover:text-gray-900">
                    Individuals
                  </Link>
                </li>
                <li>
                  <Link href="/businesses" className="text-sm text-gray-600 hover:text-gray-900">
                    Businesses
                  </Link>
                </li>
                <li>
                  <Link href="/accounting" className="text-sm text-gray-600 hover:text-gray-900">
                    Accountants
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-sm text-gray-600 hover:text-gray-900">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Developers</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/developer" className="text-sm text-gray-600 hover:text-gray-900">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/documents" className="text-sm text-gray-600 hover:text-gray-900">
                    API reference
                  </Link>
                </li>
                <li>
                  <Link href="/developer/status" className="text-sm text-gray-600 hover:text-gray-900">
                    API status
                  </Link>
                </li>
                <li>
                  <Link href="/developer/changelog" className="text-sm text-gray-600 hover:text-gray-900">
                    API changelog
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks" className="text-sm text-gray-600 hover:text-gray-900">
                    SDKs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/developer/support" className="text-sm text-gray-600 hover:text-gray-900">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-sm text-gray-600 hover:text-gray-900">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/developer/examples" className="text-sm text-gray-600 hover:text-gray-900">
                    Sample projects
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/newsroom" className="text-sm text-gray-600 hover:text-gray-900">
                    Newsroom
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="text-sm text-gray-600 hover:text-gray-900">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">
                <span className="text-gray-900">Tax</span>
                <span className="text-[#635bff]">u</span>
              </Link>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>© 2025 Taxu</span>
                <span>•</span>
                <span>IRS e-file Certified</span>
                <span>•</span>
                <span>SOC 2 Type II</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/taxu_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com/taxu-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
