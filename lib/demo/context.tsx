"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface DemoModeContextType {
  isDemoMode: boolean
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: false,
  isAuthenticated: false,
  user: null,
  isLoading: true,
})

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()
    let mounted = true

    const checkSession = async () => {
      try {
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Session check timeout")), 10000),
        )

        const result = await Promise.race([sessionPromise, timeoutPromise])

        if (!mounted) return

        if (result && typeof result === "object" && "data" in result) {
          const {
            data: { session },
          } = result as { data: { session: any } }

          if (session?.user) {
            setIsAuthenticated(true)
            setUser(session.user)
            const isDemoUser = session.user.email?.includes("demo") || session.user.email?.includes("test") || true
            setIsDemoMode(isDemoUser)
          } else {
            setIsAuthenticated(false)
            setUser(null)
            setIsDemoMode(false)
          }
        }
      } catch (error) {
        if (!mounted) return
        setIsAuthenticated(false)
        setUser(null)
        setIsDemoMode(false)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      if (session?.user) {
        setIsAuthenticated(true)
        setUser(session.user)
        const isDemoUser = session.user.email?.includes("demo") || session.user.email?.includes("test") || true
        setIsDemoMode(isDemoUser)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setIsDemoMode(false)
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <DemoModeContext.Provider value={{ isDemoMode, isAuthenticated, user, isLoading }}>
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (!context) {
    throw new Error("useDemoMode must be used within DemoModeProvider")
  }
  return context
}
