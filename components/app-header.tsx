"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { NotificationBell } from "@/components/notification-bell"
import { CompanySwitcher } from "@/components/company-switcher"

interface AppHeaderProps {
  userName?: string
  isDemoMode?: boolean
}

export function AppHeader({ userName, isDemoMode }: AppHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-slate-200">
      <div className="flex h-11 items-center justify-between px-4">
        {/* Logo and Demo Mode Badge */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold">Taxu</span>
          </Link>
          {isDemoMode && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200 text-xs py-0">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Demo Mode
            </Badge>
          )}
          <CompanySwitcher />
        </div>

        {/* Right Side: Notifications, User Name, Settings, Sign Out */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          {userName && <span className="text-xs font-medium text-slate-700">{userName}</span>}

          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="gap-1.5 text-slate-700 hover:text-slate-900 h-7 px-2 text-xs">
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-slate-700 hover:text-slate-900 h-7 px-2 text-xs"
            onClick={handleSignOut}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
