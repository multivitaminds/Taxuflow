"use client"

import { useEffect, useState } from "react"
import { useDemoMode } from "@/lib/demo/context"

export function DemoDataInitializer() {
  const { isDemoMode, isAuthenticated, user } = useDemoMode()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isDemoMode && isAuthenticated && user && !isInitialized) {
      setIsInitialized(true)

      const timeoutId = setTimeout(() => {
        console.log("[v0] Demo data initialization timed out")
      }, 5000)

      fetch("/api/demo/seed", {
        method: "POST",
      })
        .then((res) => {
          clearTimeout(timeoutId)
          if (!res.ok) {
            return null
          }
          return res.json()
        })
        .then(() => {
          // Demo data initialized
        })
        .catch(() => {
          clearTimeout(timeoutId)
        })
    }
  }, [isDemoMode, isAuthenticated, user, isInitialized])

  return null
}
