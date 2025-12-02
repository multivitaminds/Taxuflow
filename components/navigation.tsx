"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"

const navigationStructure = [
  { href: "/", label: "Home" },
  {
    label: "Products",
    items: [
      { href: "/ai-agents", label: "AI Agents", description: "Meet your AI tax assistants" },
      { href: "/ai-features", label: "Features", description: "Complete feature overview" },
      { href: "/accounting", label: "Accounting", description: "Integrations & Reports" },
    ],
  },
  { href: "/developer", label: "Developers" },
  {
    label: "Solutions",
    items: [
      { href: "/individuals", label: "For Individuals", description: "Personal tax solutions" },
      { href: "/businesses", label: "For Businesses", description: "SMB & Enterprise solutions" },
    ],
  },
  { href: "/pricing", label: "Pricing" },
  {
    label: "Resources",
    items: [
      { href: "/how-it-works", label: "How It Works", description: "See how Taxu simplifies taxes" },
      { href: "/security", label: "Security", description: "Data protection standards" },
    ],
  },
]

export function Navigation() {
  const [isDark, setIsDark] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
      setIsScrolled(currentScrollY > 20)
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isScrolled ? "bg-[#0A2540] shadow-md py-1.5" : "bg-[#0A2540] py-2"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-0.5 pl-1">
              <span className="text-white">Tax</span>
              <span className="text-[#4C6FFF]">u</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navigationStructure.map((item) => {
                if ("items" in item) {
                  return (
                    <div
                      key={item.label}
                      className="relative group"
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`flex items-center gap-1 text-sm font-medium transition-colors py-1
                          ${openDropdown === item.label ? "text-white opacity-100" : "text-white/80 hover:text-white"}
                        `}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}
                        />
                      </button>

                      <div
                        className={`absolute top-full left-0 pt-4 transition-all duration-200 ${openDropdown === item.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                      >
                        <div className="w-64 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden p-2">
                          <div className="space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block px-4 py-3 rounded-md hover:bg-slate-50 transition-colors group/item"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <div className="font-semibold text-sm text-slate-900 group-hover/item:text-[#4C6FFF]">
                                  {subItem.label}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{subItem.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                if (item.href === "/developer") {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full text-white hover:bg-white/10 hover:text-white hidden"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link href="/login" className="hidden sm:inline-block">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/10 font-medium text-sm h-8 px-4"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/get-started" className="hidden sm:inline-block">
              <Button
                size="sm"
                className="bg-[#4C6FFF] hover:bg-[#3b5bdb] text-white font-medium rounded-full text-sm h-8 px-5 transition-all shadow-lg shadow-blue-900/20"
              >
                Get Started
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10 h-8 w-8 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0A2540] border-t border-white/10 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navigationStructure.map((item) => {
              if ("items" in item) {
                return (
                  <div key={item.label} className="space-y-2">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between text-[16px] font-medium text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-2 border-l border-white/10 ml-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-[14px] text-white/70 hover:text-white transition-colors"
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
              if (item.href === "/developer") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[16px] font-medium text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[16px] font-medium text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4 sm:hidden">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent text-white border-white/20 hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/get-started" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-[#4C6FFF] hover:bg-[#3b5bdb] text-white">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
