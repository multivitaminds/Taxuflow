"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"

export function ConditionalNavigation() {
  const pathname = usePathname()

  const hideNavigation =
    pathname.startsWith("/chat") || pathname.startsWith("/dashboard") || pathname.startsWith("/accounting")

  if (hideNavigation) {
    return null
  }

  return <Navigation />
}
