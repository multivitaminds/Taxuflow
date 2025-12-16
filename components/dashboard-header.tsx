"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { OrganizationSelector } from "@/components/organization-selector"
import { DemoModeIndicator } from "@/components/demo-mode-indicator"

interface DashboardHeaderProps {
  userName: string
  userEmail: string
  userId?: string
}

export function DashboardHeader({ userName, userEmail, userId }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      console.log("[v0] Starting sign out...")

      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()

        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
        })
      }

      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })

      console.log("[v0] Sign out successful, redirecting to login...")
      window.location.replace("/login")
    } catch (error) {
      console.error("[v0] Sign out error:", error)
      window.location.replace("/login")
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="text-foreground">Tax</span>
              <span className="text-accent">u</span>
            </Link>
            <DemoModeIndicator />
          </div>

          <div className="flex items-center gap-2">
            {userId && <OrganizationSelector userId={userId} />}

            <div className="hidden sm:flex flex-col items-end mr-3">
              <span className="text-xs font-medium leading-tight">{userName}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{userEmail}</span>
            </div>

            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="hover:text-[#2ACBFF] h-7 px-2 text-xs">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>

            <Button onClick={handleSignOut} variant="ghost" size="sm" className="hover:text-red-400 h-7 px-2 text-xs">
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
