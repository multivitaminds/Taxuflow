"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, CreditCard, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserMenuProps {
  user: SupabaseUser
  profile: {
    full_name: string | null
    subscription_tier: string
  } | null
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const userName = profile?.full_name || user.email?.split("@")[0] || "User"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    console.log("[v0] Logging out user")

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("[v0] Logout error:", error)
        alert("Failed to log out. Please try again.")
        setIsLoggingOut(false)
        return
      }

      console.log("[v0] Logout successful, redirecting to home")
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("[v0] Unexpected logout error:", err)
      alert("An unexpected error occurred. Please try again.")
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full border-2 border-neon/20 hover:border-neon/40 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-neon to-blue-500 text-background font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-card border-neon/20" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2 p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-neon to-blue-500 text-background font-bold text-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-semibold leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Plan</span>
              <span className="text-xs font-semibold text-neon">{profile?.subscription_tier || "Free"}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer">
          <User className="mr-3 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
          <Settings className="mr-3 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/pricing")} className="cursor-pointer">
          <CreditCard className="mr-3 h-4 w-4" />
          <span>Billing & Plans</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/documents")} className="cursor-pointer">
          <FileText className="mr-3 h-4 w-4" />
          <span>My Documents</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={() => router.push("/help")} className="cursor-pointer">
          <HelpCircle className="mr-3 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-500/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
