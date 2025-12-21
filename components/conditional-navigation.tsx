"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { useEffect, useState } from "react"
import { useDemoMode } from "@/lib/demo/context"

export function ConditionalNavigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, isLoading } = useDemoMode()

  useEffect(() => {
    setMounted(true)
  }, [])

  const hideNavigation =
    pathname.startsWith("/chat") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/accounting") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/neobank") ||
    pathname.startsWith("/investments") ||
    pathname.startsWith("/1099-filing") ||
    pathname.startsWith("/w2-filing") ||
    pathname.startsWith("/settings")

  // Hide if on protected routes OR if user is authenticated (demo banner will show instead)
  if (hideNavigation || (!isLoading && isAuthenticated)) {
    return null
  }

  if (!mounted) {
    return <div className="h-16" /> // Placeholder to maintain layout
  }

  return <Navigation />
}
