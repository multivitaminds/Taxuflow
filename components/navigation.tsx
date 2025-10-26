"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { AuthButton } from "@/components/auth-button"

const navigationStructure = [
  { href: "/", label: "Home" },
  {
    label: "AI Agents",
    items: [
      { href: "/ai-agents", label: "Overview", description: "Meet your AI tax assistants" },
      { href: "/ai-agents/personal", label: "Personal AI Agent", description: "For individuals and families" },
      { href: "/ai-agents/business", label: "Business AI Agent", description: "For businesses and enterprises" },
      { href: "/ai-agents/capabilities", label: "Capabilities", description: "What our AI can do for you" },
    ],
  },
  {
    label: "How It Works",
    items: [
      { href: "/how-it-works", label: "Overview", description: "See how Taxu simplifies taxes" },
      { href: "/how-it-works/process", label: "Our Process", description: "Step-by-step tax automation" },
      { href: "/how-it-works/integrations", label: "Integrations", description: "Connect your financial accounts" },
      { href: "/how-it-works/security", label: "Security & Privacy", description: "Bank-level encryption" },
    ],
  },
  {
    label: "Features",
    items: [
      { href: "/ai-features", label: "All Features", description: "Complete feature overview" },
      { href: "/ai-features/deductions", label: "Smart Deductions", description: "AI-powered deduction finder" },
      { href: "/ai-features/filing", label: "Auto Filing", description: "Automated tax filing" },
      { href: "/ai-features/audit", label: "Audit Protection", description: "Full audit support" },
    ],
  },
  { href: "/pricing", label: "Pricing" },
  {
    label: "Individuals",
    items: [
      { href: "/individuals", label: "Overview", description: "Personal tax solutions" },
      { href: "/individuals/freelancers", label: "Freelancers", description: "For self-employed professionals" },
      { href: "/individuals/investors", label: "Investors", description: "Capital gains and dividends" },
      { href: "/individuals/families", label: "Families", description: "Family tax planning" },
    ],
  },
  {
    label: "Businesses",
    items: [
      { href: "/businesses", label: "Overview", description: "Business tax solutions" },
      { href: "/businesses/small-business", label: "Small Business", description: "For SMBs and startups" },
      { href: "/businesses/enterprise", label: "Enterprise", description: "For large organizations" },
      { href: "/businesses/accountants", label: "For Accountants", description: "Professional tools" },
    ],
  },
  {
    label: "Accounting",
    items: [
      { href: "/accounting", label: "Overview", description: "Accounting integrations" },
      { href: "/accounting/quickbooks", label: "QuickBooks", description: "Sync with QuickBooks" },
      { href: "/accounting/xero", label: "Xero", description: "Connect to Xero" },
      { href: "/accounting/reports", label: "Reports", description: "Financial reporting" },
    ],
  },
  {
    label: "Developer",
    items: [
      { href: "/developer", label: "Documentation", description: "Start integrating Taxu's products and tools" },
      { href: "/developer/docs/getting-started", label: "Get Started", description: "Quick start guide" },
      {
        href: "/developer/docs/api/tax-calculation",
        label: "Tax Calculation API",
        description: "Calculate taxes programmatically",
      },
      {
        href: "/developer/docs/api/documents",
        label: "Document Intelligence",
        description: "Extract data from tax documents",
      },
      { href: "/developer/docs/api/ai-agents", label: "AI Agents API", description: "Integrate AI tax assistants" },
      { href: "/developer/docs/webhooks", label: "Webhooks", description: "Real-time event notifications" },
    ],
  },
  { href: "/security", label: "Security" },
]

export function Navigation() {
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "border-b border-border bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14" : "h-20"}`}
        >
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">Tax</span>
              <span className="text-accent">u</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navigationStructure.map((item) => {
                if ("items" in item) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                        {item.label}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {openDropdown === item.label && (
                        <div className="absolute top-full left-0 pt-2">
                          <div className="w-80 bg-background border border-border rounded-lg shadow-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="space-y-1">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className="block px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <div className="font-semibold text-sm text-foreground group-hover:text-accent">
                                    {subItem.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{subItem.description}</div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="hidden sm:flex">
              <AuthButton />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navigationStructure.map((item) => {
              if ("items" in item) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-4 px-4 flex flex-col gap-2 sm:hidden">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
