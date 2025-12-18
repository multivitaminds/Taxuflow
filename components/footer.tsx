import Link from "next/link"
import { StatusBadge } from "./status-badge"

export function Footer() {
  const footerLinks = {
    Products: [
      { label: "Payments", href: "/products/payments" },
      { label: "Billing", href: "/products/billing" },
      { label: "Connect", href: "/products/connect" },
      { label: "Payouts", href: "/products/payouts" },
      { label: "Issuing", href: "/products/issuing" },
      { label: "Terminal", href: "/products/terminal" },
      { label: "Tax", href: "/products/tax" },
      { label: "Identity", href: "/products/identity" },
    ],
    Solutions: [
      { label: "Individuals", href: "/individuals" },
      { label: "Businesses", href: "/businesses" },
      { label: "Developer", href: "/developers" },
      { label: "Partners", href: "/partners" },
      { label: "Ecommerce", href: "/solutions/ecommerce" },
      { label: "SaaS", href: "/solutions/saas" },
      { label: "Marketplaces", href: "/solutions/marketplaces" },
      { label: "Platforms", href: "/solutions/platforms" },
    ],
    Resources: [
      { label: "Blog", href: "/blog" },
      { label: "Referral Program", href: "/referral" },
      { label: "Security", href: "/security" },
      { label: "Get Started", href: "/get-started" },
      { label: "Guides", href: "/guides" },
      { label: "API Reference", href: "/docs" },
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Status", href: "/developer-portal/status" },
      { label: "Newsroom", href: "/newsroom" },
    ],
    Legal: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Data Usage", href: "/data-usage" },
      { label: "Compliance", href: "/compliance" },
    ],
  }

  return (
    <footer className="bg-[#0a2540] text-white border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-bold mb-6">
              <span className="text-white">Tax</span>
              <span className="text-[#00d4ff]">u</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              AI-powered tax filing infrastructure for the internet economy.
            </p>
            <div className="mb-6">
              <StatusBadge />
            </div>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/taxu_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.072 4.072 0 01-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://github.com/taxu-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268-.18.58-.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400">© 2025 Taxu. All rights reserved.</div>
          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
            <span>IRS e-file Certified</span>
            <span>SOC 2 Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
