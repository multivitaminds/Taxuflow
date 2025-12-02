"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Demo Mode Badge */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              Tax<span className="text-indigo-600">u</span>
            </span>
          </Link>
          {isDemoMode && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              <Sparkles className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
          )}
        </div>

        {/* Right Side: User Name, Settings, Sign Out */}
        <div className="flex items-center gap-4">
          {userName && <span className="text-sm font-medium text-slate-700">{userName}</span>}

          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-700 hover:text-slate-900">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-700 hover:text-slate-900"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
