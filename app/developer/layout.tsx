import type React from "react"
import Link from "next/link"

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-[48px]">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold flex items-center gap-1">
                <span className="text-[#0a2540]">Taxu</span>
                <span className="ml-2 text-xs font-bold text-white bg-[#635bff] px-2 py-0.5 rounded-full tracking-wide">
                  DOCS
                </span>
              </Link>
              <nav className="hidden lg:flex items-center gap-1">
                <Link
                  href="/developer"
                  className="px-3 py-2 text-sm font-medium text-[#0a2540] hover:text-[#635bff] transition-colors"
                >
                  Get started
                </Link>
                <Link
                  href="/developer/docs/api/documents"
                  className="px-3 py-2 text-sm font-medium text-[#0a2540] hover:text-[#635bff] transition-colors"
                >
                  Payments
                </Link>
                <Link
                  href="/developer/docs/api/accounting"
                  className="px-3 py-2 text-sm font-medium text-[#0a2540] hover:text-[#635bff] transition-colors"
                >
                  Revenue
                </Link>
                <Link
                  href="/developer/sdks"
                  className="px-3 py-2 text-sm font-medium text-[#0a2540] hover:text-[#635bff] transition-colors"
                >
                  Platforms
                </Link>
                <Link
                  href="/developer/examples"
                  className="px-3 py-2 text-sm font-medium text-[#0a2540] hover:text-[#635bff] transition-colors"
                >
                  Resources
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  placeholder="Search docs..."
                  className="w-64 pl-9 pr-4 py-1.5 text-sm bg-slate-100 border-transparent rounded-full focus:bg-white focus:border-[#635bff] focus:ring-2 focus:ring-[#635bff]/20 transition-all outline-none placeholder:text-slate-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <kbd className="hidden sm:inline-block px-1.5 h-5 text-[10px] font-medium text-slate-500 bg-white border border-slate-300 rounded shadow-sm items-center justify-center leading-5">
                    ⌘
                  </kbd>
                  <kbd className="hidden sm:inline-block px-1.5 h-5 text-[10px] font-medium text-slate-500 bg-white border border-slate-300 rounded shadow-sm items-center justify-center leading-5">
                    K
                  </kbd>
                </div>
              </div>
              <Link href="/developer-portal" className="text-sm font-medium text-[#0a2540] hover:text-[#635bff]">
                Dashboard
              </Link>
              {/* Replaced the "ugly" circular/pill button with a clean, standard secondary button style */}
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#0a2540] bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
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
      <footer className="border-t border-slate-200 bg-[#f6f9fc]">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            {/* Products & pricing */}
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] mb-4">Products</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/pricing" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/documents" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Tax Filing
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/accounting" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Accounting
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/ai-agents" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    AI Agents
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] mb-4">Solutions</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/individuals" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Individuals
                  </Link>
                </li>
                <li>
                  <Link href="/businesses" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Businesses
                  </Link>
                </li>
                <li>
                  <Link href="/accounting" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Accountants
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] mb-4">Developers</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/developer" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/developer/docs/api/documents" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    API reference
                  </Link>
                </li>
                <li>
                  <Link href="/developer/status" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    API status
                  </Link>
                </li>
                <li>
                  <Link href="/developer/sdks" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    SDKs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/developer/support" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-slate-600 hover:text-[#0a2540]">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold flex items-center gap-1">
                <span className="text-[#0a2540]">Tax</span>
                <span className="text-[#635bff]">u</span>
              </Link>
              <div className="flex items-center gap-4 text-sm text-slate-500">
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
                className="text-slate-400 hover:text-[#0a2540] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com/taxu-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-[#0a2540] transition-colors"
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
