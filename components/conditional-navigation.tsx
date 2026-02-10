"use client"

import { usePathname } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { useEffect, useState } from "react"

export function ConditionalNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hideNavigation =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/accounting") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/products/") ||
    pathname.startsWith("/solutions/") ||
    pathname === "/guides" ||
    pathname === "/support" ||
    pathname === "/newsroom" ||
    pathname === "/jobs" ||
    pathname === "/press" ||
    pathname === "/sitemap-page"

  if (hideNavigation) {
    return null
  }

  if (!mounted) {
    return <div className="h-16" /> // Placeholder to maintain layout
  }

  return <Navigation />
}
