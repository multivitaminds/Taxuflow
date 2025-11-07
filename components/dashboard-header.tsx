"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardHeaderProps {
  userName: string
  userEmail: string
}

export function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Sign out failed")
      }

      // Clear client-side storage
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }

      // Force full page reload to clear all state and cookies
      window.location.href = "/login"
    } catch (error) {
      console.error("[v0] Sign out error:", error)
      // Force redirect even on error to ensure user is logged out
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
      }
      window.location.href = "/login"
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-foreground">Tax</span>
            <span className="text-accent">u</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">{userEmail}</span>
            </div>

            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="hover:text-[#2ACBFF]">
                <Settings className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>

            <Button onClick={handleSignOut} variant="ghost" size="sm" className="hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
